export interface Genre {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
}

export const genres: Genre[] = [
    {
        id: 'fantasy',
        name: 'Fantasy & Magic',
        icon: '🧙‍♂️',
        color: '#8b5cf6',
        description: 'Wizards, dragons, and magical adventures'
    },
    {
        id: 'science',
        name: 'Science & Space',
        icon: '🚀',
        color: '#3b82f6',
        description: 'Explore the stars and discover new worlds'
    },
    {
        id: 'animals',
        name: 'Animals & Nature',
        icon: '🦁',
        color: '#10b981',
        description: 'Adventures with animals and wildlife'
    },
    {
        id: 'technology',
        name: 'Technology & Robots',
        icon: '🤖',
        color: '#06b6d4',
        description: 'Robots, gadgets, and future tech'
    },
    {
        id: 'art',
        name: 'Art & Music',
        icon: '🎨',
        color: '#ec4899',
        description: 'Creative expression and artistic journeys'
    },
    {
        id: 'sports',
        name: 'Sports & Games',
        icon: '⚽',
        color: '#f59e0b',
        description: 'Teamwork, competition, and athletic adventures'
    },
    {
        id: 'adventure',
        name: 'Adventure & Exploration',
        icon: '🗺️',
        color: '#f97316',
        description: 'Discover new places and go on exciting journeys'
    },
    {
        id: 'mystery',
        name: 'Mystery & Detective',
        icon: '🔍',
        color: '#6366f1',
        description: 'Solve puzzles and uncover hidden secrets'
    },
    {
        id: 'friendship',
        name: 'Friendship & Family',
        icon: '👨‍👩‍👧‍👦',
        color: '#14b8a6',
        description: 'Stories about relationships and working together'
    },
    {
        id: 'humor',
        name: 'Humor & Fun',
        icon: '😂',
        color: '#eab308',
        description: 'Funny stories that make you laugh'
    }
];
