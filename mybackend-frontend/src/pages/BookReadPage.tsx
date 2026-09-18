import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  Share2,
  Bookmark,
  Settings,
  User,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { ShareModal } from "../components/ShareModal";
import { booksService } from "../services/api/books.service";

interface Book {
  id: string;
  title: string;
  description: string;
  authorId: string;
  author?: {
    firstName: string;
    lastName: string;
    username: string;
    bio?: string;
    avatarUrl?: string;
  };
  coverImageUrl?: string;
  ageGroup: string;
  tags: string[];
  createdAt: string;
  publishedAt: string;
  rating?: number;
  reviewCount?: number;
  chapters?: Chapter[];
}

interface Chapter {
  id: string;
  bookId: string;
  title: string;
  content: string;
  order: number;
  illustrationUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export const BookReadPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium",
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);



  useEffect(() => {
    if (
      chapters.length > 0 &&
      currentChapterIndex >= 0 &&
      currentChapterIndex < chapters.length
    ) {
      setCurrentChapter(chapters[currentChapterIndex]);
    }
  }, [chapters, currentChapterIndex]);

  const loadBook = useCallback(async () => {
    try {
      const response = await booksService.getPublishedBookById(bookId!);
      const bookData = response.data;
      const orderedChapters = (bookData?.chapters || []).sort(
        (a: Chapter, b: Chapter) => a.order - b.order,
      );
      setBook(bookData);
      setChapters(orderedChapters);
    } catch (error) {
      console.error("Error loading book:", error);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (bookId) {
      loadBook();
    }
  }, [bookId, loadBook]);

  const goToChapter = (index: number) => {
    if (index >= 0 && index < chapters.length) {
      setCurrentChapterIndex(index);
    }
  };

  const goToPreviousChapter = () => {
    goToChapter(currentChapterIndex - 1);
  };

  const goToNextChapter = () => {
    goToChapter(currentChapterIndex + 1);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "small":
        return "text-sm";
      case "large":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAgeGroupLabel = (ageGroup: string) => {
    const labels: Record<string, string> = {
      TODDLER: "Toddler (0-3 years)",
      PRESCHOOL: "Preschool (3-5 years)",
      EARLY_READER: "Early Reader (5-7 years)",
      MIDDLE_GRADE: "Middle Grade (8-12 years)",
      YOUNG_ADULT: "Young Adult (13+ years)",
    };
    return labels[ageGroup] || ageGroup;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-slate-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Book not found
          </h2>
          <p className="text-slate-600 mb-4">
            The book you're looking for doesn't exist.
          </p>
          <Link to="/books">
            <Button>Browse Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#ffffff_45%)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/books">
                <ChevronLeft className="h-6 w-6 text-slate-600 hover:text-slate-900 cursor-pointer" />
              </Link>
              <div>
                <h1 className="font-semibold text-slate-900">{book.title}</h1>
                <p className="text-sm text-slate-600">
                  {book.author?.firstName} {book.author?.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-primary" : "text-slate-600"}
              >
                <Bookmark
                  className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowShareModal(true)}>
                <Share2 className="h-5 w-5 text-slate-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Settings className="h-5 w-5 text-slate-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-amber-50">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-center">
            <div className="mx-auto md:mx-0">
              <div className="h-56 w-40 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 text-white shadow-xl flex items-center justify-center">
                <span className="text-4xl font-bold">
                  {book.title?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700">
                  {getAgeGroupLabel(book.ageGroup)}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700">
                  {chapters.length} Chapters
                </span>
                {book.publishedAt && (
                  <span className="px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700">
                    Published {formatDate(book.publishedAt)}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-3">
                {book.title}
              </h1>
              <p className="text-sm text-slate-600 mb-4">
                By {book.author?.firstName} {book.author?.lastName}
              </p>
              <p className="text-base text-slate-700 leading-relaxed max-w-2xl mb-4">
                {book.description}
              </p>
              {book.tags && book.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="flex">
        {/* Main Reading Area */}
        <main className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-10">
          {currentChapter ? (
            <motion.div
              key={currentChapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="prose prose-slate max-w-none"
            >
              {/* Chapter Header */}
              <div className="mb-6 text-center">
                <h2
                  className={`text-3xl font-bold text-slate-900 mb-4 ${getFontSizeClass()}`}
                >
                  Chapter {currentChapter.order}: {currentChapter.title}
                </h2>
              </div>

              {/* Chapter Content */}
              <div className="rounded-3xl border border-slate-200 bg-white/80 shadow-lg shadow-slate-200/60 px-6 py-8 md:px-10 md:py-10">
                <div
                  className={`leading-relaxed text-slate-700 space-y-4 ${getFontSizeClass()}`}
                >
                  {currentChapter.illustrationUrls &&
                    currentChapter.illustrationUrls.length > 0 && (
                      <div className="mb-6">
                        <img
                          src={currentChapter.illustrationUrls[0]}
                        alt={currentChapter.title}
                        className="w-full max-w-md mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                {currentChapter.content
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Chapter Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={goToPreviousChapter}
                  disabled={currentChapterIndex === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous Chapter
                </Button>

                <span className="text-sm text-slate-600">
                  Chapter {currentChapterIndex + 1} of {chapters.length}
                </span>

                <Button
                  onClick={goToNextChapter}
                  disabled={currentChapterIndex === chapters.length - 1}
                  className="gap-2"
                >
                  Next Chapter
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ) : chapters.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No chapters available
              </h3>
              <p className="text-slate-600">
                This book doesn't have any chapters yet.
              </p>
            </div>
          ) : null}
        </main>

        {/* Sidebar - Chapters List */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-16 h-full w-80 bg-white border-l border-slate-200 shadow-lg z-30 overflow-y-auto"
            >
              <div className="p-6">
                {/* Reading Settings */}
                <div className="mb-8">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Reading Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Font Size
                      </label>
                      <div className="flex gap-2">
                        {(["small", "medium", "large"] as const).map((size) => (
                          <Button
                            key={size}
                            variant={fontSize === size ? "primary" : "outline"}
                            size="sm"
                            onClick={() => setFontSize(size)}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapters List */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Chapters
                  </h3>
                  <div className="space-y-2">
                    {chapters.map((chapter, index) => (
                      <button
                        key={chapter.id}
                        onClick={() => goToChapter(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${index === currentChapterIndex
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-slate-100 text-slate-700"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Chapter {chapter.order}
                          </span>
                          {index === currentChapterIndex && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <div className="text-sm mt-1 truncate">
                          {chapter.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Book Info */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-slate-700">
                        Author
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          {book.author?.firstName} {book.author?.lastName}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700">
                        Age Group
                      </span>
                      <p className="text-sm text-slate-600">
                        {getAgeGroupLabel(book.ageGroup)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700">
                        Published
                      </span>
                      <p className="text-sm text-slate-600">
                        {book.publishedAt
                          ? formatDate(book.publishedAt)
                          : "Not published"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      {book && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          bookId={book.id}
          bookTitle={book.title}
          bookDescription={book.description}
        />
      )}
    </div>
  );
};
