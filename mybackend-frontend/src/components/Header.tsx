import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="relative z-50 border-b border-[var(--color-rule)] bg-[var(--color-paper)]">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 text-ink" aria-label="BriBooks home">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary text-[var(--color-paper)]"><BookOpen size={20} strokeWidth={2.4} /></span>
          <span className="font-display text-xl font-extrabold tracking-[-.07em]">bri<span className="text-primary">books</span><span className="text-secondary">.</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Link to="/books" className="text-sm font-semibold text-ink hover:text-primary">Explore books</Link>
          {isAuthenticated && <Link to="/dashboard" className="text-sm font-semibold text-ink hover:text-primary">My books</Link>}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="max-w-36 truncate text-sm text-slate-600">Hi, {user?.name?.split(' ')[0]}</span>
              <button type="button" onClick={() => void logout()} className="text-sm font-semibold text-ink hover:text-primary">Sign out</button>
              <Link to="/start-writing" className="story-action">Write a book <span aria-hidden="true">↗</span></Link>
            </>
          ) : (
            <><Link to="/login" className="text-sm font-semibold text-ink hover:text-primary">Sign in</Link><Link to="/start-writing" className="story-action">Write a book <span aria-hidden="true">↗</span></Link></>
          )}
        </div>
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--color-rule)] md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-[var(--color-rule)] bg-[var(--color-paper)] px-5 py-4 md:hidden" aria-label="Mobile navigation">
          <Link to="/books" onClick={() => setOpen(false)} className="min-h-11 py-2.5 font-semibold">Explore books</Link>
          {isAuthenticated && <Link to="/dashboard" onClick={() => setOpen(false)} className="min-h-11 py-2.5 font-semibold">My books</Link>}
          <Link to="/start-writing" onClick={() => setOpen(false)} className="story-action my-2 self-start">Write a book ↗</Link>
          {isAuthenticated ? <button type="button" onClick={() => { setOpen(false); void logout(); }} className="min-h-11 self-start font-semibold">Sign out</button> : <Link to="/login" onClick={() => setOpen(false)} className="min-h-11 py-2.5 font-semibold">Sign in</Link>}
        </nav>
      )}
    </header>
  );
};
