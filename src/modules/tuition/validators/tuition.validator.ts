import { IErrorResponse } from "@/core/types/api/response.interface"
import { ITuition } from "../interfaces/tuition.interface"
import { ETuitionStatus } from "../enum/tuition.enum"
import { TUITION_MESSAGES } from "./tuition.messages"

export type CreateTuitionData = Omit<ITuition, "id" | "createdAt" | "updatedAt">

export class TuitionValidator {
  validateAmount(amount: number): boolean {
    return amount > 0
  }

  validateMonth(month: string): boolean {
    const monthRegex = /^(0[1-9]|1[0-2])\/\d{4}$/
    return monthRegex.test(month)
  }

  validateStatus(status: string): boolean {
    return Object.values(ETuitionStatus).includes(status as ETuitionStatus)
  }

  validateCreateData(data: CreateTuitionData): IErrorResponse | null {
    if (!data.classId || !data.studentId || !data.amount || !data.month) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: TUITION_MESSAGES.MISSING_REQUIRED_FIELDS,
      }
    }

    if (!this.validateAmount(data.amount)) {
      return {
        success: false,
        errorCode: "INVALID_AMOUNT",
        message: TUITION_MESSAGES.INVALID_AMOUNT,
      }
    }

    if (!this.validateMonth(data.month)) {
      return {
        success: false,
        errorCode: "INVALID_MONTH",
        message: TUITION_MESSAGES.INVALID_MONTH,
      }
    }

    if (data.status && !this.validateStatus(data.status)) {
      return {
        success: false,
        errorCode: "INVALID_STATUS",
        message: TUITION_MESSAGES.INVALID_STATUS,
      }
    }

    return null
  }

  validateUpdateData(data: Partial<CreateTuitionData>): IErrorResponse | null {
    if (data.amount && !this.validateAmount(data.amount)) {
      return {
        success: false,
        errorCode: "INVALID_AMOUNT",
        message: TUITION_MESSAGES.INVALID_AMOUNT,
      }
    }

    if (data.month && !this.validateMonth(data.month)) {
      return {
        success: false,
        errorCode: "INVALID_MONTH",
        message: TUITION_MESSAGES.INVALID_MONTH,
      }
    }

    if (data.status && !this.validateStatus(data.status)) {
      return {
        success: false,
        errorCode: "INVALID_STATUS",
        message: TUITION_MESSAGES.INVALID_STATUS,
      }
    }

    return null
  }
}
