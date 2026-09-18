import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { bookThemes, getThemeById, type BookTheme } from '../themeData';

interface ThemeSelectionProps {
  selectedGenre: string;
  selectedTheme: string | null;
  onSelect: (themeId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const genreToCategory: Record<string, string> = {
  fantasy: 'Fantasy', science: 'Science', animals: 'Animals', technology: 'Technology',
  art: 'Art', sports: 'Sports', environment: 'Environment', general: 'Fantasy',
};

export const ThemeSelection: React.FC<ThemeSelectionProps> = ({ selectedGenre, selectedTheme, onSelect, onBack, onNext }) => {
  const category = genreToCategory[selectedGenre];
  const matched = category ? bookThemes.filter((theme) => theme.category === category) : [];
  const themes = matched.length ? matched : bookThemes;

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .25 }} className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-6"><div className="max-w-3xl"><p className="story-label mb-3 text-primary">Now, give it a look</p><h1 className="story-display text-4xl sm:text-5xl">Choose your book's mood.</h1><p className="mt-4 text-slate-600">A theme gives your pages a starting style. You can change it later in the editor.</p></div><button type="button" onClick={onBack} className="story-action story-action-outline"><ArrowLeft size={17} /> Genres</button></div>
      <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {themes.map((theme: BookTheme) => {
          const selected = selectedTheme === theme.id;
          return <button key={theme.id} type="button" onClick={() => onSelect(theme.id)} aria-pressed={selected} className={`group min-w-0 rounded-xl border-2 bg-[var(--color-paper)] p-2 text-left transition-all hover:-translate-y-0.5 ${selected ? 'border-primary shadow-lg' : 'border-transparent hover:border-[var(--color-rule)]'}`}>
            <span className="book-cover relative flex aspect-[3/4] min-w-0 flex-col justify-between p-4 sm:p-5" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
              <span className="story-label text-[.6rem]">A book by you</span><span className="story-display text-lg sm:text-2xl">{theme.name}</span><span className="flex gap-1"><span className="h-4 w-4 rounded-full" style={{ backgroundColor: theme.colors.primary }} /><span className="h-4 w-4 rounded-full" style={{ backgroundColor: theme.colors.accent }} /></span>
              {selected && <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[var(--color-paper)]"><Check size={16} /></span>}
            </span>
            <span className="block px-1 pb-1 pt-3 text-sm font-bold text-ink">{theme.name}</span>
            <span className="block px-1 pb-2 text-xs text-slate-500">{theme.category}</span>
          </button>;
        })}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-rule)] pt-6"><p className="text-sm text-slate-600">{selectedTheme ? `${getThemeById(selectedTheme)?.name} selected` : 'Choose one cover to continue.'}</p><button type="button" onClick={onNext} disabled={!selectedTheme} className="story-action">Next: book details <ArrowRight size={17} /></button></div>
    </motion.section>
  );
};
