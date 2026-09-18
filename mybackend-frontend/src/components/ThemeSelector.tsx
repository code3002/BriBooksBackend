import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { bookThemes } from "./themeData";

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeSelect: (themeId: string) => void;
  className?: string;
}

const categories = [
  "All",
  "Fantasy",
  "Science",
  "Animals",
  "Technology",
  "Art",
  "Sports",
  "Environment",
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeSelect,
  className = "",
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredThemes =
    selectedCategory === "All"
      ? bookThemes
      : bookThemes.filter((theme) => theme.category === selectedCategory);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-slate-900">
            Choose Your Book Theme
          </h3>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Select a beautiful theme that matches your story's mood and genre
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {filteredThemes.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onThemeSelect(theme.id)}
            className={`relative cursor-pointer rounded-xl border-2 transition-all ${
              selectedTheme === theme.id
                ? "border-primary shadow-lg shadow-primary/20"
                : "border-slate-200 hover:border-slate-300 hover:shadow-md"
            }`}
            style={{ background: theme.colors.background }}
          >
            {theme.popular && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                Popular
              </div>
            )}

            <div className="p-4">
              {/* Preview Emoji */}
              <div className="text-3xl mb-2 text-center">{theme.preview}</div>

              {/* Theme Name */}
              <div className="text-center">
                <div
                  className="font-semibold text-sm mb-1"
                  style={{ color: theme.colors.text }}
                >
                  {theme.name}
                </div>
                <div
                  className="text-xs opacity-75"
                  style={{ color: theme.colors.text }}
                >
                  {theme.category}
                </div>
              </div>

              {/* Color Palette Preview */}
              <div className="flex justify-center gap-1 mt-2">
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: theme.colors.accent }}
                />
              </div>
            </div>

            {/* Selected Indicator */}
            {selectedTheme === theme.id && (
              <div className="absolute top-2 left-2 bg-primary text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Custom Theme Option */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <Button variant="outline" className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          Create Custom Theme
        </Button>
      </div>
    </div>
  );
};
