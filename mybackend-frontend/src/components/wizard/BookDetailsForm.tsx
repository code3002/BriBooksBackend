import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface BookDetails {
    title: string;
    description: string;
    ageGroup: string;
}

interface BookDetailsFormProps {
    details: BookDetails;
    onChange: (details: BookDetails) => void;
    onBack: () => void;
    onSubmit: () => Promise<void>;
}

const ageGroups = [
    { value: 'TODDLER', label: 'Toddler (0-3 years)' },
    { value: 'PRESCHOOL', label: 'Preschool (3-5 years)' },
    { value: 'EARLY_READER', label: 'Early Reader (5-7 years)' },
    { value: 'MIDDLE_GRADE', label: 'Middle Grade (8-12 years)' },
    { value: 'YOUNG_ADULT', label: 'Young Adult (13+ years)' },
];

export const BookDetailsForm: React.FC<BookDetailsFormProps> = ({
    details,
    onChange,
    onBack,
    onSubmit,
}) => {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!details.title.trim()) {
            setError('Please enter a book title');
            return;
        }

        try {
            setSaving(true);
            setError(null);
            await onSubmit();
        } catch (err) {
            console.error('Error creating book:', err);
            setError('Failed to create book. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto px-6 py-8"
        >
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4"
                >
                    <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    Tell us about your book
                </h1>
                <p className="text-slate-600">
                    Just a few details to get started
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                        Book Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={details.title}
                        onChange={(e) => onChange({ ...details, title: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg transition-all"
                        placeholder="Enter your book title..."
                        required
                        autoFocus
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Choose a catchy title that captures your story
                    </p>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        value={details.description}
                        onChange={(e) => onChange({ ...details, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none transition-all"
                        placeholder="What is your book about? Tell us the main idea..."
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        You can always add or edit this later
                    </p>
                </div>

                <div>
                    <label htmlFor="ageGroup" className="block text-sm font-medium text-slate-700 mb-2">
                        Age Group <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="ageGroup"
                        value={details.ageGroup}
                        onChange={(e) => onChange({ ...details, ageGroup: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        required
                    >
                        {ageGroups.map((group) => (
                            <option key={group.value} value={group.value}>
                                {group.label}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                        Who are you writing this book for?
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="flex-1 order-2 sm:order-1"
                        disabled={saving}
                    >
                        ← Back
                    </Button>
                    <Button
                        type="submit"
                        disabled={saving || !details.title.trim()}
                        className="flex-1 order-1 sm:order-2"
                    >
                        {saving ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="mr-2"
                                >
                                    ⏳
                                </motion.div>
                                Creating...
                            </>
                        ) : (
                            <>
                                Start Writing →
                            </>
                        )}
                    </Button>
                </div>
            </form>

            <div className="text-center mt-6">
                <p className="text-xs text-slate-500">
                    🎉 You're just one click away from writing your book!
                </p>
            </div>
        </motion.div>
    );
};
