import { useState, useCallback } from 'react';

interface UsePaginationProps {
  pageSize?: number;
  initialPage?: number;
}

interface PaginationState {
  currentPage: number;
  hasMore: boolean;
  total: number;
  loading: boolean;
}

interface PaginationActions {
  setCurrentPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  resetPagination: () => void;
  nextPage: () => void;
}

export function usePagination({
  pageSize = 10,
  initialPage = 1,
}: UsePaginationProps = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setHasMore(true);
  }, [initialPage]);

  const nextPage = useCallback(() => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  const state: PaginationState = {
    currentPage,
    hasMore,
    total,
    loading,
  };

  const actions: PaginationActions = {
    setCurrentPage,
    setHasMore,
    setTotal,
    setLoading,
    resetPagination,
    nextPage,
  };

  return {
    state,
    actions,
    pageSize,
  };
}
