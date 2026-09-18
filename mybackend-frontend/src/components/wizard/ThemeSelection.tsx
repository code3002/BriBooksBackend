import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { bookThemes, getThemeById, type BookTheme } from '../themeData';

interface ThemeSelectionProps {
    selectedGenre: string;
    selectedTheme: string | null;
    onSelect: (themeId: string) => void;
    onBack: () => void;
    onNext: () => void;
}

// Map our genre IDs to theme categories
const genreToCategory: Record<string, string> = {
    fantasy: 'Fantasy',
    science: 'Science',
    animals: 'Animals',
    technology: 'Technology',
    art: 'Art',
    sports: 'Sports',
    environment: 'Environment',
    general: 'Fantasy', // Default to Fantasy for general
};

export const ThemeSelection: React.FC<ThemeSelectionProps> = ({
    selectedGenre,
    selectedTheme,
    onSelect,
    onBack,
    onNext,
}) => {
    const category = genreToCategory[selectedGenre] || 'Fantasy';
    const filteredThemes = bookThemes.filter((theme: BookTheme) => theme.category === category);

    // If no themes match, show all themes
    const themesToShow = filteredThemes.length > 0 ? filteredThemes : bookThemes;

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto px-6 py-8"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        What is the theme of your book?
                    </h1>
                    <p className="text-slate-600">
                        Select a theme that matches your story's mood
                    </p>
                </div>
                <Button variant="outline" onClick={onBack} className="whitespace-nowrap">
                    ← Change Genre
                </Button>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {themesToShow.map((theme: BookTheme, index: number) => {
                    const isSelected = selectedTheme === theme.id;

                    return (
                        <motion.div
                            key={theme.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect(theme.id)}
                            className={`relative cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-all ${isSelected
                                    ? 'ring-4 ring-green-500 shadow-green-200'
                                    : 'hover:shadow-xl'
                                }`}
                        >
                            {/* Cover/Preview */}
                            <div
                                className="aspect-[3/4] flex items-center justify-center text-5xl md:text-6xl p-6"
                                style={{ background: theme.colors.background }}
                            >
                                {theme.preview}
                            </div>

                            {/* Theme Name */}
                            <div className="bg-white p-3 md:p-4">
                                <h3 className="font-semibold text-sm md:text-base text-slate-900 text-center mb-1">
                                    {theme.name}
                                </h3>
                                <p className="text-xs text-slate-500 text-center">
                                    {theme.category}
                                </p>
                            </div>

                            {/* Selected Checkmark */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 right-3 bg-green-500 rounded-full p-2 shadow-lg"
                                >
                                    <Check className="h-5 w-5 md:h-6 md:w-6 text-white" />
                                </motion.div>
                            )}

                            {/* Popular Badge */}
                            {theme.popular && !isSelected && (
                                <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                                    Popular
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={onBack}>
                    ← Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!selectedTheme}
                    size="lg"
                    className="px-8"
                >
                    Next →
                </Button>
            </div>

            <div className="text-center mt-6">
                <p className="text-sm text-slate-500">
                    {selectedTheme
                        ? `Selected: ${getThemeById(selectedTheme)?.name}`
                        : 'Please select a theme to continue'}
                </p>
            </div>
        </motion.div>
    );
};
