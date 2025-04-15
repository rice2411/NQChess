import { STUDENT_MESSAGES } from "./student.messages"
import { IErrorResponse } from "@/core/types/api/response.interface"
import { IStudent } from "../interfaces/student.interface"
import { EGender } from "../enum/student.enum"

export type CreateStudentData = Omit<IStudent, "id" | "createdAt" | "updatedAt">

export class StudentValidator {
  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone)
  }

  validateDateOfBirth(dob: string): boolean {
    // Kiểm tra định dạng dd/mm/yyyy
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    if (!dateRegex.test(dob)) {
      return false
    }

    // Chuyển đổi thành Date object
    const [day, month, year] = dob.split("/").map(Number)
    const date = new Date(year, month - 1, day) // month - 1 vì tháng trong JS bắt đầu từ 0

    // Kiểm tra tính hợp lệ của ngày
    const isValidDate =
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year

    // Kiểm tra ngày phải trong quá khứ
    const now = new Date()
    return isValidDate && date < now
  }

  validateFullName(name: string): boolean {
    return name.length >= 2 && name.length <= 50
  }

  validateGender(gender: string): boolean {
    return Object.values(EGender).includes(gender as EGender)
  }

  validateClasses(classes: string[]): boolean {
    return Array.isArray(classes) && classes.every((c) => typeof c === "string")
  }

  validateCreateData(data: CreateStudentData): IErrorResponse | null {
    // Check required fields
    if (!data.fullName || !data.dateOfBirth || !data.phoneNumber) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: STUDENT_MESSAGES.MISSING_REQUIRED_FIELDS,
      }
    }

    // Validate fullName
    if (!this.validateFullName(data.fullName)) {
      return {
        success: false,
        errorCode: "INVALID_NAME",
        message: STUDENT_MESSAGES.INVALID_NAME,
      }
    }

    // Validate phone
    if (!this.validatePhoneNumber(data.phoneNumber)) {
      return {
        success: false,
        errorCode: "INVALID_PHONE",
        message: STUDENT_MESSAGES.INVALID_PHONE,
      }
    }

    // Validate date of birth
    if (!this.validateDateOfBirth(data.dateOfBirth)) {
      return {
        success: false,
        errorCode: "INVALID_DOB",
        message: STUDENT_MESSAGES.INVALID_DOB,
      }
    }

    // Validate gender if provided
    if (data.gender && !this.validateGender(data.gender)) {
      return {
        success: false,
        errorCode: "INVALID_GENDER",
        message: STUDENT_MESSAGES.INVALID_GENDER,
      }
    }

    // Validate classes if provided
    if (data.classes && !this.validateClasses(data.classes)) {
      return {
        success: false,
        errorCode: "INVALID_CLASSES",
        message: STUDENT_MESSAGES.INVALID_CLASSES,
      }
    }

    return null
  }

  validateUpdateData(data: Partial<CreateStudentData>): IErrorResponse | null {
    // Validate fullName if provided
    if (data.fullName && !this.validateFullName(data.fullName)) {
      return {
        success: false,
        errorCode: "INVALID_NAME",
        message: STUDENT_MESSAGES.INVALID_NAME,
      }
    }

    // Validate phone if provided
    if (data.phoneNumber && !this.validatePhoneNumber(data.phoneNumber)) {
      return {
        success: false,
        errorCode: "INVALID_PHONE",
        message: STUDENT_MESSAGES.INVALID_PHONE,
      }
    }

    // Validate date of birth if provided
    if (data.dateOfBirth && !this.validateDateOfBirth(data.dateOfBirth)) {
      return {
        success: false,
        errorCode: "INVALID_DOB",
        message: STUDENT_MESSAGES.INVALID_DOB,
      }
    }

    // Validate gender if provided
    if (data.gender && !this.validateGender(data.gender)) {
      return {
        success: false,
        errorCode: "INVALID_GENDER",
        message: STUDENT_MESSAGES.INVALID_GENDER,
      }
    }

    // Validate classes if provided
    if (data.classes && !this.validateClasses(data.classes)) {
      return {
        success: false,
        errorCode: "INVALID_CLASSES",
        message: STUDENT_MESSAGES.INVALID_CLASSES,
      }
    }

    return null
  }

  validateSearchData(
    fullName?: string,
    dateOfBirth?: string,
    phoneNumber?: string
  ): IErrorResponse | null {
    // Validate phone number if provided
    if (phoneNumber && !this.validatePhoneNumber(phoneNumber)) {
      return {
        success: false,
        errorCode: "INVALID_PHONE",
        message: STUDENT_MESSAGES.INVALID_PHONE,
      }
    }

    // Validate date of birth if provided
    if (dateOfBirth && !this.validateDateOfBirth(dateOfBirth)) {
      return {
        success: false,
        errorCode: "INVALID_DOB",
        message: STUDENT_MESSAGES.INVALID_DOB,
      }
    }

    // Validate full name if provided
    if (fullName && !this.validateFullName(fullName)) {
      return {
        success: false,
        errorCode: "INVALID_NAME",
        message: STUDENT_MESSAGES.INVALID_NAME,
      }
    }

    return null
  }
}
