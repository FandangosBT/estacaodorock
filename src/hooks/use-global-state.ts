import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface ErrorState {
  [key: string]: Error | string | null;
}

interface GlobalStateContextType {
  // Loading states
  loadingStates: LoadingState;
  setLoading: (key: string, isLoading: boolean) => void;
  isLoading: (key?: string) => boolean;
  clearLoading: () => void;
  
  // Error states
  errorStates: ErrorState;
  setError: (key: string, error: Error | string | null) => void;
  getError: (key: string) => Error | string | null;
  clearError: (key: string) => void;
  clearAllErrors: () => void;
  hasError: (key?: string) => boolean;
  
  // Combined operations
  setLoadingWithError: (key: string, isLoading: boolean, error?: Error | string | null) => void;
  resetState: (key: string) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

// Provider component
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});
  const [errorStates, setErrorStates] = useState<ErrorState>({});

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key] || false;
    }
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  const clearLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  const setError = useCallback((key: string, error: Error | string | null) => {
    setErrorStates(prev => ({
      ...prev,
      [key]: error
    }));
  }, []);

  const getError = useCallback((key: string) => {
    return errorStates[key] || null;
  }, [errorStates]);

  const clearError = useCallback((key: string) => {
    setErrorStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrorStates({});
  }, []);

  const hasError = useCallback((key?: string) => {
    if (key) {
      return errorStates[key] != null;
    }
    return Object.values(errorStates).some(error => error != null);
  }, [errorStates]);

  const setLoadingWithError = useCallback((key: string, isLoading: boolean, error?: Error | string | null) => {
    setLoading(key, isLoading);
    if (error !== undefined) {
      setError(key, error);
    }
  }, [setLoading, setError]);

  const resetState = useCallback((key: string) => {
    setLoading(key, false);
    clearError(key);
  }, [setLoading, clearError]);

  const value: GlobalStateContextType = {
    loadingStates,
    setLoading,
    isLoading,
    clearLoading,
    errorStates,
    setError,
    getError,
    clearError,
    clearAllErrors,
    hasError,
    setLoadingWithError,
    resetState
  };

  return (
    React.createElement(GlobalStateContext.Provider, { value }, children)
  );
};

// Hook específico para operações assíncronas
export const useAsyncOperation = (key: string) => {
  const {
    setLoading,
    isLoading,
    setError,
    getError,
    resetState
  } = useGlobalState();

  const execute = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: Error) => void;
      clearErrorOnStart?: boolean;
    }
  ): Promise<T | null> => {
    const { onSuccess, onError, clearErrorOnStart = true } = options || {};

    try {
      setLoading(key, true);
      if (clearErrorOnStart) {
        setError(key, null);
      }

      const result = await asyncFn();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(key, errorObj);
      
      if (onError) {
        onError(errorObj);
      }
      
      return null;
    } finally {
      setLoading(key, false);
    }
  }, [key, setLoading, setError]);

  return {
    execute,
    isLoading: isLoading(key),
    error: getError(key),
    reset: () => resetState(key)
  };
};

// Hook para múltiplas operações
export const useMultipleAsyncOperations = (keys: string[]) => {
  const { isLoading, hasError, clearLoading, clearAllErrors } = useGlobalState();

  const isAnyLoading = useCallback(() => {
    return keys.some(key => isLoading(key));
  }, [keys, isLoading]);

  const hasAnyError = useCallback(() => {
    return keys.some(key => hasError(key));
  }, [keys, hasError]);

  const clearAllLoading = useCallback(() => {
    clearLoading();
  }, [clearLoading]);

  const clearErrors = useCallback(() => {
    clearAllErrors();
  }, [clearAllErrors]);

  return {
    isAnyLoading,
    hasAnyError,
    clearAllLoading,
    clearErrors
  };
};

// Hook para loading com timeout
export const useAsyncWithTimeout = (key: string, timeoutMs: number = 30000) => {
  const asyncOp = useAsyncOperation(key);

  const executeWithTimeout = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options?: Parameters<typeof asyncOp.execute>[1]
  ): Promise<T | null> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operação expirou após ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return asyncOp.execute(
      () => Promise.race([asyncFn(), timeoutPromise]).then(result => result as T),
      options
    );
  }, [asyncOp, timeoutMs]);

  return {
    ...asyncOp,
    executeWithTimeout
  };
};