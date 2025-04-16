import { ClassSchedule } from "../interfaces/class.interface"

const SCHEDULE_REGEX =
  /^([01]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([01]?[0-9]|2[0-3]):[0-5][0-9]\s+Thứ\s+[2-7]$/

/**
 * Validates if a schedule string matches the required format
 * @param schedule - The schedule string to validate
 * @returns boolean indicating if the schedule is valid
 *
 * @example
 * isValidSchedule("19:00 - 20:30 Thứ 3") // true
 * isValidSchedule("19:00 - 20:30 Thứ 2") // true
 * isValidSchedule("19:00 - 20:30 Thứ 7") // true
 * isValidSchedule("19:00 - 20:30 Thứ 1") // false (invalid day)
 * isValidSchedule("19:00 - 20:30 Thứ 8") // false (invalid day)
 * isValidSchedule("19:00 - 20:30") // false (missing day)
 */
export const isValidSchedule = (
  schedule: string
): schedule is ClassSchedule => {
  return SCHEDULE_REGEX.test(schedule)
}

/**
 * Validates an array of schedules
 * @param schedules - Array of schedules to validate
 * @returns boolean indicating if all schedules are valid
 */
export const validateSchedules = (schedules: string[]): boolean => {
  return schedules.every(isValidSchedule)
}
