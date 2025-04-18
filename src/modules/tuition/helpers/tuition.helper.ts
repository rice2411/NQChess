/**
 * Tính các tháng cần đóng học phí từ ngày tham gia
 * @param startDate Ngày bắt đầu khóa học
 * @param endDate Ngày kết thúc khóa học
 * @param joinDate Ngày tham gia của học sinh
 * @returns Danh sách các tháng cần đóng học phí
 */
export const calculateTuitionMonths = (
  startDate: string,
  endDate: string,
  joinDate: string
): string[] => {
  // Convert DD/MM/YYYY to YYYY-MM-DD
  const convertToYYYYMMDD = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/")
    return `${year}-${month}-${day}`
  }

  // Chuyển đổi tất cả ngày thành ngày đầu tháng
  const start = new Date(convertToYYYYMMDD(startDate).slice(0, 7) + "-01")
  const end = new Date(convertToYYYYMMDD(endDate).slice(0, 7) + "-01")
  const join = new Date(joinDate.slice(0, 7) + "-01")

  // Nếu ngày tham gia sau ngày kết thúc, trả về mảng rỗng
  if (join > end) {
    return []
  }

  // Tạo mảng các tháng cần đóng học phí
  const months: string[] = []
  const currentDate = new Date(start) // Luôn bắt đầu từ ngày bắt đầu lớp

  while (currentDate <= end) {
    // Format: MM/yyyy
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
    const year = currentDate.getFullYear()
    months.push(`${month}/${year}`)

    // Tăng tháng lên 1
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return months
}

import { addDays, format, isBefore, parse } from "date-fns"
import { vi } from "date-fns/locale"
import { getDayOfWeek, getFirstDayOfWeek } from "@/core/utils/date.util"

export const calculateLessonsInMonth = (
  startDate: string,
  endDate: string,
  schedules: string[]
): number => {
  const start = parse(startDate, "dd/MM/yyyy", new Date())
  const end = parse(endDate, "dd/MM/yyyy", new Date())
  const month = start.getMonth()
  const year = start.getFullYear()

  // Get the first and last day of the month
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // If the end date is in the same month, use it as the last day
  if (end.getMonth() === month && end.getFullYear() === year) {
    lastDay.setDate(end.getDate())
  }

  // Count lessons in this month
  let lessonCount = 0
  const lessonDates: string[] = []

  for (const schedule of schedules) {
    try {
      const dayOfWeek = getDayOfWeek(schedule)
      // Find the first occurrence of the target day after start date
      let currentDate = getFirstDayOfWeek(firstDay, dayOfWeek)

      // Generate lessons until we reach last day
      while (
        isBefore(currentDate, lastDay) ||
        currentDate.getTime() === lastDay.getTime()
      ) {
        lessonCount++
        lessonDates.push(format(currentDate, "dd/MM/yyyy", { locale: vi }))
        // Move to next week
        currentDate = addDays(currentDate, 7)
      }
    } catch (error) {
      console.error(
        `Error calculating lessons for schedule ${schedule}:`,
        error
      )
      throw error
    }
  }

  return lessonCount
}

export const calculateActualLessons = (
  joinDate: Date,
  endDate: string,
  schedules: string[]
): number => {
  const join = new Date(joinDate)
  const end = parse(endDate, "dd/MM/yyyy", new Date())
  const month = join.getMonth()
  const year = join.getFullYear()

  // Get the last day of the month
  const lastDay = new Date(year, month + 1, 0)

  // If the end date is in the same month, use it as the last day
  if (end.getMonth() === month && end.getFullYear() === year) {
    lastDay.setDate(end.getDate())
  }

  // Count actual lessons after join date
  let lessonCount = 0
  const lessonDates: string[] = []

  for (const schedule of schedules) {
    try {
      const dayOfWeek = getDayOfWeek(schedule)
      // Find the first occurrence of the target day after join date
      let currentDate = getFirstDayOfWeek(join, dayOfWeek)

      // Generate lessons until we reach last day
      while (
        isBefore(currentDate, lastDay) ||
        currentDate.getTime() === lastDay.getTime()
      ) {
        lessonCount++
        lessonDates.push(format(currentDate, "dd/MM/yyyy", { locale: vi }))
        // Move to next week
        currentDate = addDays(currentDate, 7)
      }
    } catch (error) {
      console.error(
        `Error calculating actual lessons for schedule ${schedule}:`,
        error
      )
      throw error
    }
  }

  return lessonCount
}
