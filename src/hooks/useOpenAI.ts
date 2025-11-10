import { useState, useCallback } from 'react';
import { generateText } from '../services/openai';
import { type OpenAIRequest } from '../types/types';

export function useOpenAI(options?: { throwOnError?: boolean }): {
  data: string | null;
  error: string | null;
  loading: boolean;
  request: (params: OpenAIRequest) => Promise<void>;
  reset: () => void;
} {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (params: OpenAIRequest) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateText(params);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);

      const errorDetails = {
        type: 'OpenAI API Error',
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
        context: 'useOpenAI hook',
      };

      if (import.meta.env.DEV) {
        console.error('OpenAI Request Error:', errorDetails);
      }

      if (options?.throwOnError) {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [options?.throwOnError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, request, reset };
}