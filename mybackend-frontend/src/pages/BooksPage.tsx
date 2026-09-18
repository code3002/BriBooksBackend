import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  Clock,
  TrendingUp,
  ChevronRight,
  Book as BookIcon,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import {
  booksService,
  type BookFilters,
  type PaginatedBooksResponse,
  type Book,
} from "../services/api/books.service";

export const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "popular" | "recent">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<BookFilters>({
    page: 1,
    limit: 12,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const ageGroups = [
    {
      value: "TODDLER",
      label: "Toddler (0-3 years)",
      color: "bg-blue-50 text-blue-600",
    },
    {
      value: "PRESCHOOL",
      label: "Preschool (3-5 years)",
      color: "bg-green-50 text-green-600",
    },
    {
      value: "EARLY_READER",
      label: "Early Reader (5-7 years)",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      value: "MIDDLE_GRADE",
      label: "Middle Grade (8-12 years)",
      color: "bg-orange-50 text-orange-600",
    },
    {
      value: "YOUNG_ADULT",
      label: "Young Adult (13+ years)",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const collections = [
    { label: "Adventure & Mystery", tag: "adventure" },
    { label: "Friendship & Family", tag: "friendship" },
    { label: "Magic & Fantasy", tag: "magic" },
    { label: "Animals & Nature", tag: "animals" },
    { label: "Bedtime & Dreams", tag: "bedtime" },
    { label: "STEM & Discovery", tag: "science" },
  ];



  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const currentFilters = { ...filters };
      if (searchQuery) {
        currentFilters.search = searchQuery;
      }

      const response: PaginatedBooksResponse =
        await booksService.getPublishedBooks(currentFilters);
      setBooks(response.data);
      setPagination(response.meta);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  const loadPopularBooks = useCallback(async () => {
    try {
      const response = await booksService.getPopularBooks(6);
      setPopularBooks(response.data || []);
    } catch (error) {
      console.error("Error loading popular books:", error);
    }
  }, []);

  const loadRecentBooks = useCallback(async () => {
    try {
      const response = await booksService.getRecentBooks(6);
      setRecentBooks(response.data || []);
    } catch (error) {
      console.error("Error loading recent books:", error);
    }
  }, []);

  useEffect(() => {
    loadBooks();
    loadPopularBooks();
    loadRecentBooks();
  }, [filters, searchQuery, loadBooks, loadPopularBooks, loadRecentBooks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    loadBooks();
  };

  const handleAgeGroupFilter = (ageGroup: string) => {
    const newFilters = {
      ...filters,
      ageGroup: filters.ageGroup === ageGroup ? undefined : ageGroup,
      page: 1,
    };
    setFilters(newFilters);
  };

  const handleCollectionFilter = (tag: string) => {
    const isActive = activeCollection === tag;
    setActiveCollection(isActive ? null : tag);
    setFilters({
      ...filters,
      tags: isActive ? undefined : [tag],
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const getAgeGroupColor = (ageGroup: string) => {
    return (
      ageGroups.find((ag) => ag.value === ageGroup)?.color ||
      "bg-gray-50 text-gray-600"
    );
  };

  const getAgeGroupLabel = (ageGroup: string) => {
    return ageGroups.find((ag) => ag.value === ageGroup)?.label || ageGroup;
  };

  const displayBooks =
    activeTab === "all"
      ? books
      : activeTab === "popular"
        ? popularBooks
        : recentBooks;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#ffffff_40%,_#eef2ff)]">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-white to-amber-50 py-16">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              Discover Amazing Stories
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore a world of imagination with books written by talented
              young authors from around the globe.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for books, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Filters Section */}
      <section className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant={showFilters ? "primary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <div className="flex gap-2">
              {filters.ageGroup && (
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {getAgeGroupLabel(filters.ageGroup)}
                </span>
              )}
              {activeCollection && (
                <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-sm font-medium">
                  {collections.find((c) => c.tag === activeCollection)?.label ||
                    activeCollection}
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                  "{searchQuery}"
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeTab === "all" ? "primary" : "ghost"}
              onClick={() => setActiveTab("all")}
            >
              All Books ({pagination.total})
            </Button>
            <Button
              variant={activeTab === "popular" ? "primary" : "ghost"}
              onClick={() => setActiveTab("popular")}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Popular
            </Button>
            <Button
              variant={activeTab === "recent" ? "primary" : "ghost"}
              onClick={() => setActiveTab("recent")}
              className="gap-2"
            >
              <Clock className="h-4 w-4" />
              Recent
            </Button>
          </div>
        </div>

        {/* Collections */}
        <div className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Browse Collections
        </div>
        <div className="flex flex-wrap gap-3 mb-6">
          {collections.map((collection) => (
            <button
              key={collection.tag}
              onClick={() => handleCollectionFilter(collection.tag)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCollection === collection.tag
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-300/60"
                  : "bg-white/80 border border-slate-200 text-slate-700 hover:bg-white"
              }`}
            >
              {collection.label}
            </button>
          ))}
        </div>

        {/* Age Group Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8 p-6 bg-white/80 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50"
          >
            <h3 className="font-semibold text-slate-900 mb-4">
              Filter by Age Group
            </h3>
            <div className="flex flex-wrap gap-3">
              {ageGroups.map((group) => (
                <button
                  key={group.value}
                  onClick={() => handleAgeGroupFilter(group.value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filters.ageGroup === group.value
                      ? group.color + " ring-2 ring-offset-2 ring-slate-200"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* Books Grid */}
      <section className="container mx-auto px-4 md:px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 rounded-2xl h-64 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : displayBooks.length === 0 ? (
          <div className="text-center py-16">
            <BookIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No books found
            </h3>
            <p className="text-slate-600">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayBooks.map((book, index) => (
                <Link key={book.id} to={`/books/${book.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group cursor-pointer"
                  >
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
                      {/* Book Cover */}
                      <div className="relative h-64 bg-gradient-to-br from-slate-900 via-indigo-700 to-amber-500 overflow-hidden">
                        {book.coverImageUrl ? (
                          <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-4xl font-bold text-white">
                              {book.title?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${getAgeGroupColor(book.ageGroup)}`}
                          >
                            {getAgeGroupLabel(book.ageGroup)}
                          </span>
                        </div>
                        {book.rating && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-lg">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium">
                              {book.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                          {book.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            by{" "}
                            {book.author
                              ? `${book.author.firstName} ${book.author.lastName}`
                              : "Unknown author"}
                          </span>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        {book.tags && book.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {book.tags.slice(0, 2).map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded-lg"
                              >
                                {tag}
                              </span>
                            ))}
                            {book.tags.length > 2 && (
                              <span className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded-lg">
                                +{book.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {activeTab === "all" && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map(
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pagination.page === pageNum ? "primary" : "ghost"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      },
                    )}
                  </div>
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
