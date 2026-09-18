import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

interface BookDetails { title: string; description: string; ageGroup: string }
interface BookDetailsFormProps { details: BookDetails; onChange: (details: BookDetails) => void; onBack: () => void; onSubmit: () => Promise<void> }
const ageGroups = [
  { value: 'TODDLER', label: 'Toddler (0–3)' }, { value: 'PRESCHOOL', label: 'Preschool (3–5)' },
  { value: 'EARLY_READER', label: 'Early reader (5–7)' }, { value: 'MIDDLE_GRADE', label: 'Middle grade (8–12)' },
  { value: 'YOUNG_ADULT', label: 'Young adult (13+)' },
];

export const BookDetailsForm: React.FC<BookDetailsFormProps> = ({ details, onChange, onBack, onSubmit }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!details.title.trim()) { setError('Give your book a title to continue.'); return; }
    try {
      setSaving(true);
      setError(null);
      await onSubmit();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create your book. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .25 }} className="mx-auto grid max-w-6xl min-w-0 gap-9 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.7fr)] lg:gap-16">
      <div className="min-w-0"><p className="story-label mb-3 text-primary">Almost ready to write</p><h1 className="story-display text-4xl sm:text-5xl">Give your book a beginning.</h1><p className="mt-4 max-w-xl text-slate-600">A title is enough to make a draft. Your idea can grow as you write.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div><label htmlFor="book-title" className="mb-2 block text-sm font-bold">Book title <span className="text-secondary">*</span></label><input id="book-title" className="story-input" maxLength={200} required autoFocus value={details.title} onChange={(event) => onChange({ ...details, title: event.target.value })} placeholder="The day the moon went missing" /><p className="mt-2 text-xs text-slate-500">You can rename it at any time.</p></div>
          <div><label htmlFor="book-description" className="mb-2 block text-sm font-bold">What is it about? <span className="font-normal text-slate-500">Optional</span></label><textarea id="book-description" className="story-input min-h-[120px] resize-y" maxLength={1000} value={details.description} onChange={(event) => onChange({ ...details, description: event.target.value })} placeholder="A brave explorer, a curious question, or just a tiny idea..." /></div>
          <div><label htmlFor="book-age" className="mb-2 block text-sm font-bold">Who is it for?</label><select id="book-age" className="story-input" value={details.ageGroup} onChange={(event) => onChange({ ...details, ageGroup: event.target.value })}>{ageGroups.map((group) => <option key={group.value} value={group.value}>{group.label}</option>)}</select></div>
          {error && <p className="rounded-lg border border-secondary bg-[var(--color-paper)] px-4 py-3 text-sm font-semibold text-ink" role="alert">{error}</p>}
          <div className="flex flex-wrap gap-3 pt-2"><button type="button" onClick={onBack} disabled={saving} className="story-action story-action-outline"><ArrowLeft size={17} /> Themes</button><button type="submit" disabled={saving || !details.title.trim()} className="story-action">{saving ? 'Creating your draft…' : 'Start writing'} {!saving && <ArrowRight size={17} />}</button></div>
        </form>
      </div>
      <aside className="min-w-0 lg:pt-20" aria-label="Book preview"><div className="story-panel bg-[var(--color-paper-2)] p-6 sm:p-9"><p className="story-label mb-6 text-primary">A peek at your book</p><div className="book-cover mx-auto flex aspect-[3/4] max-w-[300px] flex-col justify-between bg-[var(--color-sky)] p-8 text-ink"><span className="story-label">A story by you</span><span className="story-display text-3xl sm:text-4xl">{details.title.trim() || 'Your title goes here'}</span><BookOpen size={38} strokeWidth={1.3} /></div><p className="mt-6 text-center text-sm text-slate-600">Next, you will write your first chapter.</p></div></aside>
    </motion.section>
  );
};
