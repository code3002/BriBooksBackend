export interface BookTheme {
  id: string;
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  category: string;
  popular?: boolean;
}

export const bookThemes: BookTheme[] = [
  // Fantasy & Adventure
  {
    id: "enchanted-forest",
    name: "Enchanted Forest",
    preview: "🌲✨",
    colors: {
      primary: "#2d5a27",
      secondary: "#8fbc8f",
      background: "#f0fff0",
      text: "#1a3315",
      accent: "#ffd700",
    },
    category: "Fantasy",
    popular: true,
  },
  {
    id: "magical-kingdom",
    name: "Magical Kingdom",
    preview: "🏰👑",
    colors: {
      primary: "#4b0082",
      secondary: "#da70d6",
      background: "#fff0f5",
      text: "#2e0854",
      accent: "#ff69b4",
    },
    category: "Fantasy",
  },
  {
    id: "dragon-lair",
    name: "Dragon's Lair",
    preview: "🐉🔥",
    colors: {
      primary: "#8b0000",
      secondary: "#ff6347",
      background: "#fff5ee",
      text: "#4a0404",
      accent: "#ffd700",
    },
    category: "Fantasy",
  },
  // Animals & Nature
  {
    id: "sunny-meadow",
    name: "Sunny Meadow",
    preview: "🌻🦋",
    colors: {
      primary: "#daa520",
      secondary: "#98fb98",
      background: "#fffacd",
      text: "#4a412a",
      accent: "#ff4500",
    },
    category: "Nature",
    popular: true,
  },
  {
    id: "ocean-adventure",
    name: "Ocean Adventure",
    preview: "🐠🌊",
    colors: {
      primary: "#006994",
      secondary: "#40e0d0",
      background: "#f0ffff",
      text: "#003366",
      accent: "#ffa07a",
    },
    category: "Nature",
  },
  {
    id: "jungle-safari",
    name: "Jungle Safari",
    preview: "🌴🦁",
    colors: {
      primary: "#228b22",
      secondary: "#ffd700",
      background: "#f5f5dc",
      text: "#2f4f4f",
      accent: "#ff6347",
    },
    category: "Nature",
  },
  // Space & Science
  {
    id: "cosmic-journey",
    name: "Cosmic Journey",
    preview: "🚀🌟",
    colors: {
      primary: "#191970",
      secondary: "#87ceeb",
      background: "#f0f8ff",
      text: "#0a0a2a",
      accent: "#00ffff",
    },
    category: "Science",
    popular: true,
  },
  {
    id: "robot-lab",
    name: "Robot Lab",
    preview: "🤖⚙️",
    colors: {
      primary: "#708090",
      secondary: "#b0c4de",
      background: "#f5f5f5",
      text: "#2f4f4f",
      accent: "#00ff00",
    },
    category: "Science",
  },
  // Everyday Life
  {
    id: "cozy-bedroom",
    name: "Cozy Bedroom",
    preview: "🛏️🧸",
    colors: {
      primary: "#daa520",
      secondary: "#deb887",
      background: "#fff8dc",
      text: "#4a412a",
      accent: "#cd853f",
    },
    category: "Everyday",
  },
  {
    id: "playground-fun",
    name: "Playground Fun",
    preview: "🎠⚽",
    colors: {
      primary: "#ff6347",
      secondary: "#32cd32",
      background: "#ffffe0",
      text: "#4a412a",
      accent: "#1e90ff",
    },
    category: "Everyday",
    popular: true,
  },
  {
    id: "school-days",
    name: "School Days",
    preview: "🏫📚",
    colors: {
      primary: "#4169e1",
      secondary: "#87ceeb",
      background: "#f0f8ff",
      text: "#191970",
      accent: "#ffa500",
    },
    category: "Everyday",
  },
];

export const getThemeById = (themeId: string): BookTheme | undefined => {
  return bookThemes.find((theme) => theme.id === themeId);
};

export const applyThemeToElement = (themeId: string, element: HTMLElement) => {
  const theme = getThemeById(themeId);
  if (!theme) return;

  // Apply theme colors to CSS custom properties
  element.style.setProperty("--theme-primary", theme.colors.primary);
  element.style.setProperty("--theme-secondary", theme.colors.secondary);
  element.style.setProperty("--theme-accent", theme.colors.accent);
  element.style.setProperty("--theme-background", theme.colors.background);
  element.style.setProperty("--theme-text", theme.colors.text);
};
