import axios from 'axios';

const API_URL = '/api/ai';

export const aiAgentService = {
    // Story Generation Agent
    async generateStory(prompt: string, genre: string, ageGroup: string) {
        const response = await axios.post(`${API_URL}/agent/story`, { prompt, genre, ageGroup });
        return response.data;
    },

    // Illustration Agent
    async generateIllustration(sceneDescription: string, style: string) {
        const response = await axios.post(`${API_URL}/agent/illustration`, { sceneDescription, style });
        return response.data;
    },

    // Editing Agent
    async reviewContent(content: string) {
        const response = await axios.post(`${API_URL}/agent/review`, { content });
        return response.data;
    },

    // Chat with AI Assistant
    async chat(message: string, context: Record<string, unknown>) {
        const response = await axios.post(`${API_URL}/agent/chat`, { message, context });
        return response.data;
    }
};
