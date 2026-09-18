import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  Book,
  Settings,
  Mic,
  MicOff,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { ThemeSelector } from "../components/ThemeSelector";
import { getThemeById } from "../components/themeData";
import { AIAssistant } from "../components/AIAssistant";
import { PublishSuccessModal } from "../components/PublishSuccessModal";
import { booksService } from "../services/api/books.service";
import { useVoiceRecording } from "../hooks/useVoiceRecording";
import { useAuth } from "../context/AuthContext";

interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
      message?: string;
    };
  };
  message?: string;
}

interface Book {
  id: string;
  title: string;
  description: string;
  authorId: string;
  ageGroup: string;
  tags: string[];
  coverImageUrl?: string;
  themeId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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

export const BookEditorPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [isChapterDirty, setIsChapterDirty] = useState(false);
  const [isEditingBook, setIsEditingBook] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: "",
    description: "",
    ageGroup: "MIDDLE_GRADE",
    tags: [] as string[],
  });
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("enchanted-forest");
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editorError, setEditorError] = useState('');

  // Voice recording
  const {
    isListening,
    transcript,
    error: voiceError,
    isSupported: isVoiceSupported,
    toggleListening,
    resetTranscript
  } = useVoiceRecording();

  const ageGroups = [
    { value: "TODDLER", label: "Toddler (0-3 years)" },
    { value: "PRESCHOOL", label: "Preschool (3-5 years)" },
    { value: "EARLY_READER", label: "Early Reader (5-7 years)" },
    { value: "MIDDLE_GRADE", label: "Middle Grade (8-12 years)" },
    { value: "YOUNG_ADULT", label: "Young Adult (13+ years)" },
  ];

  // Append voice transcript to current chapter content
  useEffect(() => {
    if (transcript && currentChapter) {
      setIsChapterDirty(true);
      setCurrentChapter((prev) =>
        prev ? { ...prev, content: prev.content + transcript } : prev,
      );
      resetTranscript();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  // Load pre-selected theme from wizard
  useEffect(() => {
    const savedTheme = sessionStorage.getItem('selectedTheme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      sessionStorage.removeItem('selectedTheme'); // Clear after loading
    }
  }, []);

  const loadBook = useCallback(async () => {
    try {
      const response = await booksService.getBookById(bookId!);

      setBook(response.data);
      if (response.data.themeId) setSelectedTheme(response.data.themeId);
      setBookForm({
        title: response.data.title,
        description: response.data.description,
        ageGroup: response.data.ageGroup,
        tags: response.data.tags || [],
      });
    } catch (error) {
      console.error("Error loading book:", error);
      alert('Failed to load book. Please refresh the page.');
    }
  }, [bookId]);

  const loadChapters = useCallback(async () => {
    try {
      const response = await booksService.getBookChapters(bookId!);
      const sortedChapters = (response.data || []).sort(
        (a: Chapter, b: Chapter) => a.order - b.order,
      );
      setChapters(sortedChapters);
      if (sortedChapters.length > 0) {
        setCurrentChapter(sortedChapters[0]);
      }
    } catch (error) {
      console.error("Error loading chapters:", error);
    }
  }, [bookId]);

  useEffect(() => {
    if (bookId) {
      loadBook();
      loadChapters();
    } else {
      // Create new book
      setIsEditingBook(true);
    }
  }, [bookId, loadBook, loadChapters]);

  const saveBook = async () => {
    // Validation
    if (!bookForm.title.trim()) {
      alert('Please enter a book title');
      return;
    }

    try {
      setSaving(true);
      if (bookId) {
        // Update existing book
        await booksService.updateBook(bookId, { ...bookForm, themeId: selectedTheme });
        setBook({ ...book!, ...bookForm, themeId: selectedTheme });
        setIsEditingBook(false);
        alert('Book saved successfully!');
      } else {
        // Create new book - include required fields
        const response = await booksService.createBook(
          bookForm.title,
          bookForm.description,
          bookForm.ageGroup || 'MIDDLE_GRADE', // Default if not set
          bookForm.tags || [],
          selectedTheme
        );
        alert('Book created successfully!');
        navigate(`/editor/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error saving book:", error);
      alert('Failed to save book. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveChapter = async () => {
    if (!currentChapter) return;

    try {
      setSaving(true);
      await booksService.updateChapter(currentChapter.id, {
        title: currentChapter.title,
        content: currentChapter.content,
      });
      setIsChapterDirty(false);
      setChapters((previous) => previous.map((chapter) => chapter.id === currentChapter.id ? currentChapter : chapter));
      setEditorError('');
    } catch (error) {
      console.error("Error saving chapter:", error);
      setEditorError('Your chapter could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Switch chapters, warning the user about unsaved edits to avoid silent data loss.
  const selectChapter = (chapter: Chapter) => {
    if (chapter.id === currentChapter?.id) return;
    if (
      isChapterDirty &&
      !window.confirm(
        "You have unsaved changes in this chapter that will be lost. Switch chapters anyway?",
      )
    ) {
      return;
    }
    setIsChapterDirty(false);
    setCurrentChapter(chapter);
  };

  const createChapter = async () => {
    if (!book) {
      alert('Please create a book first');
      return;
    }

    if (!newChapterTitle.trim()) {
      alert('Please enter a chapter title');
      return;
    }

    try {
      const newChapter = await booksService.createChapter(book.id, {
        title: newChapterTitle,
        content: "",
        order: chapters.length + 1,
      });

      setChapters([...chapters, newChapter.data]);
      setCurrentChapter(newChapter.data);
      setIsChapterDirty(false);
      setNewChapterTitle("");
    } catch (error) {
      console.error("Error creating chapter:", error);
      alert('Failed to create chapter. Please try again.');
    }
  };

  const deleteChapter = async (chapterId: string) => {
    if (!confirm("Are you sure you want to delete this chapter?")) return;

    try {
      await booksService.deleteChapter(chapterId);
      const updatedChapters = chapters.filter((ch) => ch.id !== chapterId);
      setChapters(updatedChapters);
      if (currentChapter?.id === chapterId && updatedChapters.length > 0) {
        setCurrentChapter(updatedChapters[0]);
      } else if (currentChapter?.id === chapterId) {
        setCurrentChapter(null);
      }
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  const moveChapterUp = async (chapter: Chapter) => {
    if (chapter.order === 1) return;

    const aboveChapter = chapters.find((ch) => ch.order === chapter.order - 1);
    if (!aboveChapter) return;

    try {
      await booksService.updateChapter(chapter.id, {
        order: chapter.order - 1,
      });
      await booksService.updateChapter(aboveChapter.id, {
        order: aboveChapter.order + 1,
      });

      const updatedChapters = chapters
        .map((ch) => {
          if (ch.id === chapter.id) return { ...ch, order: ch.order - 1 };
          if (ch.id === aboveChapter.id) return { ...ch, order: ch.order + 1 };
          return ch;
        })
        .sort((a, b) => a.order - b.order);

      setChapters(updatedChapters);
    } catch (error) {
      console.error("Error moving chapter:", error);
    }
  };

  const moveChapterDown = async (chapter: Chapter) => {
    if (chapter.order === chapters.length) return;

    const belowChapter = chapters.find((ch) => ch.order === chapter.order + 1);
    if (!belowChapter) return;

    try {
      await booksService.updateChapter(chapter.id, {
        order: chapter.order + 1,
      });
      await booksService.updateChapter(belowChapter.id, {
        order: belowChapter.order - 1,
      });

      const updatedChapters = chapters
        .map((ch) => {
          if (ch.id === chapter.id) return { ...ch, order: ch.order + 1 };
          if (ch.id === belowChapter.id) return { ...ch, order: ch.order - 1 };
          return ch;
        })
        .sort((a, b) => a.order - b.order);

      setChapters(updatedChapters);
    } catch (error) {
      console.error("Error moving chapter:", error);
    }
  };

  const publishBook = async () => {
    if (!book) return;

    if (!confirm('Are you ready to publish this book? It will be available for readers worldwide.')) return;

    if (isChapterDirty && currentChapter) {
      try {
        await booksService.updateChapter(currentChapter.id, { title: currentChapter.title, content: currentChapter.content });
        setIsChapterDirty(false);
      } catch {
        setEditorError('Save this chapter before publishing.');
        return;
      }
    }

    try {
      await booksService.publishBook(book.id);
      setBook({ ...book, status: "PUBLISHED" });
      setShowPublishSuccess(true);
    } catch (error: unknown) {
      console.error("Error publishing book:", error);
      const err = error as ApiError;
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to publish book. Please try again.";
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      {/* Header */}
      <header className="bg-[var(--color-paper)] border-b border-[var(--color-rule)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <ArrowLeft className="h-6 w-6 text-slate-600 hover:text-slate-900 cursor-pointer" />
              </Link>
              <div>
                {isEditingBook ? (
                  <input
                    type="text"
                    value={bookForm.title}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, title: e.target.value })
                    }
                    className="text-xl font-semibold text-slate-900 border-b-2 border-primary outline-none"
                    placeholder="Book title..."
                  />
                ) : (
                  <h1 className="text-xl font-semibold text-slate-900">
                    {book?.title || "New Book"}
                  </h1>
                )}
              </div>
              {book && (
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${book.status === "PUBLISHED"
                    ? "bg-green-50 text-green-600"
                    : "bg-yellow-50 text-yellow-600"
                    }`}
                >
                  {book.status}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {book && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditingBook(!isEditingBook)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              )}
              <Button variant="outline" disabled={!book} onClick={() => setShowPreview(!showPreview)}>
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
              {book && book.status !== "PUBLISHED" && (
                <Button
                  onClick={publishBook}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Publish Book
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
        {/* Book Settings Sidebar */}
        {isEditingBook && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full bg-[var(--color-paper-2)] border-b border-[var(--color-rule)] p-5 lg:w-80 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-6 lg:overflow-y-auto"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Book Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={bookForm.title}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={bookForm.description}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Age Group
                </label>
                <select
                  value={bookForm.ageGroup}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, ageGroup: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  {ageGroups.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Book Theme
                </label>
                <ThemeSelector
                  selectedTheme={selectedTheme}
                  onThemeSelect={setSelectedTheme}
                  className="mb-4"
                />
              </div>

              <Button onClick={saveBook} disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Book"}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Chapters Sidebar */}
        <div className="w-full bg-[var(--color-paper-2)] border-b border-[var(--color-rule)] p-5 lg:w-80 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-6 lg:overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Chapters</h3>
            <Button size="sm" onClick={createChapter} disabled={!book}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {book && (
            <div className="mb-4">
              <input
                type="text"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createChapter()}
                placeholder="New chapter title..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              />
            </div>
          )}

          <div className="space-y-2">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${currentChapter?.id === chapter.id
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 hover:border-slate-300"
                  }`}
                onClick={() => selectChapter(chapter)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">
                      Chapter {chapter.order}
                    </div>
                    <div className="text-sm text-slate-600 truncate">
                      {chapter.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveChapterUp(chapter);
                      }}
                      disabled={chapter.order === 1}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveChapterDown(chapter);
                      }}
                      disabled={chapter.order === chapters.length}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChapter(chapter.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <main
          className="min-w-0 flex-1 p-5 lg:p-8 lg:overflow-y-auto"
          style={{
            background:
              getThemeById(selectedTheme)?.colors.background || "#ffffff",
          }}
        >
          {currentChapter ? (
            <div className="max-w-4xl mx-auto">
              <div className="story-panel p-5 shadow-lg sm:p-8">
                <p className="story-label mb-5 text-primary">Chapter {currentChapter.order} · {showPreview ? 'Preview' : 'Writing desk'}</p>
                {editorError && <p role="alert" className="mb-4 text-sm font-semibold text-red-700">{editorError}</p>}
                {showPreview ? <article className="min-h-[430px]"><h2 className="story-display mb-7 text-3xl">{currentChapter.title}</h2><p className="whitespace-pre-wrap text-lg leading-8">{currentChapter.content || 'Your story will appear here as you write.'}</p></article> : <>
                <div className="mb-6">
                  <input
                    type="text"
                    value={currentChapter.title}
                    onChange={(e) => {
                      setIsChapterDirty(true);
                      setCurrentChapter({
                        ...currentChapter,
                        title: e.target.value,
                      });
                    }}
                    className="text-2xl font-bold text-slate-900 border-b-2 border-transparent hover:border-slate-300 focus:border-primary outline-none w-full pb-2 bg-transparent"
                    placeholder="Chapter title..."
                  />
                </div>

                <div className="mb-4 relative">
                  <textarea
                    value={currentChapter.content}
                    onChange={(e) => {
                      setIsChapterDirty(true);
                      setCurrentChapter({
                        ...currentChapter,
                        content: e.target.value,
                      });
                    }}
                    className="w-full min-h-[420px] p-4 pr-16 border border-[var(--color-rule)] rounded-xl focus:ring-2 focus:ring-primary outline-none text-lg leading-relaxed resize-y bg-white sm:p-5"
                    placeholder="Start writing or click the microphone to speak..."
                  />

                  {/* Microphone Button */}
                  {isVoiceSupported && (
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`p-3 rounded-full transition-all shadow-md ${isListening
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                          : 'bg-slate-200 hover:bg-slate-300'
                          }`}
                        title={isListening ? 'Stop recording' : 'Start voice recording'}
                      >
                        {isListening ? (
                          <Mic className="h-5 w-5 text-white" />
                        ) : (
                          <MicOff className="h-5 w-5 text-slate-600" />
                        )}
                      </button>

                      {/* Tooltip */}
                      {isListening && (
                        <div className="absolute top-full mt-2 right-0 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg">
                          Listening... Click to stop
                        </div>
                      )}

                      {/* Error Display */}
                      {voiceError && !isListening && (
                        <div className="absolute top-full mt-2 right-0 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm max-w-xs shadow-lg">
                          {voiceError}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Browser Not Supported Message */}
                  {!isVoiceSupported && (
                    <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg text-sm">
                      Voice recording not supported
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div className="text-sm text-slate-500">
                    Word count:{" "}
                    {
                      currentChapter.content
                        .split(/\s+/)
                        .filter((word) => word.length > 0).length
                    }
                  </div>
                  <Button onClick={saveChapter} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Chapter"}
                  </Button>
                </div>
                </>}
            </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Book className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {book ? "No chapters yet" : "Create your book first"}
              </h3>
              <p className="text-slate-600 mb-4">
                {book
                  ? "Add your first chapter to start writing your story."
                  : "Set up your book details and then create chapters."}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* AI Assistant */}
      {currentChapter && (
        <AIAssistant
          chapterContent={currentChapter.content}
          ageGroup={book?.ageGroup || "MIDDLE_GRADE"}
          onApplySuggestion={(content) => {
            setIsChapterDirty(true);
            setCurrentChapter({ ...currentChapter, content });
          }}
          onAddIllustration={(illustration) => {
            // This would handle adding illustration descriptions to the chapter
            console.log("Adding illustration:", illustration);
          }}
        />
      )}

      {/* Publish Success Modal */}
      {book && (
        <PublishSuccessModal
          isOpen={showPublishSuccess}
          onClose={() => setShowPublishSuccess(false)}
          bookId={book.id}
          bookTitle={book.title}
        />
      )}
    </div>
  );
};
