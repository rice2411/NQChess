import { useQueryClient } from "@tanstack/react-query"
import { IEndpoint } from "@/types/api/apiEndpoint.interface"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface"

export const useApiDocumentation = () => {
  const queryClient = useQueryClient()

  const handleExecute = async (
    endpoint: IEndpoint,
    params: Record<string, any>,
    queries: Record<string, any>,
    mutations: Record<string, any>,
    queryKeys: string[]
  ): Promise<ISuccessResponse<any> | IErrorResponse> => {
    try {
      const { service, method } = endpoint
      // Xử lý query (GET method)
      if (method === "GET" && queries[service]) {
        const query = queries[service]
        queryClient.setQueryData(queryKeys, params)
        const result = await query.refetch()
        return (
          result.data || {
            success: false,
            errorCode: "API_ERROR",
            message: `Failed to execute ${service}`,
          }
        )
      }

      // Xử lý mutation (POST, PUT, DELETE methods)
      if (["POST", "PUT", "DELETE"].includes(method) && mutations[service]) {
        const mutation = mutations[service]

        // Xử lý params dựa trên method
        let mutationParams = params
        switch (method) {
          case "DELETE":
            // DELETE thường chỉ cần id
            mutationParams = params.id
            break
          case "POST":
          case "PUT":
            // Xử lý params dựa trên thông tin từ endpoint
            const requiredParams = Object.entries(endpoint.parameters).reduce(
              (acc, [key, param]) => {
                acc[param.name] = params[key]
                return acc
              },
              {} as Record<string, any>
            )
            mutationParams = requiredParams
            break
        }

        const result = await mutation.mutateAsync(mutationParams)
        return result
      }

      return {
        success: false,
        errorCode: "INVALID_ENDPOINT",
        message: "Invalid endpoint",
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

  return {
    handleExecute,
    queryClient,
  }
}
