"use client"

import ApiDocumentation from "@/modules/documentation/api/components"
import {
  IEndpoint,
  IApiDocumentationProps,
} from "@/modules/documentation/api/interface/apiEndpoint.interface"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/core/types/api/response.interface"
import { AUTH_ENDPOINTS } from "@/modules/auth/constants/authEndpointData"
import { useAuthQueries } from "@/modules/auth/hooks/useAuthQueries"
import { AuthService } from "@/modules/auth/services/auth.service"

export default function AuthApiDocumentation() {
  const { loginMutation, logoutMutation } = useAuthQueries()

  const handleExecute = async (
    endpoint: IEndpoint,
    params: Record<string, any>
  ): Promise<ISuccessResponse<any> | IErrorResponse> => {
    try {
      switch (endpoint.service) {
        case "login":
          return await loginMutation.mutateAsync({
            username: params.username,
            password: params.password,
          })
        case "logout":
          return await logoutMutation.mutateAsync()
        default:
          return {
            success: false,
            errorCode: "INVALID_ENDPOINT",
            message: "Invalid endpoint",
          }
      }
    } catch (error) {
      return {
        success: false,
        errorCode: "API_ERROR",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  const props: IApiDocumentationProps = {
    title: "Auth API",
    endpoints: AUTH_ENDPOINTS,
    service: AuthService,
    onExecute: handleExecute,
  }

  return <ApiDocumentation {...props} />
}
