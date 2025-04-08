"use client";

import { AuthService } from "@/services/auth/auth.service";
import ApiDocumentation from "@/components/api-documentation";
import {
  IEndpoint,
  IApiDocumentationProps,
} from "@/types/api/api.endpoints.interface";
import { useMutation } from "@tanstack/react-query";
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface";
import { AUTH_ENDPOINTS } from "@/services/auth/auth.endpoint.sample";
import { IUser } from "@/types/domain/user/user.interface";

export default function AuthApiDocumentation() {
  // Mutation để đăng nhập
  const loginMutation = useMutation<
    ISuccessResponse<IUser> | IErrorResponse,
    Error,
    { username: string; password: string }
  >({
    mutationFn: (credentials) => AuthService.login(credentials),
  });

  // Mutation để đăng xuất
  const logoutMutation = useMutation<
    ISuccessResponse<null> | IErrorResponse,
    Error
  >({
    mutationFn: () => AuthService.logout(),
  });

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
    service: {
      login: (credentials) => AuthService.login(credentials),
      logout: () => AuthService.logout(),
    },
    onExecute: handleExecute,
  };

  return <ApiDocumentation {...props} />;
}
