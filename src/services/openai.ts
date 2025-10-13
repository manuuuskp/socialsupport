import { createAxiosInstance } from './axiosInterceptor';
import { type OpenAIRequest } from '../types';
import { fieldPrompts } from '../utils/constants/prompts';
import { buildSystemPrompt, buildUserPrompt } from '../utils/prompts/buildPrompts';

const API_KEY = import.meta.env.VITE_OPENAI_KEY;

interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const openaiApi = createAxiosInstance({
  baseURL: '/api/openai',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
}, {
  enableRetry: true,
  maxRetries: 2,
  retryDelay: 1000,
  onError: async (error) => {
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }
    throw error;
  }
});

export async function generateText({
  fieldKey,
  contextText,
  tone = 'professional',
  length = 'medium',
  language = 'en'
}: OpenAIRequest): Promise<string> {
  if (!API_KEY) {
    throw new Error('OpenAI API key is not configured. Please add OPENAI_KEY.');
  }

  const systemMessage = buildSystemPrompt({
    fieldKey,
    contextText,
    tone,
    length,
    language
  });

  const fieldContext = fieldPrompts[fieldKey as keyof typeof fieldPrompts];

  const userMessage = buildUserPrompt({
    fieldKey,
    contextText,
    tone,
    length,
    language
  }, fieldContext)

  const messages: ChatMessage[] = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await openaiApi.post<OpenAIResponse>('/', {
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    if (!response.data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    throw error;
  }
}