import { useQueryClient } from "@tanstack/react-query";
import { IEndpoint } from "@/types/api/api.endpoints.interface";
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface";

export const useApiDocumentation = () => {
  const queryClient = useQueryClient();

  const handleExecute = async (
    endpoint: IEndpoint,
    params: Record<string, any>,
    queries: Record<string, any>,
    mutations: Record<string, any>,
    queryKeys: string[]
  ): Promise<ISuccessResponse<any> | IErrorResponse> => {
    try {
      const { service, method } = endpoint;

      // Xử lý query (GET method)
      if (method === "GET" && queries[service]) {
        const query = queries[service];
        console.log(queryKeys, params);
        queryClient.setQueryData(
          queryKeys,
          params[`${queryKeys[queryKeys.length - 1]}`]
        );
        const result = await query.refetch();
        return (
          result.data || {
            success: false,
            errorCode: "API_ERROR",
            message: `Failed to execute ${service}`,
          }
        );
      }

      // Xử lý mutation (POST, PUT, DELETE methods)
      if (["POST", "PUT", "DELETE"].includes(method) && mutations[service]) {
        const mutation = mutations[service];

        // Xử lý params dựa trên method
        let mutationParams = params;
        switch (method) {
          case "DELETE":
            // DELETE thường chỉ cần id
            mutationParams = params.id;
            break;
          case "POST":
          case "PUT":
            // POST/PUT thường cần data object và isBeutifyDate
            // Tách isBeutifyDate ra khỏi params
            const { isBeutifyDate, ...data } = params;
            mutationParams = {
              data,
              isBeutifyDate: isBeutifyDate ?? true,
            };
            break;
        }

        return await mutation.mutateAsync(mutationParams);
      }

      return {
        success: false,
        errorCode: "INVALID_ENDPOINT",
        message: "Invalid endpoint",
      };
    } catch (error) {
      return {
        success: false,
        errorCode: "API_ERROR",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  return {
    handleExecute,
    queryClient,
  };
};
