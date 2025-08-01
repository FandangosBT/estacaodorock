import { useState, useCallback, useRef, useEffect } from 'react';

interface UseRetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffFactor?: number;
  maxDelay?: number;
  onRetry?: (attempt: number) => void;
  onMaxAttemptsReached?: () => void;
}

interface UseRetryReturn<T> {
  execute: () => Promise<T | null>;
  retry: () => void;
  reset: () => void;
  isLoading: boolean;
  error: Error | null;
  attempt: number;
  canRetry: boolean;
  data: T | null;
}

export function useRetry<T>(
  asyncFunction: () => Promise<T>,
  options: UseRetryOptions = {}
): UseRetryReturn<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoffFactor = 2,
    maxDelay = 10000,
    onRetry,
    onMaxAttemptsReached
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [data, setData] = useState<T | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const calculateDelay = useCallback((attemptNumber: number) => {
    const exponentialDelay = delay * Math.pow(backoffFactor, attemptNumber - 1);
    return Math.min(exponentialDelay, maxDelay);
  }, [delay, backoffFactor, maxDelay]);

  const execute = useCallback(async (): Promise<T | null> => {
    if (!isMountedRef.current) return null;

    setIsLoading(true);
    setError(null);

    const currentAttempt = attempt + 1;
    setAttempt(currentAttempt);

    try {
      const result = await asyncFunction();
      if (isMountedRef.current) {
        setData(result);
        setIsLoading(false);
        setError(null);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      if (!isMountedRef.current) return null;

      setError(error);
      setIsLoading(false);

      if (currentAttempt < maxAttempts) {
        const retryDelay = calculateDelay(currentAttempt);
        
        if (onRetry) {
          onRetry(currentAttempt);
        }

        timeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            execute();
          }
        }, retryDelay);
      } else {
        if (onMaxAttemptsReached) {
          onMaxAttemptsReached();
        }
      }

      return null;
    }
  }, [asyncFunction, attempt, maxAttempts, calculateDelay, onRetry, onMaxAttemptsReached]);

  const retry = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    execute();
  }, [execute]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setError(null);
    setAttempt(0);
    setData(null);
  }, []);

  const canRetry = attempt < maxAttempts && !isLoading;

  return {
    execute,
    retry,
    reset,
    isLoading,
    error,
    attempt,
    canRetry,
    data
  };
}

// Hook específico para requisições HTTP
export function useRetryFetch<T>(
  url: string,
  options?: RequestInit,
  retryOptions?: UseRetryOptions
): UseRetryReturn<T> {
  const fetchFunction = useCallback(async (): Promise<T> => {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }, [url, options]);

  return useRetry(fetchFunction, retryOptions);
}

// Hook para retry com exponential backoff e jitter
export function useRetryWithJitter<T>(
  asyncFunction: () => Promise<T>,
  options: UseRetryOptions = {}
): UseRetryReturn<T> {
  const jitterOptions = {
    ...options,
    delay: options.delay || 1000
  };

  // Adiciona jitter ao delay para evitar thundering herd
  const originalCalculateDelay = useCallback((attemptNumber: number) => {
    const baseDelay = (options.delay || 1000) * Math.pow(options.backoffFactor || 2, attemptNumber - 1);
    const maxDelay = options.maxDelay || 10000;
    const jitter = Math.random() * 0.1 * baseDelay; // 10% de jitter
    return Math.min(baseDelay + jitter, maxDelay);
  }, [options.delay, options.backoffFactor, options.maxDelay]);

  return useRetry(asyncFunction, {
    ...jitterOptions,
    delay: originalCalculateDelay(1)
  });
}