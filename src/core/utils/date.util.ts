import { addDays, getDay, startOfDay } from "date-fns"

/**
 * Converts day of week string to number (2-7)
 * @param schedule - Schedule string in format "HH:mm - HH:mm Thứ X"
 * @returns number representing day of week (2-7)
 */
export const getDayOfWeek = (schedule: string): number => {
  // Extract the day part from the schedule string
  const dayMatch = schedule.match(/Thứ\s+(\d+)$/)
  if (!dayMatch) {
    throw new Error(`Invalid schedule format: ${schedule}`)
  }
  const dayNumber = parseInt(dayMatch[1])
  if (dayNumber < 2 || dayNumber > 7) {
    throw new Error(
      `Invalid day of week: ${dayNumber}. Must be between 2 and 7`
    )
  }
  return dayNumber
}

/**
 * Converts JavaScript day of week (0-6) to Vietnamese day of week (2-7)
 * @param jsDay - JavaScript day of week (0-6)
 * @returns Vietnamese day of week (2-7)
 */
export const toVietnameseDay = (jsDay: number): number => {
  return jsDay === 0 ? 7 : jsDay + 1
}

/**
 * Converts Vietnamese day of week (2-7) to JavaScript day of week (0-6)
 * @param vnDay - Vietnamese day of week (2-7)
 * @returns JavaScript day of week (0-6)
 */
export const toJavaScriptDay = (vnDay: number): number => {
  return vnDay === 7 ? 0 : vnDay - 1
}

/**
 * Gets the first occurrence of a specific day of week from a given date
 * @param date - Starting date
 * @param targetDay - Target day of week (2-7) in Vietnamese convention
 * @returns Date of first occurrence
 */
export const getFirstDayOfWeek = (date: Date, targetDay: number): Date => {
  const currentDay = toVietnameseDay(getDay(date))
  let daysToAdd = targetDay - currentDay
  if (daysToAdd <= 0) daysToAdd += 7
  return addDays(startOfDay(date), daysToAdd)
}
