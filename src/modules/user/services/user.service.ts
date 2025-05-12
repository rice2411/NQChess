import {
  createOrUpdateDocument,
  readDocument,
  deleteDocument,
  readDocuments,
} from "@/core/service/firestore.service"
import { IUser } from "../interfaces/user.interface"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/core/types/api/response.interface"
import { serverTimestamp } from "firebase/firestore"
import { EUserRole } from "../enums/user.enum"
import { IGetRequest } from "@/core/types/api/request.interface"
import { USER_MESSAGE } from "../constants/userMessages"

const COLLECTION_NAME = "users"

export const UserService = {
  // Create or Update
  createOrUpdater: async (
    data: Omit<IUser, "id">
  ): Promise<ISuccessResponse<IUser> | IErrorResponse> => {
    if (!data.username || !data.password || !data.role) {
      return {
        success: false,
        errorCode: USER_MESSAGE.VALIDATION.CODES.MISSING_REQUIRED_FIELDS,
        message: USER_MESSAGE.VALIDATION.MESSAGES.MISSING_REQUIRED_FIELDS,
      }
    }

    const newUser: Omit<IUser, "id"> = {
      ...data,
      role: data.role || EUserRole.TEACHER,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const result = await createOrUpdateDocument<Omit<IUser, "id">>(
      COLLECTION_NAME,
      newUser
    )

    if (!result.success) {
      return {
        success: false,
        errorCode: USER_MESSAGE.ERRORS.CODES.CREATE_FAILED,
        message: USER_MESSAGE.ERRORS.MESSAGES.CREATE_FAILED,
      }
    }

    return {
      success: true,
      message: USER_MESSAGE.SUCCESS.MESSAGES.CREATE_SUCCESS,
      data: result.data as IUser,
    }
  },

  // Read
  getAll: async (
    params: IGetRequest
  ): Promise<ISuccessResponse<IUser[]> | IErrorResponse> => {
    const result = await readDocuments<IUser>(
      COLLECTION_NAME,
      [], // TODO: Add filters based on search params
      params
    )

    if (!result.success) return result as IErrorResponse

    // Apply filters
    const users = result.data || []

    return {
      ...result,
      data: users,
    } as ISuccessResponse<IUser[]>
  },

  getById: async (
    id: string
  ): Promise<ISuccessResponse<IUser> | IErrorResponse> => {
    const result = await readDocument<IUser>(COLLECTION_NAME, id)
    if (!result.success) {
      return {
        success: false,
        errorCode: USER_MESSAGE.ERRORS.CODES.NOT_FOUND,
        message: USER_MESSAGE.ERRORS.MESSAGES.NOT_FOUND,
      }
    }
    return result as ISuccessResponse<IUser>
  },

  // Delete
  delete: async (
    id: string
  ): Promise<ISuccessResponse<null> | IErrorResponse> => {
    const result = await deleteDocument(COLLECTION_NAME, id)
    if (!result.success) {
      return {
        success: false,
        errorCode: USER_MESSAGE.ERRORS.CODES.DELETE_FAILED,
        message: USER_MESSAGE.ERRORS.MESSAGES.DELETE_FAILED,
      }
    }
    return {
      success: true,
      message: USER_MESSAGE.SUCCESS.MESSAGES.DELETE_SUCCESS,
      data: null,
    }
  },
}
