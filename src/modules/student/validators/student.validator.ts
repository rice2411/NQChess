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
    // Chuyển đổi thành Date object
    const date = new Date(dob) // month - 1 vì tháng trong JS bắt đầu từ 0

    // Kiểm tra ngày phải trong quá khứ
    const now = new Date()
    return  date < now
  }

  validateFullName(name: string): boolean {
    return name.length >= 2 && name.length <= 50
  }

  validateGender(gender: string): boolean {
    return Object.values(EGender).includes(gender as EGender)
  }

  validateAvatar(avatar: string): boolean {
    return true
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
