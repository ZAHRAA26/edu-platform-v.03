import { useState, useEffect, useCallback } from 'react';
import { AxiosResponse } from 'axios';

// Generic API hook for handling API calls with loading, error, and data states
export function useApi<T>(
  apiCall: () => Promise<AxiosResponse<any>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      // Handle both direct data and API response format
      const responseData = response.data?.data || response.data;
      setData(responseData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook for API mutations (POST, PUT, DELETE)
export function useApiMutation<T, P = any>(
  apiCall: (params: P) => Promise<AxiosResponse<any>>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const mutate = useCallback(async (params: P) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await apiCall(params);
      const responseData = response.data?.data || response.data;
      
      setData(responseData);
      setSuccess(true);
      return responseData;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع';
      setError(errorMessage);
      console.error('API Mutation Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return { data, loading, error, success, mutate, reset };
}

// Hook for paginated API calls
export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number, filters?: any) => Promise<AxiosResponse<any>>,
  initialPage: number = 1,
  initialLimit: number = 10,
  initialFilters: any = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filters, setFilters] = useState<any>(initialFilters);

  const fetchData = useCallback(async (currentPage: number, currentLimit: number, currentFilters: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(currentPage, currentLimit, currentFilters);
      const responseData = response.data;
      
      setData(responseData.data || []);
      setTotal(responseData.meta?.total || 0);
      setTotalPages(responseData.meta?.totalPages || 0);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع';
      setError(errorMessage);
      console.error('Paginated API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData(page, limit, filters);
  }, [fetchData, page, limit, filters]);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const updateFilters = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when changing filters
  }, []);

  const refetch = useCallback(() => {
    fetchData(page, limit, filters);
  }, [fetchData, page, limit, filters]);

  return {
    data,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    filters,
    goToPage,
    changeLimit,
    updateFilters,
    refetch
  };
}