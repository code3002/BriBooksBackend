import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Book,
  Edit,
  Eye,
  TrendingUp,
  Star,
  BarChart3,
  Settings,
  Library,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { booksService } from "../services/api/books.service";
import { useAuth } from "../context/AuthContext";

interface Book {
  id: string;
  title: string;
  description: string;
  status: string;
  ageGroup: string;
  createdAt: string;
  updatedAt: string;
  coverImageUrl?: string;
  _count?: {
    chapters: number;
    reviews: number;
  };
}

interface Stats {
  totalBooks: number;
  publishedBooks: number;
  draftBooks: number;
  totalChapters: number;
  totalViews: number;
  totalReviews: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    publishedBooks: 0,
    draftBooks: 0,
    totalChapters: 0,
    totalViews: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "drafts">(
    "all",
  );

  useEffect(() => {
    loadUserBooks();
  }, []);

  const loadUserBooks = async () => {
    try {
      const response = await booksService.getUserBooks();
      setBooks(response.data || []);

      // Calculate stats
      const books = response.data || [];
      const publishedBooks = books.filter(
        (book: Book) => book.status === "PUBLISHED",
      ).length;
      const draftBooks = books.filter(
        (book: Book) => book.status === "DRAFT",
      ).length;
      const totalChapters = books.reduce(
        (sum: number, book: Book) => sum + (book._count?.chapters || 0),
        0,
      );
      const totalReviews = books.reduce(
        (sum: number, book: Book) => sum + (book._count?.reviews || 0),
        0,
      );

      setStats({
        totalBooks: books.length,
        publishedBooks,
        draftBooks,
        totalChapters,
        totalViews: 0, // Would need additional API
        totalReviews,
      });
    } catch (error) {
      console.error("Error loading user books:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    if (activeTab === "all") return true;
    if (activeTab === "published") return book.status === "PUBLISHED";
    if (activeTab === "drafts") return book.status === "DRAFT";
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-50 text-green-600 border-green-200";
      case "DRAFT":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "UNDER_REVIEW":
        return "bg-blue-50 text-blue-600 border-blue-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getAgeGroupLabel = (ageGroup: string) => {
    const labels: Record<string, string> = {
      TODDLER: "Toddler",
      PRESCHOOL: "Preschool",
      EARLY_READER: "Early Reader",
      MIDDLE_GRADE: "Middle Grade",
      YOUNG_ADULT: "Young Adult",
    };
    return labels[ageGroup] || ageGroup;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef2ff,_#f8fafc_55%)]">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -left-32 -bottom-32 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                <Book className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                  Welcome back, {user?.name || "Author"}!
                </h1>
                <p className="text-sm text-slate-600">
                  Your stories are waiting. Let’s keep the momentum going.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/editor">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Book
                </Button>
              </Link>
              <Button variant="ghost">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Books
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalBooks}
                </p>
              </div>
              <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <Book className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.publishedBooks}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Chapters
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalChapters}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                <Library className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Reviews</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalReviews}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                <Star className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Books Section */}
        <div className="bg-white/80 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/60">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">My Books</h2>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "all" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("all")}
                >
                  All ({stats.totalBooks})
                </Button>
                <Button
                  variant={activeTab === "published" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("published")}
                >
                  Published ({stats.publishedBooks})
                </Button>
                <Button
                  variant={activeTab === "drafts" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("drafts")}
                >
                  Drafts ({stats.draftBooks})
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <Book className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {activeTab === "all"
                    ? "No books yet"
                    : `No ${activeTab} books`}
                </h3>
                <p className="text-slate-600 mb-4">
                  {activeTab === "all"
                    ? "Start your writing journey by creating your first book."
                    : `You don't have any ${activeTab} books yet.`}
                </p>
                <Link to="/editor">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Book
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow bg-white"
                  >
                    {/* Book Cover */}
                    <div className="h-32 bg-gradient-to-br from-slate-900 via-indigo-700 to-amber-500 flex items-center justify-center">
                      {book.coverImageUrl ? (
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-white">
                          {book.title?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1">
                          {book.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium border ml-2 ${getStatusColor(
                            book.status,
                          )}`}
                        >
                          {book.status}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {book.description || "No description available"}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span>{getAgeGroupLabel(book.ageGroup)}</span>
                        <span>{book._count?.chapters || 0} chapters</span>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/editor/${book.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                        {book.status === "PUBLISHED" && (
                          <Link to={`/books/${book.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
