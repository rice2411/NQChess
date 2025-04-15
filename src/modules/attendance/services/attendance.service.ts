import {
  createOrUpdateDocument,
  readDocument,
  deleteDocument,
  readDocuments,
} from "@/core/service/firestore.service"
import { IAttendance } from "@/modules/attendance/interfaces/attendance.interface"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/core/types/api/response.interface"
import { serverTimestamp } from "firebase/firestore"
import { EAttendanceStatus } from "@/modules/attendance/enum/attendance.enum"
import { IGetRequest } from "@/core/types/api/request.interface"

const COLLECTION_NAME = "attendances"

export const AttendanceService = {
  // Create or Update
  createOrUpdateAttendance: async (
    data: Omit<IAttendance, "id">,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IAttendance> | IErrorResponse> => {
    if (!data.lessonId || !data.studentId || !data.status) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: "Missing required fields: lessonId, studentId, status",
      }
    }

    const newAttendance: Omit<IAttendance, "id"> = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const result = await createOrUpdateDocument<Omit<IAttendance, "id">>(
      COLLECTION_NAME,
      newAttendance,
      isBeautifyDate
    )

    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IAttendance>
  },

  // Read
  getAttendances: async (
    params: IGetRequest
  ): Promise<ISuccessResponse<IAttendance[]> | IErrorResponse> => {
    const result = await readDocuments<IAttendance>(COLLECTION_NAME, [], params)
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IAttendance[]>
  },

  getAttendanceById: async (
    id: string,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IAttendance> | IErrorResponse> => {
    const result = await readDocument<IAttendance>(
      COLLECTION_NAME,
      id,
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IAttendance>
  },

  // Delete
  deleteAttendance: async (
    id: string
  ): Promise<ISuccessResponse<null> | IErrorResponse> => {
    const result = await deleteDocument(COLLECTION_NAME, id)
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<null>
  },

  // Get attendances by lesson
  getAttendancesByLessonId: async (
    lessonId: string
  ): Promise<ISuccessResponse<IAttendance[]> | IErrorResponse> => {
    const result = await readDocuments<IAttendance>(COLLECTION_NAME, [])
    if (!result.success) return result as IErrorResponse

    const attendances = result.data
    if (!attendances) {
      return {
        success: true,
        message: "No attendances found",
        data: [],
      }
    }

    const lessonAttendances = attendances.filter(
      (attendance) => attendance.lessonId === lessonId
    )

    return {
      success: true,
      message: lessonAttendances.length
        ? "Attendances found"
        : "No attendances found",
      data: lessonAttendances,
    }
  },

  // Get attendances by student
  getAttendancesByStudentId: async (
    studentId: string
  ): Promise<ISuccessResponse<IAttendance[]> | IErrorResponse> => {
    const result = await readDocuments<IAttendance>(COLLECTION_NAME, [])
    if (!result.success) return result as IErrorResponse

    const attendances = result.data
    if (!attendances) {
      return {
        success: true,
        message: "No attendances found",
        data: [],
      }
    }

    const studentAttendances = attendances.filter(
      (attendance) => attendance.studentId === studentId
    )

    return {
      success: true,
      message: studentAttendances.length
        ? "Attendances found"
        : "No attendances found",
      data: studentAttendances,
    }
  },

  // Update attendance status
  changeStatusAttendance: async (
    id: string,
    status: EAttendanceStatus,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IAttendance> | IErrorResponse> => {
    const result = await readDocument<IAttendance>(
      COLLECTION_NAME,
      id,
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse

    const attendance = result.data
    if (!attendance) {
      return {
        success: false,
        errorCode: "NOT_FOUND",
        message: "Attendance not found",
      }
    }

    const updatedAttendance = {
      ...attendance,
      status,
      createdAt: attendance.createdAt,
      updatedAt: serverTimestamp(),
    }

    const updateResult = await createOrUpdateDocument<IAttendance>(
      COLLECTION_NAME,
      updatedAttendance,
      isBeautifyDate
    )

    if (!updateResult.success) return updateResult as IErrorResponse
    return updateResult as ISuccessResponse<IAttendance>
  },
}
