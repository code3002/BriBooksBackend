import { useCallback, useEffect, useRef, useState } from 'react';
import { aiService } from '../services/api/ai.service';

interface UseVoiceRecordingReturn {
    isListening: boolean;
    isProcessing: boolean;
    transcript: string;
    error: string | null;
    isSupported: boolean;
    startListening: () => Promise<void>;
    stopListening: () => void;
    toggleListening: () => Promise<void>;
    resetTranscript: () => void;
}

const MAX_RECORDING_MS = 60_000;
const MAX_AUDIO_BYTES = 6_000_000;
const supportedMimeTypes = ['audio/webm', 'audio/ogg', 'audio/mp4'];

function arrayBufferToBase64(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return btoa(binary);
}

function getErrorMessage(error: unknown) {
    const candidate = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
    return candidate.response?.data?.error?.message || candidate.message || 'The recording could not be transcribed. Please try again.';
}

export const useVoiceRecording = (): UseVoiceRecordingReturn => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    const isSupported = typeof navigator !== 'undefined'
        && Boolean(navigator.mediaDevices?.getUserMedia)
        && typeof MediaRecorder !== 'undefined';

    const releaseStream = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        timerRef.current = null;
    }, []);

    useEffect(() => releaseStream, [releaseStream]);

    const stopListening = useCallback(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    }, []);

    const startListening = useCallback(async () => {
        if (!isSupported) {
            setError('Voice recording needs a browser with microphone recording support. Try current Chrome, Edge, or Safari.');
            return;
        }
        if (!window.isSecureContext) {
            setError('Microphone access requires HTTPS, except when using localhost.');
            return;
        }
        if (isListening || isProcessing) return;

        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            chunksRef.current = [];
            const mimeType = supportedMimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size) chunksRef.current.push(event.data);
            };
            recorder.onerror = () => {
                setError('The browser could not record from this microphone.');
                setIsListening(false);
                releaseStream();
            };
            recorder.onstop = async () => {
                setIsListening(false);
                releaseStream();
                const audio = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
                chunksRef.current = [];
                if (!audio.size) {
                    setError('No audio was captured. Check the selected microphone and try again.');
                    return;
                }
                if (audio.size > MAX_AUDIO_BYTES) {
                    setError('The recording is too large. Keep it under one minute and try again.');
                    return;
                }
                setIsProcessing(true);
                try {
                    const response = await aiService.transcribeAudio(
                        arrayBufferToBase64(await audio.arrayBuffer()),
                        recorder.mimeType.split(';')[0] || 'audio/webm',
                    );
                    const text = response?.data?.transcript?.trim();
                    if (!text) throw new Error('No speech was detected in the recording.');
                    setTranscript((previous) => `${previous}${text} `);
                } catch (cause) {
                    setError(getErrorMessage(cause));
                } finally {
                    setIsProcessing(false);
                }
            };

            recorder.start(500);
            setIsListening(true);
            timerRef.current = window.setTimeout(stopListening, MAX_RECORDING_MS);
        } catch (cause) {
            const name = cause instanceof DOMException ? cause.name : '';
            if (name === 'NotAllowedError' || name === 'SecurityError') {
                setError('Microphone permission was denied. Allow microphone access in your browser settings and try again.');
            } else if (name === 'NotFoundError') {
                setError('No microphone was found. Connect one and try again.');
            } else {
                setError('The microphone could not be started. Check that another app is not using it.');
            }
            releaseStream();
        }
    }, [isListening, isProcessing, isSupported, releaseStream, stopListening]);

    const toggleListening = useCallback(async () => {
        if (isListening) stopListening();
        else await startListening();
    }, [isListening, startListening, stopListening]);

    const resetTranscript = useCallback(() => setTranscript(''), []);

    return { isListening, isProcessing, transcript, error, isSupported, startListening, stopListening, toggleListening, resetTranscript };
};
