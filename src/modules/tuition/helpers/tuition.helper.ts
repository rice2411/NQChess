/**
 * Tính các tháng cần đóng học phí từ ngày tham gia
 * @param startDate Ngày bắt đầu khóa học (YYYY-MM-DD)
 * @param endDate Ngày kết thúc khóa học (YYYY-MM-DD)
 * @param joinDate Ngày tham gia lớp (YYYY-MM-DD)
 * @returns Mảng các tháng cần đóng học phí theo format [MM/yyyy]
 *
 * Ví dụ:
 * - Khóa học: 2024-01-01 đến 2024-12-31
 * - Tham gia: 2024-03-15
 * => Kết quả: ["03/2024", "04/2024", "05/2024", "06/2024", "07/2024", "08/2024", "09/2024", "10/2024", "11/2024", "12/2024"]
 *
 * - Khóa học: 2024-01-01 đến 2024-12-31
 * - Tham gia: 2024-12-15
 * => Kết quả: ["12/2024"]
 *
 * - Khóa học: 2024-01-01 đến 2024-12-31
 * - Tham gia: 2023-12-15
 * => Kết quả: ["01/2024", "02/2024", "03/2024", "04/2024", "05/2024", "06/2024", "07/2024", "08/2024", "09/2024", "10/2024", "11/2024", "12/2024"]
 */
export const calculateTuitionMonths = (
  startDate: string,
  endDate: string,
  joinDate: string
): string[] => {
  // Chuyển đổi tất cả ngày thành ngày đầu tháng
  const start = new Date(startDate.slice(0, 7) + "-01");
  const end = new Date(endDate.slice(0, 7) + "-01");
  const join = new Date(joinDate.slice(0, 7) + "-01");

  // Nếu ngày tham gia sau ngày kết thúc, trả về mảng rỗng
  if (join > end) {
    return [];
  }

  // Nếu ngày tham gia trước ngày bắt đầu, lấy ngày bắt đầu làm mốc
  const effectiveStartDate = join < start ? start : join;

  // Tạo mảng các tháng cần đóng học phí
  const months: string[] = [];
  const currentDate = new Date(effectiveStartDate);

  while (currentDate <= end) {
    // Format: MM/yyyy
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    months.push(`${month}/${year}`);

    // Tăng tháng lên 1
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
};
