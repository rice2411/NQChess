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
