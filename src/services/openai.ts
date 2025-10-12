import axios from 'axios';
import { type OpenAIRequest } from '../types';
import { fieldPrompts } from '../utils/constants/prompts';

const OPENAI_API_URL = import.meta.env.VITE_OPENAPI_URL;
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

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  baseDelay: number = 1000
): Promise<T> => {
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;

      if (attempt > maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Maximum retries exceeded');
};

export async function generateText({
  fieldKey,
  contextText,
  tone = 'professional',
  length = 'medium'
}: OpenAIRequest): Promise<string> {
  if (!API_KEY) {
    throw new Error('OpenAI API key is not configured. Please add OPENAI_KEY.');
  }

  const systemMessage = `
You are a helpful assistant that writes first-person, professional financial assistance applications. 
You will receive details about the applicant (like name, employment status, dependents, housing status, income, etc.) and must write as if the applicant themselves is submitting the request.

Instructions:
- Write the response **in the first person** (use “I”, not “he/she”).
- Do **not** include any labels such as “Short response” or “Medium response”.
- Always use the applicant's name (provided in the user message) when signing off or referring to the applicant.
- Maintain a respectful, humble, and professional tone suitable for a government or social support application.
- Length: 
  - short → 50-100 words
  - medium → 100-200 words
  - long → 200-300 words
- Focus on genuine need, family context, and financial hardship.

Generate a ${tone} and ${length} application response for the field "${fieldKey}".
`;

  const fieldContext = fieldPrompts[fieldKey as keyof typeof fieldPrompts];

  const userMessage = `
Please generate a statement for the "${fieldKey}" section.

${fieldContext}

User-provided details:
${contextText}

Tone: respectful
Length: medium
Field: ${fieldKey}
`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage }
  ];

  const makeRequest = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await axios.post<OpenAIResponse>(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from OpenAI API');
      }

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      clearTimeout(timeoutId);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          throw new Error('Request timed out. Please try again.');
        }

        if (error.response?.status === 401) {
          throw new Error('Invalid OpenAI API key. Please check your configuration.');
        }

        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        }

        throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
      }

      throw error;
    }
  };

  return retryWithBackoff(makeRequest);
}