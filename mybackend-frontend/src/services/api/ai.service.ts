import axios from "axios";

const API_URL = "/api/ai";

export const aiService = {
  async generateStory(prompt: string, ageGroup: string, maxLength?: number) {
    const response = await axios.post(`${API_URL}/generate-story`, {
      prompt,
      ageGroup,
      maxLength,
    });
    return response.data;
  },

  async checkGrammar(text: string) {
    const response = await axios.post(`${API_URL}/check-grammar`, { text });
    return response.data;
  },

  async getContentSuggestions(text: string, ageGroup: string) {
    const response = await axios.post(`${API_URL}/content-suggestions`, {
      text,
      ageGroup,
    });
    return response.data;
  },

  async generateIllustrations(chapterContent: string, ageGroup: string) {
    const response = await axios.post(`${API_URL}/generate-illustrations`, {
      chapterContent,
      ageGroup,
    });
    return response.data;
  },

  async checkContentSafety(text: string, ageGroup: string) {
    const response = await axios.post(`${API_URL}/check-safety`, {
      text,
      ageGroup,
    });
    return response.data;
  },
};
