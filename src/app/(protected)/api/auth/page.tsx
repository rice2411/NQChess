"use client"

import ApiDocumentation from "@/components/features/apiDocumentation"
import {
  IEndpoint,
  IApiDocumentationProps,
} from "@/types/api/apiEndpoint.interface"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface"
import { AUTH_ENDPOINTS } from "@/constants/endpoint/authEndpointData"
import { useAuthQueries } from "@/hooks/react-query/useAuthQueries"
import { AuthService } from "@/services/auth.service"

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
