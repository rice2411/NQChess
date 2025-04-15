import { CLASS_MESSAGES } from "./class.messages"
import { IErrorResponse } from "@/core/types/api/response.interface"
import { IClass, IStudentClass } from "../interfaces/class.interface"
import { EClassStatus, EStudentClassStatus } from "../enums/class.enum"

export type CreateClassData = Omit<IClass, "id" | "createdAt" | "updatedAt">

export class ClassValidator {
  validateName(name: string): boolean {
    return name.length >= 2 && name.length <= 50
  }

  validateDate(dateStr: string): boolean {
    // Kiểm tra định dạng dd/mm/yyyy
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    if (!dateRegex.test(dateStr)) {
      return false
    }

    // Chuyển đổi thành Date object
    const [day, month, year] = dateStr.split("/").map(Number)
    const date = new Date(year, month - 1, day)

    // Kiểm tra tính hợp lệ của ngày
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    )
  }

  validateDateRange(startDate: string, endDate: string): boolean {
    if (!this.validateDate(startDate) || !this.validateDate(endDate)) {
      return false
    }

    const [startDay, startMonth, startYear] = startDate.split("/").map(Number)
    const [endDay, endMonth, endYear] = endDate.split("/").map(Number)

    const start = new Date(startYear, startMonth - 1, startDay)
    const end = new Date(endYear, endMonth - 1, endDay)
    const now = new Date()

    return start >= now && end > start
  }

  validateSchedules(schedules: string[]): boolean {
    return (
      Array.isArray(schedules) &&
      schedules.length > 0 &&
      schedules.every(
        (schedule) => typeof schedule === "string" && schedule.length > 0
      )
    )
  }

  validateStatus(status: string): boolean {
    return Object.values(EClassStatus).includes(status as EClassStatus)
  }

  validateTuition(tuition: number): boolean {
    return typeof tuition === "number" && tuition >= 0
  }

  validateStudentStatus(status: string): boolean {
    return Object.values(EStudentClassStatus).includes(
      status as EStudentClassStatus
    )
  }

  validateStudentData(student: IStudentClass): boolean {
    return (
      typeof student.studentId === "string" &&
      student.studentId.length > 0 &&
      student.joinDate instanceof Date &&
      this.validateStudentStatus(student.status)
    )
  }

  validateCreateData(data: CreateClassData): IErrorResponse | null {
    // Check required fields
    if (!data.name || !data.startDate || !data.endDate || !data.schedules) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: CLASS_MESSAGES.MISSING_REQUIRED_FIELDS,
      }
    }

    // Validate name
    if (!this.validateName(data.name)) {
      return {
        success: false,
        errorCode: "INVALID_NAME",
        message: CLASS_MESSAGES.INVALID_NAME,
      }
    }

    // Validate dates
    if (!this.validateDateRange(data.startDate, data.endDate)) {
      return {
        success: false,
        errorCode: "INVALID_DATES",
        message: CLASS_MESSAGES.INVALID_START_DATE,
      }
    }

    // Validate schedules
    if (!this.validateSchedules(data.schedules)) {
      return {
        success: false,
        errorCode: "INVALID_SCHEDULES",
        message: CLASS_MESSAGES.INVALID_SCHEDULES,
      }
    }

    // Validate status if provided
    if (data.status && !this.validateStatus(data.status)) {
      return {
        success: false,
        errorCode: "INVALID_STATUS",
        message: CLASS_MESSAGES.INVALID_STATUS,
      }
    }

    // Validate tuition if provided
    if (data.tuition && !this.validateTuition(data.tuition)) {
      return {
        success: false,
        errorCode: "INVALID_TUITION",
        message: CLASS_MESSAGES.INVALID_TUITION,
      }
    }

    // Validate students if provided
    if (data.students && data.students.length > 0) {
      const isValidStudents = data.students.every((student) =>
        this.validateStudentData(student)
      )
      if (!isValidStudents) {
        return {
          success: false,
          errorCode: "INVALID_STUDENT_DATA",
          message: CLASS_MESSAGES.INVALID_STUDENT_DATA,
        }
      }
    }

    return null
  }

  validateUpdateData(data: Partial<CreateClassData>): IErrorResponse | null {
    // Validate name if provided
    if (data.name && !this.validateName(data.name)) {
      return {
        success: false,
        errorCode: "INVALID_NAME",
        message: CLASS_MESSAGES.INVALID_NAME,
      }
    }

    // Validate dates if both are provided
    if (data.startDate && data.endDate) {
      if (!this.validateDateRange(data.startDate, data.endDate)) {
        return {
          success: false,
          errorCode: "INVALID_DATES",
          message: CLASS_MESSAGES.INVALID_START_DATE,
        }
      }
    } else if (data.startDate || data.endDate) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: "Both startDate and endDate must be provided together",
      }
    }

    // Validate schedules if provided
    if (data.schedules && !this.validateSchedules(data.schedules)) {
      return {
        success: false,
        errorCode: "INVALID_SCHEDULES",
        message: CLASS_MESSAGES.INVALID_SCHEDULES,
      }
    }

    // Validate status if provided
    if (data.status && !this.validateStatus(data.status)) {
      return {
        success: false,
        errorCode: "INVALID_STATUS",
        message: CLASS_MESSAGES.INVALID_STATUS,
      }
    }

    // Validate tuition if provided
    if (data.tuition && !this.validateTuition(data.tuition)) {
      return {
        success: false,
        errorCode: "INVALID_TUITION",
        message: CLASS_MESSAGES.INVALID_TUITION,
      }
    }

    // Validate students if provided
    if (data.students && data.students.length > 0) {
      const isValidStudents = data.students.every((student) =>
        this.validateStudentData(student)
      )
      if (!isValidStudents) {
        return {
          success: false,
          errorCode: "INVALID_STUDENT_DATA",
          message: CLASS_MESSAGES.INVALID_STUDENT_DATA,
        }
      }
    }

    return null
  }

  validateAddStudents(studentIds: string[]): IErrorResponse | null {
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return {
        success: false,
        errorCode: "INVALID_STUDENT_IDS",
        message: "Student IDs must be a non-empty array",
      }
    }

    const isValidIds = studentIds.every(
      (id) => typeof id === "string" && id.length > 0
    )

    if (!isValidIds) {
      return {
        success: false,
        errorCode: "INVALID_STUDENT_IDS",
        message: "Invalid student ID format",
      }
    }

    return null
  }
}
