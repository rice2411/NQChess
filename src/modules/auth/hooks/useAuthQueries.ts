import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthService } from "@/modules/auth/services/auth.service"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/core/types/api/response.interface"
import { IUser } from "@/modules/user/interfaces/user.interface"
import { ILoginCredentials } from "../validators/auth.validator"

export const useAuthQueries = () => {
  const queryClient = useQueryClient()

  // Mutation để đăng nhập
  const loginMutation = useMutation<
    ISuccessResponse<IUser> | IErrorResponse,
    Error,
    ILoginCredentials
  >({
    mutationFn: (credentials) => AuthService.login(credentials),
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Lưu thông tin user vào query cache
        queryClient.setQueryData(["auth", "currentUser", "data"], data.data)
        // Invalidate query để cập nhật thông tin user
        queryClient.invalidateQueries({ queryKey: ["auth"] })
      }
    },
  })

  // Mutation để đăng xuất
  const logoutMutation = useMutation<
    ISuccessResponse<null> | IErrorResponse,
    Error,
    void
  >({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Xóa thông tin user khỏi query cache
      queryClient.removeQueries({ queryKey: ["auth", "currentUser"] })
      // Invalidate query để xóa thông tin user
      queryClient.invalidateQueries({ queryKey: ["auth"] })
    },
  })

  return {
    loginMutation,
    logoutMutation,
    queryClient,
  }
}
