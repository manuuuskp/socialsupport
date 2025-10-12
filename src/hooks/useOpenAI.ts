import { useState, useCallback } from 'react';
import { generateText } from '../services/openai';
import { type OpenAIRequest } from '../types';

export function useOpenAI(): {
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
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, request, reset };
}