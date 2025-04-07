"use client";

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
import { AuthService, LoginCredentials } from "@/services/auth/auth.service";
import { IUser } from "@/types/domain/user/user.interface";

export default function AuthApiDocumentation() {
  // Mutation để đăng nhập
  const loginMutation = useMutation<
    ISuccessResponse<IUser> | IErrorResponse,
    Error,
    LoginCredentials
  >({
    mutationFn: async (credentials) => {
      const response = await AuthService.login(credentials);
      return {
        success: true,
        message: "Đăng nhập thành công",
        data: response,
      };
    },
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
      login: async (credentials: LoginCredentials) => {
        const response = await AuthService.login(credentials);
        return {
          success: true,
          message: "Đăng nhập thành công",
          data: response,
        };
      },
    },
    onExecute: handleExecute,
  };

  return <ApiDocumentation {...props} />;
}
