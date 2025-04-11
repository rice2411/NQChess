import {
  createOrUpdateDocument,
  readDocument,
  deleteDocument,
  readDocuments,
} from "@/lib/firebase/fireStoreDatabase"
import { IStudent } from "@/types/domain/student.interface"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface"
import { serverTimestamp } from "firebase/firestore"
import { EGender } from "@/enum/student.enum"
import { IGetRequest } from "@/types/api/request.interface"

const COLLECTION_NAME = "students"

export const StudentService = {
  // Create or Update
  createOrUpdateStudent: async (
    data: Omit<IStudent, "id">,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IStudent> | IErrorResponse> => {
    if (!data.fullName || !data.dateOfBirth || !data.phoneNumber) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: "Missing required fields: fullName, dateOfBirth, phoneNumber",
      }
    }

    const newStudent: Omit<IStudent, "id"> = {
      ...data,
      gender: data.gender || EGender.MALE,
      avatar: data.avatar || "",
      classes: data.classes || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const result = await createOrUpdateDocument<Omit<IStudent, "id">>(
      COLLECTION_NAME,
      newStudent,
      isBeautifyDate
    )

    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IStudent>
  },

  // Read
  getStudents: async ({
    isBeautifyDate = true,
  }: IGetRequest): Promise<ISuccessResponse<IStudent[]> | IErrorResponse> => {
    const result = await readDocuments<IStudent>(
      COLLECTION_NAME,
      [],
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IStudent[]>
  },

  getStudentById: async (
    id: string,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IStudent> | IErrorResponse> => {
    const result = await readDocument<IStudent>(
      COLLECTION_NAME,
      id,
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IStudent>
  },

  // Delete
  deleteStudent: async (
    id: string
  ): Promise<ISuccessResponse<null> | IErrorResponse> => {
    const result = await deleteDocument(COLLECTION_NAME, id)
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<null>
  },

  // Search
  searchStudent: async (
    fullName?: string,
    dateOfBirth?: string,
    phoneNumber?: string,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IStudent | null> | IErrorResponse> => {
    const result = await readDocuments<IStudent>(
      COLLECTION_NAME,
      [],
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse

    const students = result.data
    if (!students) {
      return {
        success: true,
        message: "No students found",
        data: null,
      }
    }

    const foundStudent = students.find((student) => {
      const nameMatch = fullName
        ? student.fullName.toLowerCase().includes(fullName.toLowerCase())
        : true
      const dobMatch = dateOfBirth ? student.dateOfBirth === dateOfBirth : true
      const phoneMatch = phoneNumber
        ? student.phoneNumber === phoneNumber
        : true

      return nameMatch && dobMatch && phoneMatch
    })

    return {
      success: true,
      message: foundStudent ? "Student found" : "No student found",
      data: foundStudent || null,
    }
  },
}
