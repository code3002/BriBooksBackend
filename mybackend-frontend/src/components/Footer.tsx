import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="border-t border-[var(--color-rule)] bg-[var(--color-paper-2)]">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-extrabold tracking-[-.06em] text-ink"><BookOpen size={22} /> bribooks<span className="text-secondary">.</span></Link>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">A space to imagine, write, and share a story of your own.</p>
      </div>
      <nav className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold" aria-label="Footer navigation"><Link to="/start-writing" className="whitespace-nowrap hover:text-primary">Write a book</Link><Link to="/books" className="whitespace-nowrap hover:text-primary">Explore books</Link><Link to="/dashboard" className="whitespace-nowrap hover:text-primary">My books</Link></nav>
    </div>
    <div className="mx-auto max-w-7xl border-t border-[var(--color-rule)] px-5 py-5 text-xs text-slate-500 sm:px-8">Made for the stories only you can tell.</div>
  </footer>
);
