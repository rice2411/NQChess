import {
  createOrUpdateDocument,
  readDocument,
  updateDocument,
  deleteDocument,
  readDocuments,
} from "@/lib/firebase/fireStoreDatabase"
import { IClass } from "@/types/domain/class.interface"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface"
import { serverTimestamp } from "firebase/firestore"
import { EClassStatus, EStudentClassStatus } from "@/enum/class.enum"
import { ETuitionStatus } from "@/enum/tuition.enum"
import { calculateTuitionMonths } from "@/helpers/tuition.helper"
import { TuitionService } from "./tuition.service"
import { IGetRequest } from "@/types/api/request.interface"

const COLLECTION_NAME = "classes"

export const ClassService = {
  // Create
  createClass: async (
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
  getClasses: async ({
    isBeautifyDate = true,
  }: IGetRequest): Promise<ISuccessResponse<IClass[]> | IErrorResponse> => {
    const result = await readDocuments<IClass>(
      COLLECTION_NAME,
      [],
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IClass[]>
  },

  getClassById: async (
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
  deleteClass: async (
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
        await TuitionService.createTuitionForStudent(
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
