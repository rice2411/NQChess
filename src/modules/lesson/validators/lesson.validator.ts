import { IErrorResponse } from "@/core/types/api/response.interface"
import { ILesson } from "../interfaces/lesson.interface"
import { ELessonStatus } from "../enums/lesson.enum"
import { LESSON_MESSAGES } from "./lesson.messages"

export type CreateLessonData = Omit<ILesson, "id" | "createdAt" | "updatedAt">

export class LessonValidator {
  validateTitle(title: string): boolean {
    return title.length >= 3 && title.length <= 100
  }

  validateDescription(description: string): boolean {
    return description.length <= 500
  }

  validateStartTime(startTime: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(startTime)
  }

  validateEndTime(endTime: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(endTime)
  }

  validateDate(date: string): boolean {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    if (!dateRegex.test(date)) {
      return false
    }

    const [day, month, year] = date.split("/").map(Number)
    const lessonDate = new Date(year, month - 1, day)

    const isValidDate =
      lessonDate.getDate() === day &&
      lessonDate.getMonth() === month - 1 &&
      lessonDate.getFullYear() === year

    return isValidDate
  }

  validateStatus(status: string): boolean {
    return Object.values(ELessonStatus).includes(status as ELessonStatus)
  }

  validateCreateData(data: CreateLessonData): IErrorResponse | null {
    if (!data.classId || !data.startTime || !data.endTime) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: LESSON_MESSAGES.MISSING_REQUIRED_FIELDS,
      }
    }

    if (!this.validateStartTime(data.startTime)) {
      return {
        success: false,
        errorCode: "INVALID_START_TIME",
        message: LESSON_MESSAGES.INVALID_START_TIME,
      }
    }

    if (!this.validateEndTime(data.endTime)) {
      return {
        success: false,
        errorCode: "INVALID_END_TIME",
        message: LESSON_MESSAGES.INVALID_END_TIME,
      }
    }

    if (data.status && !this.validateStatus(data.status)) {
      return {
        success: false,
        errorCode: "INVALID_STATUS",
        message: LESSON_MESSAGES.INVALID_STATUS,
      }
    }

    return null
  }

  validateUpdateData(data: Partial<CreateLessonData>): IErrorResponse | null {
    if (data.startTime && !this.validateStartTime(data.startTime)) {
      return {
        success: false,
        errorCode: "INVALID_START_TIME",
        message: LESSON_MESSAGES.INVALID_START_TIME,
      }
    }

    if (data.endTime && !this.validateEndTime(data.endTime)) {
      return {
        success: false,
        errorCode: "INVALID_END_TIME",
        message: LESSON_MESSAGES.INVALID_END_TIME,
      }
    }

    if (data.status && !this.validateStatus(data.status)) {
      return {
        success: false,
        errorCode: "INVALID_STATUS",
        message: LESSON_MESSAGES.INVALID_STATUS,
      }
    }

    return null
  }
}
