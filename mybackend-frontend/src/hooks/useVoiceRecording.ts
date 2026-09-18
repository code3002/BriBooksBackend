import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceRecordingReturn {
    isListening: boolean;
    transcript: string;
    error: string | null;
    isSupported: boolean;
    startListening: () => void;
    stopListening: () => void;
    toggleListening: () => void;
    resetTranscript: () => void;
}

interface SpeechRecognitionEvent {
    resultIndex: number;
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
                isFinal: boolean;
            };
            isFinal: boolean;
            length: number;
        };
        length: number;
    };
}

interface SpeechRecognitionErrorEvent {
    error: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onstart: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: {
            new (): SpeechRecognition;
        };
        webkitSpeechRecognition: {
            new (): SpeechRecognition;
        };
    }
}

export const useVoiceRecording = (): UseVoiceRecordingReturn => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        // Check if browser supports Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsSupported(true);

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
            setError(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPiece = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPiece + ' ';
                }
            }

            // Update transcript with final results
            if (finalTranscript) {
                setTranscript(prev => prev + finalTranscript);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);

            let errorMessage = 'Voice recognition error occurred.';

            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not found or not working.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone permission denied. Please allow microphone access.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your internet connection.';
                    break;
                default:
                    errorMessage = `Voice recognition error: ${event.error}`;
            }

            setError(errorMessage);
            setIsListening(false);
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch {
                    // Ignore errors on cleanup
                }
            }
        };
    }, []);

    // Set error if not supported after effect runs
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError('Voice recording not supported in this browser. Please use Chrome or Safari.');
            setIsSupported(false);
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening && isSupported) {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error('Failed to start recognition:', error);
                setError('Failed to start voice recognition. Please try again.');
            }
        }
    }, [isListening, isSupported]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error('Failed to stop recognition:', error);
            }
        }
    }, [isListening]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        isListening,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        toggleListening,
        resetTranscript,
    };
};
