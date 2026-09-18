import axios from "axios";

const PUBLISHING_API_URL = "/api/publishing/books";
const BOOK_API_URL = "/api/books";

export interface BookFilters {
  ageGroup?: string;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedBooksResponse {
  success: boolean;
  data: Book[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Book {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  authorId: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  status: string;
  tags?: string[];
  theme?: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  rating?: number;
  reviewCount?: number;
}

export const booksService = {
  // Publishing Service - for browsing published books
  async getPublishedBooks(
    filters?: BookFilters,
  ): Promise<PaginatedBooksResponse> {
    const params = new URLSearchParams();
    if (filters?.ageGroup) params.append("ageGroup", filters.ageGroup);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.tags) params.append("tags", filters.tags.join(","));

    const response = await axios.get(
      `${PUBLISHING_API_URL}?${params.toString()}`,
    );
    return response.data;
  },

  // Get book for editing (uses authoring endpoint, requires auth)
  async getBookById(id: string) {
    const response = await axios.get(`${BOOK_API_URL}/${id}`);
    return response.data;
  },

  // Get published book for reading (uses publishing endpoint, public)
  async getPublishedBookById(id: string) {
    const response = await axios.get(`${PUBLISHING_API_URL}/${id}`);
    return response.data;
  },

  async searchBooks(
    query: string,
    filters?: Omit<BookFilters, "search">,
  ): Promise<PaginatedBooksResponse> {
    const params = new URLSearchParams();
    params.append("q", query);
    if (filters?.ageGroup) params.append("ageGroup", filters.ageGroup);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await axios.get(
      `/api/publishing/search?${params.toString()}`,
    );
    return response.data;
  },

  async getPopularBooks(limit: number = 10) {
    const response = await axios.get(`/api/publishing/popular?limit=${limit}`);
    return response.data;
  },

  async getRecentBooks(limit: number = 10) {
    const response = await axios.get(`/api/publishing/recent?limit=${limit}`);
    return response.data;
  },

  async getBooksByAgeGroup(ageGroup: string, limit: number = 10) {
    const response = await axios.get(
      `/api/publishing/age-group/${ageGroup}?limit=${limit}`,
    );
    return response.data;
  },

  // Authoring Service - for user's own books
  async getUserBooks() {
    const response = await axios.get(`${BOOK_API_URL}`);
    return response.data;
  },

  async createBook(title: string, description: string, ageGroup: string, tags?: string[]) {
    const response = await axios.post(BOOK_API_URL, {
      title,
      description,
      ageGroup,
      tags: tags || []
    });
    return response.data;
  },

  async updateBook(id: string, data: Partial<Book>) {
    const response = await axios.put(`${BOOK_API_URL}/${id}`, data);
    return response.data;
  },

  async deleteBook(id: string) {
    const response = await axios.delete(`${BOOK_API_URL}/${id}`);
    return response.data;
  },

  async publishBook(id: string) {
    const response = await axios.post(`${BOOK_API_URL}/${id}/publish`);
    return response.data;
  },

  // Chapter methods
  async getBookChapters(bookId: string) {
    const response = await axios.get(`${BOOK_API_URL}/${bookId}/chapters`);
    return response.data;
  },

  async getChapterById(chapterId: string) {
    const response = await axios.get(`/api/chapters/${chapterId}`);
    return response.data;
  },

  async createChapter(
    bookId: string,
    chapterData: {
      title: string;
      content: string;
      order: number;
      illustrationUrls?: string[];
    },
  ) {
    const response = await axios.post(
      `${BOOK_API_URL}/${bookId}/chapters`,
      chapterData,
    );
    return response.data;
  },

  async updateChapter(
    chapterId: string,
    chapterData: {
      title?: string;
      content?: string;
      order?: number;
      illustrationUrls?: string[];
    },
  ) {
    const response = await axios.put(`/api/chapters/${chapterId}`, chapterData);
    return response.data;
  },

  async deleteChapter(chapterId: string) {
    const response = await axios.delete(`/api/chapters/${chapterId}`);
    return response.data;
  },
};
