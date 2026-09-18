import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { genres } from './genreData';

interface GenreSelectionProps { onSelect: (genreId: string) => void }

export const GenreSelection: React.FC<GenreSelectionProps> = ({ onSelect }) => (
  <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .25 }} className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
    <div className="mb-9 max-w-3xl"><p className="story-label mb-3 text-primary">First, find your direction</p><h1 className="story-display text-4xl sm:text-5xl">What kind of story is on your mind?</h1><p className="mt-4 text-slate-600">Pick one to get started. You can take the story anywhere from here.</p></div>
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {genres.map((genre, index) => (
        <button key={genre.id} type="button" onClick={() => onSelect(genre.id)} className="group story-panel flex min-h-[142px] min-w-0 flex-col justify-between p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg focus-visible:border-primary">
          <div className="flex items-start justify-between"><span className="story-label text-secondary">{String(index + 1).padStart(2, '0')}</span><ArrowUpRight size={21} className="text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" /></div>
          <div><h2 className="text-lg font-bold tracking-tight text-ink">{genre.name}</h2><p className="mt-1 text-sm leading-snug text-slate-600">{genre.description}</p></div>
        </button>
      ))}
    </div>
  </motion.section>
);
