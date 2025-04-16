import {
  createOrUpdateDocument,
  readDocument,
  deleteDocument,
  readDocuments,
} from "@/core/service/firestore.service"
import { IStudent } from "@/modules/student/interfaces/student.interface"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/core/types/api/response.interface"
import { serverTimestamp } from "firebase/firestore"
import { EGender } from "@/modules/student/enum/student.enum"
import { IGetRequest } from "@/core/types/api/request.interface"
import { StudentValidator } from "../validators/student.validator"
import { STUDENT_MESSAGE } from "../constants/studentMessages"

const COLLECTION_NAME = "students"
const studentValidator = new StudentValidator()

export const StudentService = {
  // Create or Update
  createOrUpdate: async (
    data: Omit<IStudent, "id">,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IStudent> | IErrorResponse> => {
    // Validate data
    const validationError = studentValidator.validateCreateData(data)
    if (validationError) {
      return validationError
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

    if (!result.success) {
      return {
        success: false,
        errorCode: STUDENT_MESSAGE.ERRORS.CODES.CREATE_FAILED,
        message: STUDENT_MESSAGE.ERRORS.MESSAGES.CREATE_FAILED,
      }
    }

    return {
      success: true,
      message: STUDENT_MESSAGE.SUCCESS.MESSAGES.CREATE_SUCCESS,
      data: result.data as IStudent,
    }
  },

  // Read
  getAll: async (
    params: IGetRequest
  ): Promise<ISuccessResponse<IStudent[]> | IErrorResponse> => {
    const result = await readDocuments<IStudent>(COLLECTION_NAME, [], params)
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IStudent[]>
  },

  getById: async (
    id: string,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IStudent> | IErrorResponse> => {
    const result = await readDocument<IStudent>(
      COLLECTION_NAME,
      id,
      isBeautifyDate
    )
    if (!result.success) {
      return {
        success: false,
        errorCode: STUDENT_MESSAGE.ERRORS.CODES.NOT_FOUND,
        message: STUDENT_MESSAGE.ERRORS.MESSAGES.NOT_FOUND,
      }
    }
    return result as ISuccessResponse<IStudent>
  },

  // Delete
  delete: async (
    id: string
  ): Promise<ISuccessResponse<null> | IErrorResponse> => {
    const result = await deleteDocument(COLLECTION_NAME, id)
    if (!result.success) {
      return {
        success: false,
        errorCode: STUDENT_MESSAGE.ERRORS.CODES.DELETE_FAILED,
        message: STUDENT_MESSAGE.ERRORS.MESSAGES.DELETE_FAILED,
      }
    }
    return {
      success: true,
      message: STUDENT_MESSAGE.SUCCESS.MESSAGES.DELETE_SUCCESS,
      data: null,
    }
  },

  // Search
  absoluteSearch: async (
    fullName?: string,
    dateOfBirth?: string,
    phoneNumber?: string
  ): Promise<ISuccessResponse<IStudent | null> | IErrorResponse> => {
    // Validate search data
    const validationError = studentValidator.validateSearchData(
      fullName,
      dateOfBirth,
      phoneNumber
    )
    if (validationError) {
      return validationError
    }

    const result = await readDocuments<IStudent>(COLLECTION_NAME, [])
    if (!result.success) return result as IErrorResponse

    const students = result.data
    if (!students) {
      return {
        success: true,
        message: STUDENT_MESSAGE.ERRORS.MESSAGES.NOT_FOUND,
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
      message: foundStudent
        ? "Student found"
        : STUDENT_MESSAGE.ERRORS.MESSAGES.NOT_FOUND,
      data: foundStudent || null,
    }
  },
}
