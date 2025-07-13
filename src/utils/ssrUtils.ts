import React from 'react';

/**
 * Utility functions để xử lý Server-Side Rendering (SSR)
 */

// Kiểm tra xem có đang chạy trên client không
export const isClient = typeof window !== 'undefined';

// Tạo Date object an toàn cho SSR
export const createSafeDate = (dateInput?: string | number | Date): Date => {
  if (!isClient) {
    return new Date(0); // Fallback cho server-side
  }

  if (dateInput) {
    return new Date(dateInput);
  }

  return new Date();
};

// Format date an toàn cho SSR
export const formatSafeDate = (
  dateInput: string | Date,
  formatFn: (date: Date) => string
): string => {
  if (!isClient) {
    // Fallback cho server-side
    if (typeof dateInput === 'string') {
      return dateInput.split('T')[0]; // Trả về YYYY-MM-DD
    }
    return 'N/A';
  }

  try {
    const date =
      typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return formatFn(date);
  } catch (error) {
    console.error('Lỗi format date:', error);
    return typeof dateInput === 'string' ? dateInput.split('T')[0] : 'N/A';
  }
};

// Tạo ISO string an toàn cho SSR
export const createSafeISOString = (
  dateInput?: string | number | Date
): string => {
  return createSafeDate(dateInput).toISOString();
};

// Format locale date an toàn cho SSR
export const formatSafeLocaleDate = (
  dateInput: string | Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!isClient) {
    // Fallback cho server-side
    if (typeof dateInput === 'string') {
      return dateInput.split('T')[0];
    }
    return 'N/A';
  }

  try {
    const date =
      typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error('Lỗi format locale date:', error);
    return typeof dateInput === 'string' ? dateInput.split('T')[0] : 'N/A';
  }
};

// Hook để chạy effect chỉ trên client
export const useClientEffect = (
  effect: () => void | (() => void),
  deps: React.DependencyList = []
) => {
  React.useEffect(() => {
    if (isClient) {
      return effect();
    }
  }, deps);
};

// Hook để lấy giá trị chỉ trên client
export const useClientValue = <T>(clientValue: T, serverValue: T): T => {
  return isClient ? clientValue : serverValue;
};
