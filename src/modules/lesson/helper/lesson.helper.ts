import { ClassSchedule } from "../../class/interfaces/class.interface"
import { addDays, format, isBefore, parse } from "date-fns"
import { vi } from "date-fns/locale"
import { ILesson } from "../interfaces/lesson.interface"
import { getDayOfWeek, getFirstDayOfWeek } from "@/core/utils/date.util"

/**
 * Generates lessons based on class schedule and date range
 * @param startDate - Class start date
 * @param endDate - Class end date
 * @param schedules - Array of class schedules
 * @returns Array of lessons
 */
export const generateLessons = (
  startDate: string,
  endDate: string,
  schedules: ClassSchedule[]
): Omit<ILesson, "id">[] => {
  const lessons: Omit<ILesson, "id">[] = []
  const start = parse(startDate, "dd/MM/yyyy", new Date())
  const end = parse(endDate, "dd/MM/yyyy", new Date())

  // For each schedule, generate lessons
  for (const schedule of schedules) {
    try {
      const dayOfWeek = getDayOfWeek(schedule)
      // Find the first occurrence of the target day after start date
      let currentDate = getFirstDayOfWeek(start, dayOfWeek)

      // Generate lessons until we reach end date
      while (isBefore(currentDate, end)) {
        const formattedDate = format(currentDate, "dd/MM/yyyy", { locale: vi })
        lessons.push({
          title: `${schedule} - ${formattedDate}`,
          startDate: formattedDate,
          endDate: formattedDate,
          classId: "",
        })

        // Move to next week
        currentDate = addDays(currentDate, 7)
      }
    } catch (error) {
      console.error(`Error generating lessons for schedule ${schedule}:`, error)
      throw error
    }
  }

  // Sort lessons by date
  return lessons.sort((a, b) => {
    const dateA = parse(a.startDate, "dd/MM/yyyy", new Date())
    const dateB = parse(b.startDate, "dd/MM/yyyy", new Date())
    return dateA.getTime() - dateB.getTime()
  })
}
