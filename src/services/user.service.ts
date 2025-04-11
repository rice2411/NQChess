import {
  createOrUpdateDocument,
  readDocument,
  deleteDocument,
  readDocuments,
} from "@/lib/firebase/fireStoreDatabase"
import { IUser } from "@/types/domain/user.interface"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface"
import { serverTimestamp } from "firebase/firestore"
import { EUserRole } from "@/enum/user.enum"
import { IGetRequest } from "@/types/api/request.interface"

const COLLECTION_NAME = "users"

export const UserService = {
  // Create or Update
  createOrUpdateUser: async (
    data: Omit<IUser, "id">,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IUser> | IErrorResponse> => {
    if (!data.username || !data.password || !data.role) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: "Missing required fields: username, password, role",
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
      newUser,
      isBeautifyDate
    )

    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IUser>
  },

  // Read
  getUsers: async (
    params: IGetRequest = { isBeautifyDate: true }
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

  getUserById: async (
    id: string,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IUser> | IErrorResponse> => {
    const result = await readDocument<IUser>(
      COLLECTION_NAME,
      id,
      isBeautifyDate
    )
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IUser>
  },

  // Delete
  deleteUser: async (
    id: string
  ): Promise<ISuccessResponse<null> | IErrorResponse> => {
    const result = await deleteDocument(COLLECTION_NAME, id)
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<null>
  },

  getUserByUsername: async (
    username: string
  ): Promise<ISuccessResponse<IUser | null> | IErrorResponse> => {
    const result = await readDocuments<IUser>(
      COLLECTION_NAME,
      [] // TODO: Add filters based on search params
    )

    if (!result.success) return result as IErrorResponse

    const user = result.data?.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    )

    return {
      ...result,
      data: user || null,
    } as ISuccessResponse<IUser | null>
  },
}
