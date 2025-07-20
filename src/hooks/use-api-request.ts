import { useState, useCallback } from "react";
import { apiRequest, ApiError } from "../lib/api-client";
import { useApiErrorHandler } from "./use-api-error-handler";

interface ApiRequestState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export const useApiRequest = <T>() => {
  const [state, setState] = useState<ApiRequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { handleApiError, showApiIpModal, closeApiIpModal } = useApiErrorHandler();

  const executeRequest = useCallback(
    async (
      requestFn: () => Promise<any>,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: ApiError) => void;
      }
    ) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await requestFn();
        const data = response.data;

        setState((prev) => ({ ...prev, data, loading: false }));
        options?.onSuccess?.(data);

        return data;
      } catch (error) {
        const apiError = error as ApiError;
        setState((prev) => ({ ...prev, error: apiError, loading: false }));

        handleApiError(apiError);
        options?.onError?.(apiError);

        throw apiError;
      }
    },
    [handleApiError]
  );

  const get = useCallback(
    async (
      endpoint: string,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: ApiError) => void;
      }
    ) => {
      return executeRequest(() => apiRequest.get<T>(endpoint), options);
    },
    [executeRequest]
  );

  const post = useCallback(
    async (
      endpoint: string,
      data?: any,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: ApiError) => void;
      }
    ) => {
      return executeRequest(() => apiRequest.post<T>(endpoint, data), options);
    },
    [executeRequest]
  );

  const put = useCallback(
    async (
      endpoint: string,
      data?: any,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: ApiError) => void;
      }
    ) => {
      return executeRequest(() => apiRequest.put<T>(endpoint, data), options);
    },
    [executeRequest]
  );

  const del = useCallback(
    async (
      endpoint: string,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: ApiError) => void;
      }
    ) => {
      return executeRequest(() => apiRequest.delete<T>(endpoint), options);
    },
    [executeRequest]
  );

  const patch = useCallback(
    async (
      endpoint: string,
      data?: any,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: ApiError) => void;
      }
    ) => {
      return executeRequest(() => apiRequest.patch<T>(endpoint, data), options);
    },
    [executeRequest]
  );

  return {
    ...state,
    get,
    post,
    put,
    delete: del,
    patch,
    showApiIpModal,
    closeApiIpModal,
  };
};
