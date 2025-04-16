import {
  createOrUpdateDocument,
  readDocument,
  deleteDocument,
  readDocuments,
} from "@/core/service/firestore.service"
import { ILesson } from "@/modules/lesson/interfaces/lesson.interface"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/core/types/api/response.interface"
import { serverTimestamp } from "firebase/firestore"
import { ELessonStatus } from "@/modules/lesson/enums/lesson.enum"
import { IGetRequest } from "@/core/types/api/request.interface"

const COLLECTION_NAME = "lessons"

export const LessonService = {
  // Create or Update
  createOrUpdate: async (
    data: Omit<ILesson, "id">,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<ILesson> | IErrorResponse> => {
    if (!data.classId || !data.startDate || !data.endDate) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: "Missing required fields: classId, startTime, endTime",
      }
    }

    const newLesson: Omit<ILesson, "id"> = {
      ...data,
      status: data.status || ELessonStatus.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const result = await createOrUpdateDocument<Omit<ILesson, "id">>(
      COLLECTION_NAME,
      newLesson,
      isBeautifyDate
    )

    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<ILesson>
  },

  // Read
  getAll: async (
    params: IGetRequest
  ): Promise<ISuccessResponse<ILesson[]> | IErrorResponse> => {
    const result = await readDocuments<ILesson>(COLLECTION_NAME, [], params)
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<ILesson[]>
  },

  getById: async (
    id: string,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<ILesson> | IErrorResponse> => {
    const result = await readDocument<ILesson>(
      COLLECTION_NAME,
      id,
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<ILesson>
  },

  // Delete
  delete: async (
    id: string
  ): Promise<ISuccessResponse<null> | IErrorResponse> => {
    const result = await deleteDocument(COLLECTION_NAME, id)
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<null>
  },

  // Get lessons by class
  getByClassId: async (
    classId: string
  ): Promise<ISuccessResponse<ILesson[]> | IErrorResponse> => {
    const result = await readDocuments<ILesson>(COLLECTION_NAME, [])
    if (!result.success) return result as IErrorResponse

    const lessons = result.data
    if (!lessons) {
      return {
        success: true,
        message: "No lessons found",
        data: [],
      }
    }

    const classLessons = lessons.filter((lesson) => lesson.classId === classId)

    return {
      success: true,
      message: classLessons.length ? "Lessons found" : "No lessons found",
      data: classLessons,
    }
  },

  // Update lesson status
  changeStatus: async (
    id: string,
    status: ELessonStatus,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<ILesson> | IErrorResponse> => {
    const result = await readDocument<ILesson>(
      COLLECTION_NAME,
      id,
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse

    const lesson = result.data
    if (!lesson) {
      return {
        success: false,
        errorCode: "NOT_FOUND",
        message: "Lesson not found",
      }
    }

    const updatedLesson = {
      ...lesson,
      status,
      createdAt: lesson.createdAt,
      updatedAt: serverTimestamp(),
    }

    const updateResult = await createOrUpdateDocument<ILesson>(
      COLLECTION_NAME,
      updatedLesson,
      isBeautifyDate
    )

    if (!updateResult.success) return updateResult as IErrorResponse
    return updateResult as ISuccessResponse<ILesson>
  },
}
