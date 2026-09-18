import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { booksService, type Book } from '../services/api/books.service';

const ageGroups = [
  { value: '', label: 'All ages' },
  { value: 'TODDLER', label: '0–3' },
  { value: 'PRESCHOOL', label: '3–5' },
  { value: 'EARLY_READER', label: '5–7' },
  { value: 'MIDDLE_GRADE', label: '8–12' },
  { value: 'YOUNG_ADULT', label: '13+' },
];

export const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    booksService.getPublishedBooks({ page, limit: 12, search, ageGroup: ageGroup || undefined })
      .then((response) => { if (active) { setBooks(response.data || []); setTotalPages(response.meta.totalPages); setError(''); } })
      .catch(() => { if (active) setError('The bookshelf could not be loaded. Please try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, search, ageGroup]);

  return <div className="min-h-screen bg-[var(--color-paper)]">
    <section className="border-b border-[var(--color-rule)] bg-[var(--color-sky)]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="story-label mb-4 text-primary">The reading shelf</p>
        <h1 className="story-display max-w-3xl text-4xl sm:text-6xl">Find a story to get lost in.</h1>
        <p className="mt-5 max-w-xl text-lg text-slate-700">Discover books made by young authors. Your next favorite adventure might be waiting here.</p>
      </div>
    </section>
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
      <form className="mb-7 flex max-w-2xl gap-2" onSubmit={(event) => { event.preventDefault(); if (query.trim() !== search || page !== 1) setLoading(true); setPage(1); setSearch(query.trim()); }}>
        <label className="relative flex-1"><span className="sr-only">Search books</span><Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input className="story-input pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search books and ideas" /></label>
        <button className="story-action" type="submit">Search</button>
      </form>
      <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter by reader age">
        {ageGroups.map((group) => <button key={group.value} type="button" onClick={() => { if (group.value !== ageGroup || page !== 1) setLoading(true); setAgeGroup(group.value); setPage(1); }} aria-pressed={ageGroup === group.value} className={`min-h-10 rounded-full border border-[var(--color-rule)] px-4 text-sm font-semibold ${ageGroup === group.value ? 'bg-primary text-[var(--color-paper)]' : 'hover:bg-[var(--color-paper-2)]'}`}>{group.label}</button>)}
      </div>
      {error && <p role="alert" className="story-panel mb-6 p-5">{error}</p>}
      {loading ? <p className="py-20 text-slate-600">Opening the shelf…</p> : books.length ? <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book, index) => <Link to={`/books/${book.id}`} key={book.id} className="group story-panel flex min-h-[300px] min-w-0 flex-col overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"><div className={`h-4 ${index % 3 === 0 ? 'bg-[var(--color-coral)]' : index % 3 === 1 ? 'bg-[var(--color-pear)]' : 'bg-[var(--color-sky)]'}`} /><div className="flex flex-1 flex-col p-6"><BookOpen size={28} strokeWidth={1.4} className="text-primary" /><p className="story-label mt-9 text-primary">{ageGroups.find((item) => item.value === book.ageGroup)?.label || 'Story'} readers</p><h2 className="story-display mt-3 line-clamp-3 text-2xl">{book.title}</h2><p className="mt-3 line-clamp-2 text-sm text-slate-600">{book.description || 'A new story is ready to read.'}</p><span className="mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-primary">Read book <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></span></div></Link>)}
      </div> : <div className="story-panel flex min-h-[260px] flex-col items-center justify-center p-8 text-center"><BookOpen size={38} className="text-primary" strokeWidth={1.4} /><h2 className="story-display mt-5 text-2xl">No books on this shelf yet.</h2><p className="mt-3 text-sm text-slate-600">Try another search or begin your own story.</p><Link to="/start-writing" className="story-action mt-6">Start your book <ArrowRight size={17} /></Link></div>}
      {totalPages > 1 && <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Books pages"><button className="story-action story-action-outline" disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }}>Previous</button><span className="text-sm font-semibold">{page} of {totalPages}</span><button className="story-action story-action-outline" disabled={page >= totalPages} onClick={() => { setLoading(true); setPage(page + 1); }}>Next</button></nav>}
    </main>
  </div>;
};
