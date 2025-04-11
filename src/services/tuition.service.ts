import {
  createOrUpdateDocument,
  readDocument,
  deleteDocument,
  readDocuments,
} from "@/lib/firebase/fireStoreDatabase"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface"
import { ITuition } from "@/types/domain/tuition.interface"
import { serverTimestamp } from "firebase/firestore"
import { ETuitionStatus } from "@/enum/tuition.enum"
import { IGetRequest } from "@/types/api/request.interface"

const COLLECTION_NAME = "tuitions"

export const TuitionService = {
  // Read
  getTuitions: async ({
    isBeautifyDate = true,
  }: IGetRequest): Promise<ISuccessResponse<ITuition[]> | IErrorResponse> => {
    const result = await readDocuments<ITuition>(
      COLLECTION_NAME,
      [],
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<ITuition[]>
  },

  getTuitionById: async (
    id: string,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<ITuition> | IErrorResponse> => {
    const result = await readDocument<ITuition>(
      COLLECTION_NAME,
      id,
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<ITuition>
  },

  // Delete
  deleteTuition: async (
    id: string
  ): Promise<ISuccessResponse<null> | IErrorResponse> => {
    const result = await deleteDocument(COLLECTION_NAME, id)
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<null>
  },

  // Get tuitions by student
  getTuitionsByStudentId: async (
    studentId: string,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<ITuition[]> | IErrorResponse> => {
    const result = await readDocuments<ITuition>(
      COLLECTION_NAME,
      [],
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse

    const tuitions = result.data
    if (!tuitions) {
      return {
        success: true,
        message: "No tuitions found",
        data: [],
      }
    }

    const studentTuitions = tuitions.filter(
      (tuition) => tuition.studentId === studentId
    )

    return {
      success: true,
      message: studentTuitions.length ? "Tuitions found" : "No tuitions found",
      data: studentTuitions,
    }
  },

  // Get tuitions by class
  getTuitionsByClassId: async (
    classId: string,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<ITuition[]> | IErrorResponse> => {
    const result = await readDocuments<ITuition>(
      COLLECTION_NAME,
      [],
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse

    const tuitions = result.data
    if (!tuitions) {
      return {
        success: true,
        message: "No tuitions found",
        data: [],
      }
    }

    const classTuitions = tuitions.filter(
      (tuition) => tuition.classId === classId
    )

    return {
      success: true,
      message: classTuitions.length ? "Tuitions found" : "No tuitions found",
      data: classTuitions,
    }
  },

  // Update tuition status
  changeStatusTuition: async (
    id: string,
    status: ETuitionStatus,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<ITuition> | IErrorResponse> => {
    const result = await readDocument<ITuition>(
      COLLECTION_NAME,
      id,
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse

    const tuition = result.data
    if (!tuition) {
      return {
        success: false,
        errorCode: "NOT_FOUND",
        message: "Tuition not found",
      }
    }

    const updatedTuition = {
      ...tuition,
      status,
      createdAt: tuition.createdAt,
      updatedAt: serverTimestamp(),
    }

    const updateResult = await createOrUpdateDocument<ITuition>(
      COLLECTION_NAME,
      updatedTuition,
      isBeautifyDate
    )

    if (!updateResult.success) return updateResult as IErrorResponse
    return updateResult as ISuccessResponse<ITuition>
  },

  // Create tuition for student
  createTuitionForStudent: async (
    data: Omit<ITuition, "id">,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<ITuition> | IErrorResponse> => {
    if (!data.classId || !data.studentId || !data.amount || !data.month) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: "Missing required fields: classId, studentId, amount, month",
      }
    }

    const newTuition: Omit<ITuition, "id"> = {
      ...data,
      status: ETuitionStatus.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const result = await createOrUpdateDocument<Omit<ITuition, "id">>(
      COLLECTION_NAME,
      newTuition,
      isBeautifyDate
    )

    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<ITuition>
  },
}
