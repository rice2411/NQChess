// Định dạng số thành tiền Việt Nam (có dấu phẩy, thêm đ)
export function formatCurrencyVND(
  value: number | string,
  withSuffix = true
): string {
  let number =
    typeof value === "string"
      ? Number(value.toString().replace(/[^\d]/g, ""))
      : value
  if (isNaN(number)) number = 0
  const formatted = number.toLocaleString("vi-VN")
  return withSuffix ? `${formatted} đ` : formatted
}

export function formatCurrencyString(value: string): string {
  if (!value) return ""
  // Remove all non-digit characters
  const numberValue = value.replace(/\D/g, "")
  // Format with commas
  return numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
