import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Image,
  MessageCircle,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/Button";
import { aiService } from "../services/api/ai.service";

interface AIAssistantProps {
  chapterContent: string;
  ageGroup: string;
  onApplySuggestion: (content: string) => void;
  onAddIllustration: (illustration: string) => void;
}

interface AISuggestion {
  type: "grammar" | "content" | "safety";
  message: string;
  severity?: "low" | "medium" | "high";
  original?: string;
  suggestion?: string;
}

interface GrammarCorrection {
  original: string;
  suggestion: string;
  reason: string;
  severity?: "low" | "medium" | "high";
}

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

export const AIAssistant: React.FC<AIAssistantProps> = ({
  chapterContent,
  ageGroup,
  onApplySuggestion,
  onAddIllustration,
}) => {
  const extractError = (error: unknown): string => {
    const e = error as ApiError;
    const msg: string =
      e?.response?.data?.error?.message ||
      e?.response?.data?.message ||
      e?.message ||
      "Something went wrong. Please try again.";
    if (msg.includes("429") || msg.toLowerCase().includes("quota")) {
      return "Gemini AI quota exceeded. Please wait a moment or check your API key billing.";
    }
    return msg.length > 120 ? msg.slice(0, 120) + "…" : msg;
  };

  const normalizeList = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === "string") {
      return value
        .split(/\r?\n/)
        .map((line) => line.replace(/^\s*[-*•\d.)]+\s*/, "").trim())
        .filter(Boolean);
    }
    return [];
  };

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "story" | "grammar" | "suggestions" | "illustrations"
  >("suggestions");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [storyPrompt, setStoryPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [generatedStory, setGeneratedStory] = useState("");
  const [generatedIllustrations, setGeneratedIllustrations] = useState<
    string[]
  >([]);

  const handleGrammarCheck = async () => {
    if (!chapterContent.trim()) {
      setSuggestions([{ type: "grammar", message: "Please write some content first to check grammar.", severity: "low" }]);
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await aiService.checkGrammar(chapterContent);
      const data = response?.data ?? response;
      if (data?.corrections?.length > 0) {
        setSuggestions(
          data.corrections.map((correction: GrammarCorrection) => ({
            type: "grammar",
            message: correction.reason,
            original: correction.original,
            suggestion: correction.suggestion,
            severity: correction.severity || "medium",
          })),
        );
      } else {
        setSuggestions([{ type: "grammar", message: "Great job! No grammar issues found.", severity: "low" }]);
      }
    } catch (error) {
      setErrorMsg(extractError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleContentSuggestions = async () => {
    if (!chapterContent.trim()) {
      setSuggestions([{ type: "content", message: "Please write some content first to get suggestions.", severity: "low" }]);
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await aiService.getContentSuggestions(chapterContent, ageGroup);
      const data = response?.data ?? response;
      const suggestionList = normalizeList(data?.suggestions);
      if (suggestionList.length > 0) {
        setSuggestions(suggestionList.map((s: string) => ({ type: "content" as const, message: s, severity: "low" as const })));
      } else {
        setSuggestions([{ type: "content", message: "Your content looks good! Keep up the great work.", severity: "low" }]);
      }
    } catch (error) {
      setErrorMsg(extractError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStory = async () => {
    if (!storyPrompt.trim()) {
      setErrorMsg("Please enter a story prompt.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await aiService.generateStory(storyPrompt, ageGroup, 500);
      const data = response?.data ?? response;
      setGeneratedStory(data?.content || "");
    } catch (error) {
      setErrorMsg(extractError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIllustrations = async () => {
    if (!chapterContent.trim()) {
      setErrorMsg("Please write some content first to generate illustrations.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await aiService.generateIllustrations(chapterContent, ageGroup);
      const data = response?.data ?? response;
      const descriptions = normalizeList(data?.descriptions);
      setGeneratedIllustrations(descriptions);
    } catch (error) {
      setErrorMsg(extractError(error));
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.suggestion && suggestion.original) {
      const newContent = chapterContent.replace(
        suggestion.original,
        suggestion.suggestion,
      );
      onApplySuggestion(newContent);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "grammar":
        return <AlertTriangle className="h-4 w-4" />;
      case "content":
        return <Lightbulb className="h-4 w-4" />;
      case "safety":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getColor = (severity?: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-96 max-h-[600px] overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-slate-900">AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "suggestions"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => { setActiveTab("suggestions"); setErrorMsg(null); }}
              >
                Improve
              </button>
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "story"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => { setActiveTab("story"); setErrorMsg(null); }}
              >
                Generate
              </button>
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "illustrations"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => { setActiveTab("illustrations"); setErrorMsg(null); }}
              >
                Illustrate
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-96">
              {errorMsg && (
                <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  {activeTab === "suggestions" && (
                    <div className="space-y-3">
                      <div className="flex gap-2 mb-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleGrammarCheck}
                          className="flex-1"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Check Grammar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleContentSuggestions}
                          className="flex-1"
                        >
                          <Lightbulb className="h-3 w-3 mr-1" />
                          Get Ideas
                        </Button>
                      </div>

                      {suggestions.length > 0 && (
                        <div className="space-y-2">
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border ${getColor(suggestion.severity)}`}
                            >
                              <div className="flex items-start gap-2">
                                {getIcon(suggestion.type)}
                                <div className="flex-1">
                                  <p className="text-sm">
                                    {suggestion.message}
                                  </p>
                                  {suggestion.original &&
                                    suggestion.suggestion && (
                                      <div className="mt-2 flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            applySuggestion(suggestion)
                                          }
                                        >
                                          Apply Fix
                                        </Button>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {suggestions.length === 0 && (
                        <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500">
                          Use the buttons above to get quick feedback on your
                          writing.
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "story" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Story Prompt
                        </label>
                        <textarea
                          value={storyPrompt}
                          onChange={(e) => setStoryPrompt(e.target.value)}
                          placeholder="Describe the story you want to generate..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                          rows={3}
                        />
                      </div>
                      <Button
                        onClick={handleGenerateStory}
                        disabled={loading}
                        className="w-full"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Story
                      </Button>

                      {generatedStory && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <h4 className="font-medium text-slate-900 mb-2">
                            Generated Story:
                          </h4>
                          <p className="text-sm text-slate-700 mb-3">
                            {generatedStory}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => onApplySuggestion(generatedStory)}
                          >
                            Use This Story
                          </Button>
                        </div>
                      )}

                      {!generatedStory && (
                        <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500">
                          Describe the story idea above and let the AI draft a
                          first version you can refine.
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "illustrations" && (
                    <div className="space-y-4">
                      <Button
                        onClick={handleGenerateIllustrations}
                        disabled={loading}
                        className="w-full"
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Generate Illustration Ideas
                      </Button>

                      {generatedIllustrations.length > 0 && (
                        <div className="space-y-2">
                          {generatedIllustrations.map((illustration, index) => (
                            <div
                              key={index}
                              className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                            >
                              <p className="text-sm text-slate-700 mb-2">
                                {illustration}
                              </p>
                              <Button
                                size="sm"
                                onClick={() => onAddIllustration(illustration)}
                              >
                                Add to Chapter
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {generatedIllustrations.length === 0 && (
                        <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500">
                          Generate a few visual ideas to guide your illustrator
                          or spark your own imagination.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full h-14 w-14 shadow-lg shadow-primary/30"
        size="lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </Button>
    </div>
  );
};
