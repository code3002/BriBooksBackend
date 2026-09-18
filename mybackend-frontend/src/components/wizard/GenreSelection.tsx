import React from 'react';
import { motion } from 'framer-motion';
import { genres } from './genreData';

interface GenreSelectionProps {
    onSelect: (genreId: string) => void;
}

export const GenreSelection: React.FC<GenreSelectionProps> = ({ onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto px-6 py-8"
        >
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
                >
                    What is the Genre of your book?
                </motion.h1>
                <p className="text-lg text-slate-600">
                    Choose a genre that best fits your story
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {genres.map((genre, index) => (
                    <motion.button
                        key={genre.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(genre.id)}
                        className="group relative bg-white rounded-2xl p-6 shadow-md border-2 border-transparent hover:border-primary hover:shadow-xl transition-all"
                    >
                        {/* Icon Circle */}
                        <div
                            className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl md:text-4xl mb-4 transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${genre.color}15` }}
                        >
                            {genre.icon}
                        </div>

                        {/* Genre Name */}
                        <h3 className="font-semibold text-sm md:text-base text-slate-900 text-center mb-1">
                            {genre.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-500 text-center line-clamp-2">
                            {genre.description}
                        </p>

                        {/* Hover Effect - Arrow */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-primary/10 rounded-full p-2">
                                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            <div className="text-center mt-8">
                <p className="text-sm text-slate-500">
                    Don't worry, you can change this later!
                </p>
            </div>
        </motion.div>
    );
};
