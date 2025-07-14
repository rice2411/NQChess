'use client';
import { useEffect, useState } from 'react';

/**
 * Hook để xử lý Server-Side Rendering (SSR)
 */

// Kiểm tra xem có đang chạy trên client không
export const isClient = typeof window !== 'undefined';

// Hook để chạy effect chỉ trên client
export const useClientEffect = (
  effect: () => void | (() => void),
  deps: React.DependencyList = []
) => {
  useEffect(() => {
    if (isClient) {
      return effect();
    }
  }, deps);
};

// Hook để lấy giá trị chỉ trên client
export const useClientValue = <T>(clientValue: T, serverValue: T): T => {
  return isClient ? clientValue : serverValue;
};

// Hook để tránh hydration mismatch
export const useHydrated = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};

// Hook để chạy async function chỉ trên client
export const useClientAsync = <T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = []
): [T | null, boolean, Error | null] => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useClientEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFn();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps);

  return [data, loading, error];
};
