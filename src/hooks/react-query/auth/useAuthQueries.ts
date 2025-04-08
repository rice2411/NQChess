import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService, LoginCredentials } from "@/services/auth/auth.service";
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface";
import { IUser } from "@/types/domain/user/user.interface";

export const useAuthQueries = () => {
  const queryClient = useQueryClient();

  // Mutation để đăng nhập
  const loginMutation = useMutation<
    ISuccessResponse<IUser> | IErrorResponse,
    Error,
    LoginCredentials
  >({
    mutationFn: (credentials) => AuthService.login(credentials),
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Lưu thông tin user vào query cache
        queryClient.setQueryData(["auth", "currentUser", "data"], data.data);
        // Invalidate query để cập nhật thông tin user
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
  });

  // Mutation để đăng xuất
  const logoutMutation = useMutation<
    ISuccessResponse<null> | IErrorResponse,
    Error,
    void
  >({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Xóa thông tin user khỏi query cache
      queryClient.removeQueries({ queryKey: ["auth", "currentUser"] });
      // Invalidate query để xóa thông tin user
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  return {
    loginMutation,
    logoutMutation,
    queryClient,
  };
};
