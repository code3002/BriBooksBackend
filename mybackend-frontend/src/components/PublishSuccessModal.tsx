import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import { Button } from './ui/Button';
import { copyToClipboard, getBookShareUrl, openSocialShare } from '../lib/share';

interface PublishSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookId: string;
    bookTitle: string;
}

export const PublishSuccessModal: React.FC<PublishSuccessModalProps> = ({
    isOpen,
    onClose,
    bookId,
    bookTitle,
}) => {
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const shareUrl = getBookShareUrl(bookId);

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleCopy = async () => {
        const success = await copyToClipboard(shareUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Confetti */}
                    {showConfetti && (
                        <Confetti
                            width={window.innerWidth}
                            height={window.innerHeight}
                            recycle={false}
                            numberOfPieces={500}
                        />
                    )}

                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="relative p-8 pb-6 text-center border-b border-slate-200">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4">
                                    <Sparkles className="h-8 w-8 text-white" />
                                </div>

                                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                    🎉 Book Published!
                                </h2>
                                <p className="text-lg text-slate-600">
                                    Congratulations! <span className="font-semibold">{bookTitle}</span> is now live
                                    and ready to be shared with the world!
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-8 space-y-6">
                                {/* Shareable Link */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        📎 Shareable Link
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={shareUrl}
                                            readOnly
                                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            onClick={(e) => e.currentTarget.select()}
                                        />
                                        <Button
                                            onClick={handleCopy}
                                            className={`gap-2 ${copied ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="h-4 w-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Anyone with this link can read your book
                                    </p>
                                </div>

                                {/* Social Share Buttons */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        📢 Share on Social Media
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <button
                                            onClick={() => openSocialShare('whatsapp', shareUrl, bookTitle)}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            <span className="text-sm font-medium">WhatsApp</span>
                                        </button>

                                        <button
                                            onClick={() => openSocialShare('twitter', shareUrl, bookTitle)}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                            <span className="text-sm font-medium">Twitter</span>
                                        </button>

                                        <button
                                            onClick={() => openSocialShare('facebook', shareUrl, bookTitle)}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                            <span className="text-sm font-medium">Facebook</span>
                                        </button>

                                        <button
                                            onClick={() => openSocialShare('email', shareUrl, bookTitle)}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm font-medium">Email</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        onClick={() => window.open(`/books/${bookId}`, '_blank')}
                                        className="flex-1 gap-2"
                                        variant="outline"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        View Published Book
                                    </Button>
                                    <Button onClick={onClose} className="flex-1">
                                        Done
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
