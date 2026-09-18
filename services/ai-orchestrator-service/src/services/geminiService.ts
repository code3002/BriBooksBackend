import { GoogleGenerativeAI } from '@google/generative-ai';
import { AgeGroup } from '@bribooks/shared';
import { ExternalServiceError } from '@bribooks/shared';
import { prisma } from '@bribooks/database';
import {
    getStoryGenerationPrompt,
    getGrammarCheckPrompt,
    getContentImprovementPrompt,
    getIllustrationPrompt,
    getContentSafetyPrompt,
} from '../prompts';

// Gemini sometimes wraps JSON responses in ```json ... ``` markdown blocks
function stripMarkdownJson(text: string): string {
    return text
        .replace(/^```(?:json)?\s*/im, '')
        .replace(/\s*```\s*$/im, '')
        .trim();
}

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not configured');
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    // Generate story content
    async generateStory(
        prompt: string,
        ageGroup: AgeGroup,
        userId?: string,
        maxLength?: number
    ) {
        try {
            const systemPrompt = getStoryGenerationPrompt(prompt, ageGroup, maxLength);
            const result = await this.model.generateContent(systemPrompt);
            const response = await result.response;
            const content = response.text();

            // Log AI usage
            await this.logAIUsage({
                userId,
                requestType: 'story_generation',
                prompt: systemPrompt,
                response: content,
            });

            return {
                content,
                suggestions: [],
            };
        } catch (error: any) {
            throw new ExternalServiceError('Gemini AI', error.message);
        }
    }

    // Check grammar and spelling
    async checkGrammar(text: string, userId?: string) {
        try {
            const systemPrompt = getGrammarCheckPrompt(text);
            const result = await this.model.generateContent(systemPrompt);
            const response = await result.response;
            const content = response.text();

            // Parse JSON response (strip markdown code fences if present)
            let corrections = [];
            try {
                const parsed = JSON.parse(stripMarkdownJson(content));
                corrections = parsed.corrections || [];
            } catch (e) {
                corrections = [];
            }

            // Log AI usage
            await this.logAIUsage({
                userId,
                requestType: 'grammar_check',
                prompt: systemPrompt,
                response: content,
            });

            return { corrections };
        } catch (error: any) {
            throw new ExternalServiceError('Gemini AI', error.message);
        }
    }

    // Get content improvement suggestions
    async getContentSuggestions(text: string, ageGroup: AgeGroup, userId?: string) {
        try {
            const systemPrompt = getContentImprovementPrompt(text, ageGroup);
            const result = await this.model.generateContent(systemPrompt);
            const response = await result.response;
            const suggestions = response.text();

            // Log AI usage
            await this.logAIUsage({
                userId,
                requestType: 'content_improvement',
                prompt: systemPrompt,
                response: suggestions,
            });

            return { suggestions };
        } catch (error: any) {
            throw new ExternalServiceError('Gemini AI', error.message);
        }
    }

    // Generate illustration descriptions
    async generateIllustrationDescriptions(
        chapterContent: string,
        ageGroup: AgeGroup,
        userId?: string
    ) {
        try {
            const systemPrompt = getIllustrationPrompt(chapterContent, ageGroup);
            const result = await this.model.generateContent(systemPrompt);
            const response = await result.response;
            const descriptions = response.text();

            // Log AI usage
            await this.logAIUsage({
                userId,
                requestType: 'illustration_generation',
                prompt: systemPrompt,
                response: descriptions,
            });

            return { descriptions };
        } catch (error: any) {
            throw new ExternalServiceError('Gemini AI', error.message);
        }
    }

    // Check content safety
    async checkContentSafety(text: string, ageGroup: AgeGroup, userId?: string) {
        try {
            const systemPrompt = getContentSafetyPrompt(text, ageGroup);
            const result = await this.model.generateContent(systemPrompt);
            const response = await result.response;
            const content = response.text();

            // Parse JSON response (strip markdown code fences if present)
            let safetyResult = {
                isSafe: true,
                issues: [],
                recommendations: '',
            };

            try {
                const parsed = JSON.parse(stripMarkdownJson(content));
                safetyResult = {
                    isSafe: parsed.isSafe !== false,
                    issues: parsed.issues || [],
                    recommendations: parsed.recommendations || '',
                };
            } catch (e) {
                // If parsing fails, assume safe
                safetyResult.isSafe = true;
            }

            // Log AI usage
            await this.logAIUsage({
                userId,
                requestType: 'content_safety',
                prompt: systemPrompt,
                response: content,
            });

            return safetyResult;
        } catch (error: any) {
            throw new ExternalServiceError('Gemini AI', error.message);
        }
    }

    // Log AI usage to database
    private async logAIUsage(data: {
        userId?: string;
        requestType: string;
        prompt: string;
        response: string;
    }) {
        try {
            await prisma.aIGenerationLog.create({
                data: {
                    userId: data.userId,
                    requestType: data.requestType,
                    prompt: data.prompt,
                    response: data.response,
                    tokensUsed: null, // Can be calculated if needed
                },
            });
        } catch (error) {
            // Log error but don't fail the request
            console.error('Failed to log AI usage:', error);
        }
    }
}

export const geminiService = new GeminiService();
