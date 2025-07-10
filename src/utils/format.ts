/**
 * Utility functions for formatting
 */

/**
 * Format số tiền thành VND với dấu phẩy ngăn cách hàng nghìn
 * @param value - Giá trị số hoặc string
 * @returns String đã format theo định dạng VND
 */
export const formatVND = (value: string | number): string => {
  const numValue =
    typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
  if (isNaN(numValue)) return '';
  return numValue.toLocaleString('vi-VN');
};

/**
 * Parse số tiền từ format VND về số nguyên
 * @param value - String đã format VND
 * @returns String chỉ chứa số
 */
export const parseVND = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Format số tiền thành VND với đơn vị tiền tệ
 * @param value - Giá trị số hoặc string
 * @returns String đã format với đơn vị VNĐ
 */
export const formatVNDWithUnit = (value: string | number): string => {
  const formatted = formatVND(value);
  return formatted ? `${formatted} VNĐ` : '';
};

/**
 * Validate số tiền VND
 * @param value - Giá trị cần validate
 * @returns true nếu hợp lệ, false nếu không hợp lệ
 */
export const validateVND = (value: string | number): boolean => {
  const numValue =
    typeof value === 'string' ? parseInt(parseVND(value)) : value;
  return !isNaN(numValue) && numValue > 0;
};
