"use client";

import ApiDocumentation from "@/components/features/api-documentation";
import {
  IEndpoint,
  IApiDocumentationProps,
} from "@/types/api/api.endpoints.interface";
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface";
import { AUTH_ENDPOINTS } from "@/services/auth/auth.endpoint.sample";
import { useAuthQueries } from "@/hooks/react-query/auth/useAuthQueries";
import { AuthService } from "@/services/auth/auth.service";

export default function AuthApiDocumentation() {
  const { loginMutation, logoutMutation } = useAuthQueries();

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
          });
        case "logout":
          return await logoutMutation.mutateAsync();
        default:
          return {
            success: false,
            errorCode: "INVALID_ENDPOINT",
            message: "Invalid endpoint",
          };
      }
    } catch (error) {
      return {
        success: false,
        errorCode: "API_ERROR",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  const props: IApiDocumentationProps = {
    title: "Auth API",
    endpoints: AUTH_ENDPOINTS,
    service: AuthService,
    onExecute: handleExecute,
  };

  return <ApiDocumentation {...props} />;
}
