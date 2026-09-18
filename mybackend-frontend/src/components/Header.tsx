import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Menu, X, User } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "../context/AuthContext";

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              BriBooks<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/books"
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              Read Books
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/start-writing"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
                >
                  Write a Book
                </Link>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <Link
                to="/pricing"
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                Pricing
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                >
                  <User className="h-4 w-4" />
                  {user?.name}
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Log out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 shadow-lg">
          <nav className="flex flex-col gap-4">
            <Link to="/books" className="text-base font-medium text-slate-600">
              Read Books
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/start-writing" className="text-base font-medium text-slate-600">
                  Write a Book
                </Link>
                <Link to="/dashboard" className="text-base font-medium text-slate-600">
                  Dashboard
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  <Link to="/dashboard" className="flex items-center gap-2 text-base font-medium text-slate-600">
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => logout()}
                  >
                    Log out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  className="text-base font-medium text-slate-600"
                >
                  Pricing
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  <Link to="/login">
                    <Button variant="ghost" className="w-full justify-start">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
