import { STUDENT_MESSAGE } from "../constants/studentMessages"
import { IErrorResponse } from "@/core/types/api/response.interface"
import { IStudent } from "../interfaces/student.interface"
import { EGender } from "../enum/student.enum"
import { BaseValidator } from "@/core/validators/base.validator"

export type CreateStudentData = Omit<IStudent, "id" | "createdAt" | "updatedAt">

export class StudentValidator extends BaseValidator {
  validatePhoneNumber(phone: string): boolean {
    return this.stringValidator.validatePhoneNumber(phone)
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
    return this.validateArrayOfStrings(classes)
  }

  validateAvatar(avatar: string): boolean {
    if (avatar === "") return true
    try {
      new URL(avatar)
      return true
    } catch {
      return false
    }
  }

  validateCreateData(data: CreateStudentData): IErrorResponse | null {
    // Check required fields
    const requiredFields = ["fullName", "dateOfBirth", "phoneNumber"]
    const requiredError = this.validateRequiredFields(
      data,
      requiredFields,
      STUDENT_MESSAGE.VALIDATION.CODES.MISSING_REQUIRED_FIELDS,
      STUDENT_MESSAGE.VALIDATION.MESSAGES.MISSING_REQUIRED_FIELDS
    )
    if (requiredError) return requiredError

    // Validate fullName
    if (!this.validateFullName(data.fullName)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_NAME,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_NAME
      )
    }

    // Validate phone
    if (!this.validatePhoneNumber(data.phoneNumber)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_PHONE,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_PHONE
      )
    }

    // Validate date of birth
    if (!this.validateDateOfBirth(data.dateOfBirth)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_DOB,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_DOB
      )
    }

    // Validate gender if provided
    if (data.gender && !this.validateEnumValue(data.gender, EGender)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_GENDER,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_GENDER
      )
    }

    // Validate classes if provided
    if (data.classes && !this.validateClasses(data.classes)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_CLASSES,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_CLASSES
      )
    }

    // Validate avatar if provided
    if (data.avatar && !this.validateAvatar(data.avatar)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_AVATAR,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_AVATAR
      )
    }

    return null
  }

  validateUpdateData(data: Partial<CreateStudentData>): IErrorResponse | null {
    if (data.fullName && !this.validateFullName(data.fullName)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_NAME,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_NAME
      )
    }

    if (data.phoneNumber && !this.validatePhoneNumber(data.phoneNumber)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_PHONE,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_PHONE
      )
    }

    if (data.dateOfBirth && !this.validateDateOfBirth(data.dateOfBirth)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_DOB,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_DOB
      )
    }

    if (data.gender && !this.validateEnumValue(data.gender, EGender)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_GENDER,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_GENDER
      )
    }

    if (data.classes && !this.validateClasses(data.classes)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_CLASSES,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_CLASSES
      )
    }

    if (data.avatar && !this.validateAvatar(data.avatar)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_AVATAR,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_AVATAR
      )
    }

    return null
  }

  validateSearchData(
    fullName?: string,
    dateOfBirth?: string,
    phoneNumber?: string
  ): IErrorResponse | null {
    if (fullName && !this.validateFullName(fullName)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_NAME,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_NAME
      )
    }

    if (dateOfBirth && !this.validateDateOfBirth(dateOfBirth)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_DOB,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_DOB
      )
    }

    if (phoneNumber && !this.validatePhoneNumber(phoneNumber)) {
      return this.createErrorResponse(
        STUDENT_MESSAGE.VALIDATION.CODES.INVALID_PHONE,
        STUDENT_MESSAGE.VALIDATION.MESSAGES.INVALID_PHONE
      )
    }

    return null
  }
}
