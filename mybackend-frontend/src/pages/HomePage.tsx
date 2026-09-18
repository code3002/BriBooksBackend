import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, PenLine, Sparkles, Globe2 } from 'lucide-react';
import { booksService, type Book } from '../services/api/books.service';

const journey = [
  { number: '01', title: 'Find your story', text: 'Pick the kind of story you want to tell, then choose a look for your book.', icon: BookOpen },
  { number: '02', title: 'Write one chapter at a time', text: 'Start with a first sentence. Save a draft and return whenever a new idea appears.', icon: PenLine },
  { number: '03', title: 'Share a finished book', text: 'Preview your pages and publish online when your story feels ready.', icon: Globe2 },
];

export const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    let active = true;
    booksService.getPublishedBooks({ limit: 3 }).then((response) => {
      if (active) setBooks(response.data || []);
    }).catch(() => {
      if (active) setBooks([]);
    });
    return () => { active = false; };
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-rule)] bg-[var(--color-paper)]">
        <div className="mx-auto grid max-w-7xl min-w-0 grid-cols-1 items-center gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-16 lg:py-28">
          <div className="min-w-0">
            <p className="story-label mb-7 flex items-center gap-3 text-primary"><span className="h-2 w-2 rounded-full bg-secondary" /> A home for young storytellers</p>
            <h1 className="story-display max-w-3xl text-[clamp(2.55rem,7vw,6.5rem)] text-ink">Every great book starts with <span className="relative inline-block">one idea<span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 bg-accent" /></span></h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-700">Bring your imagination to the page. Choose a story direction, make it yours, and write a book you can share with the world.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link className="story-action" to="/start-writing">Start your book <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link className="story-action story-action-outline" to="/books">Explore books</Link>
            </div>
            <p className="story-label mt-10 text-slate-500">An idea → a draft → a book</p>
          </div>

          <div className="relative mx-auto flex h-[390px] w-full max-w-[500px] items-center justify-center sm:h-[480px]" aria-label="Illustration of a stack of story books" role="img">
            <div className="absolute inset-6 rounded-[40px] bg-[var(--color-pear)] sm:inset-8" />
            <div className="absolute left-[9%] top-[8%] h-20 w-20 rounded-full border-[12px] border-[var(--color-sky)] sm:h-24 sm:w-24" />
            <div className="absolute bottom-[12%] right-[3%] h-24 w-24 rounded-full bg-[var(--color-coral)] sm:h-32 sm:w-32" />
            <div className="book-cover absolute left-[13%] top-[22%] h-[60%] w-[49%] -rotate-12 bg-[var(--color-primary)] p-6 text-[var(--color-paper)] sm:p-8">
              <span className="story-label block text-[var(--color-pear)]">The little idea library</span>
              <span className="story-display mt-12 block text-3xl sm:text-4xl">A world<br />of my<br />own</span>
              <span className="absolute bottom-7 left-7 h-14 w-14 rounded-full bg-[var(--color-coral)]" />
            </div>
            <div className="book-cover absolute right-[10%] top-[18%] h-[65%] w-[50%] rotate-6 bg-[var(--color-sky)] p-6 text-ink sm:p-8">
              <span className="story-label">A story by you</span>
              <span className="story-display mt-14 block text-3xl sm:text-4xl">What<br />happens<br />next?</span>
              <Sparkles className="absolute bottom-8 right-7 h-16 w-16 text-primary" strokeWidth={1.4} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="journey-heading">
        <div className="mb-12 grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,.55fr)]">
          <div><p className="story-label mb-4 text-primary">The writing journey</p><h2 id="journey-heading" className="story-display text-4xl sm:text-5xl">From a spark to a story</h2></div>
          <p className="max-w-md text-slate-700 md:justify-self-end">The next step is always clear, whether you are planning your first page or finishing your last.</p>
        </div>
        <div className="border-t border-[var(--color-rule)]">
          {journey.map(({ number, title, text, icon: Icon }) => (
            <div key={number} className="grid gap-4 border-b border-[var(--color-rule)] py-7 sm:grid-cols-[70px_minmax(0,.75fr)_minmax(0,1fr)_45px] sm:items-center sm:gap-6">
              <span className="story-label text-secondary">{number}</span>
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h3>
              <p className="max-w-xl leading-relaxed text-slate-600">{text}</p>
              <Icon className="hidden text-primary sm:block" size={30} strokeWidth={1.5} aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-primary)] px-5 py-20 text-[var(--color-paper)] sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:items-center">
          <div><p className="story-label mb-4 text-[var(--color-pear)]">The reading shelf</p><h2 className="story-display text-4xl sm:text-5xl">Stories made by young minds.</h2><p className="mt-6 max-w-md leading-relaxed text-[var(--color-paper-2)]">Explore books that are already published, then make room for your own.</p><Link to="/books" className="story-action mt-8 bg-[var(--color-pear)] text-ink hover:bg-[var(--color-sky)]">Browse the shelf <ArrowRight size={18} /></Link></div>
          {books.length ? (
            <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-3">
              {books.map((book, index) => (
                <Link to={`/books/${book.id}`} key={book.id} className={`book-cover flex min-h-[235px] min-w-0 flex-col justify-between p-5 text-ink transition-transform hover:-translate-y-2 sm:min-h-[290px] ${index === 1 ? 'bg-[var(--color-coral)]' : index === 2 ? 'bg-[var(--color-pear)]' : 'bg-[var(--color-sky)]'}`}>
                  <span className="story-label">BriBooks story</span><span className="story-display text-xl sm:text-2xl">{book.title}</span><span className="text-xs font-semibold">Read this book →</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="story-panel flex min-h-[250px] flex-col items-center justify-center p-8 text-center text-ink"><BookOpen size={40} strokeWidth={1.3} /><p className="mt-4 text-xl font-bold">The shelf is waiting for its first story.</p><p className="mt-2 text-sm text-slate-600">Your book could be the one that starts it.</p></div>
          )}
        </div>
      </section>
    </div>
  );
};
