import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, PenLine, Plus } from 'lucide-react';
import { booksService, type Book } from '../services/api/books.service';
import { useAuth } from '../context/AuthContext';

type Shelf = 'all' | 'drafts' | 'published';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shelf, setShelf] = useState<Shelf>('all');

  useEffect(() => {
    let active = true;
    booksService.getUserBooks().then((response) => {
      if (active) setBooks(response.data || []);
    }).catch(() => {
      if (active) setError('Could not load your books. Please refresh the page.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const drafts = books.filter((book) => book.status === 'DRAFT').length;
  const published = books.filter((book) => book.status === 'PUBLISHED').length;
  const visible = useMemo(() => books.filter((book) => shelf === 'all' || (shelf === 'drafts' ? book.status === 'DRAFT' : book.status === 'PUBLISHED')), [books, shelf]);

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <section className="border-b border-[var(--color-rule)] bg-[var(--color-paper-2)]">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:py-16">
          <div><p className="story-label mb-4 text-primary">Your writing desk</p><h1 className="story-display text-4xl sm:text-5xl">Your stories, {user?.name?.split(' ')[0] || 'author'}.</h1><p className="mt-5 max-w-xl text-slate-600">Continue a draft, revisit a published book, or begin something entirely new.</p></div>
          <Link to="/start-writing" className="story-action justify-self-start"><Plus size={18} /> Start a new book</Link>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="mb-11 grid grid-cols-2 gap-3 sm:max-w-xl"><div className="story-panel p-5"><p className="story-label text-slate-500">In progress</p><p className="story-display mt-3 text-4xl">{drafts}</p></div><div className="story-panel p-5"><p className="story-label text-slate-500">Published</p><p className="story-display mt-3 text-4xl">{published}</p></div></div>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><p className="story-label mb-2 text-primary">Your library</p><h2 className="story-display text-3xl sm:text-4xl">Books you are making</h2></div><div className="flex gap-1 rounded-full border border-[var(--color-rule)] p-1" role="group" aria-label="Filter your books">{(['all', 'drafts', 'published'] as Shelf[]).map((option) => <button type="button" key={option} onClick={() => setShelf(option)} aria-pressed={shelf === option} className={`min-h-10 rounded-full px-3 text-xs font-bold capitalize sm:px-4 sm:text-sm ${shelf === option ? 'bg-primary text-[var(--color-paper)]' : 'text-slate-600 hover:text-primary'}`}>{option}</button>)}</div></div>
        {error && <p role="alert" className="story-panel p-5 text-sm font-semibold">{error}</p>}
        {loading ? <p className="py-14 text-slate-600">Opening your library…</p> : visible.length ? (
          <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((book, index) => <Link to={`/editor/${book.id}`} key={book.id} className="group story-panel flex min-h-[260px] min-w-0 flex-col overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"><div className={`h-3 ${index % 3 === 0 ? 'bg-[var(--color-coral)]' : index % 3 === 1 ? 'bg-[var(--color-sky)]' : 'bg-[var(--color-pear)]'}`} /><div className="flex flex-1 flex-col p-6"><div className="flex items-center justify-between gap-3"><span className="story-label text-primary">{book.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span><BookOpen size={22} strokeWidth={1.5} /></div><h3 className="story-display mt-7 line-clamp-2 text-2xl">{book.title}</h3><p className="mt-3 line-clamp-2 text-sm text-slate-600">{book.description || 'The first chapter is waiting to be written.'}</p><span className="mt-auto flex items-center gap-2 pt-7 text-sm font-bold text-primary">{book.status === 'PUBLISHED' ? 'Open book' : 'Continue writing'} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></span></div></Link>)}
          </div>
        ) : (
          <div className="story-panel flex min-h-[290px] flex-col items-center justify-center px-6 py-12 text-center"><PenLine size={36} strokeWidth={1.5} className="text-primary" /><h3 className="story-display mt-5 text-2xl">{books.length ? 'No books on this shelf yet.' : 'Your first story starts here.'}</h3><p className="mt-3 max-w-sm text-sm text-slate-600">{books.length ? 'Choose a different filter or start a new book.' : 'You only need a title and an idea to make your first draft.'}</p><Link to="/start-writing" className="story-action mt-6">Write a book <ArrowRight size={17} /></Link></div>
        )}
      </main>
    </div>
  );
};
