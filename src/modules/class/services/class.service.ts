import {
  createOrUpdateDocument,
  readDocument,
  updateDocument,
  deleteDocument,
  readDocuments,
} from "@/core/lib/firebase/fireStoreDatabase"
import { IClass } from "@/modules/class/interfaces/class.interface"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/core/types/api/response.interface"
import { serverTimestamp } from "firebase/firestore"
import {
  EClassStatus,
  EStudentClassStatus,
} from "@/modules/class/enums/class.enum"
import { ETuitionStatus } from "@/modules/tuition/enum/tuition.enum"
import { TuitionService } from "@/modules/tuition/services/tuition.service"
import { IGetRequest } from "@/core/types/api/request.interface"
import { calculateTuitionMonths } from "../../tuition/helpers/tuition.helper"

const COLLECTION_NAME = "classes"

export const ClassService = {
  // Create
  createOrUpdate: async (
    data: Omit<IClass, "id">,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IClass> | IErrorResponse> => {
    if (!data.name || !data.startDate || !data.endDate || !data.schedules) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: "Missing required fields: name, startDate, endDate, schedule",
      }
    }

    const newClass: Omit<IClass, "id"> = {
      ...data,
      students: data.students || [],
      status: data.status || EClassStatus.INACTIVE,
      tuition: data.tuition || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const result = await createOrUpdateDocument<Omit<IClass, "id">>(
      COLLECTION_NAME,
      newClass,
      isBeautifyDate
    )

    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IClass>
  },

  // Read
  getAll: async (
    params: IGetRequest
  ): Promise<ISuccessResponse<IClass[]> | IErrorResponse> => {
    const result = await readDocuments<IClass>(COLLECTION_NAME, [], params)
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IClass[]>
  },

  getById: async (
    id: string,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IClass> | IErrorResponse> => {
    const result = await readDocument<IClass>(
      COLLECTION_NAME,
      id,
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IClass>
  },

  // Delete
  delete: async (
    id: string
  ): Promise<ISuccessResponse<null> | IErrorResponse> => {
    const result = await deleteDocument(COLLECTION_NAME, id)
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<null>
  },

  // Add students to class
  addStudentsToClass: async (
    classId: string,
    studentIds: string[],
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IClass> | IErrorResponse> => {
    const classResult = await readDocument<IClass>(
      COLLECTION_NAME,
      classId,
      isBeautifyDate
    )
    if (!classResult.success) return classResult as IErrorResponse

    const classData = classResult.data
    if (!classData) {
      return {
        success: false,
        errorCode: "NOT_FOUND",
        message: "Class not found",
      }
    }

    const currentStudents = classData.students || []
    const newStudents = studentIds.map((id) => ({
      studentId: id,
      joinDate: new Date(),
      status: EStudentClassStatus.ONLINE,
    }))
    const updatedStudents = [...currentStudents, ...newStudents]

    // Create tuition for new students
    for (const studentId of studentIds) {
      const months = calculateTuitionMonths(
        classData.startDate,
        classData.endDate,
        new Date().toISOString()
      )

      for (const month of months) {
        await TuitionService.createForStudent(
          {
            classId,
            studentId,
            amount: classData.tuition || 0,
            month,
            status: ETuitionStatus.PENDING,
          },
          isBeautifyDate
        )
      }
    }

    const result = await updateDocument<IClass>(
      COLLECTION_NAME,
      classId,
      { students: updatedStudents },
      isBeautifyDate
    )

    return result as ISuccessResponse<IClass>
  },
}
