import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { UserService } from "@/services/user.service"
import { USER_QUERY_KEYS } from "../../constant/queryKey/userQueryKey"
import { IGetRequest } from "@/types/api/request.interface"
import { IUser } from "@/types/domain/user.interface"

export const useUserQueries = () => {
  const queryClient = useQueryClient()

  // Query để lấy danh sách users
  const getUsersQuery = useQuery({
    queryKey: USER_QUERY_KEYS.getUsers,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        USER_QUERY_KEYS.getUsers
      )
      return UserService.getUsers(params || {})
    },
    enabled: false,
  })

  // Query để lấy user theo ID
  const getUserByIdQuery = useQuery({
    queryKey: USER_QUERY_KEYS.getUserById,
    queryFn: () => {
      const params: IGetRequest | undefined =
        queryClient.getQueryData<IGetRequest>(USER_QUERY_KEYS.getUserById)

      return UserService.getUserById(params?.id || "", params?.isBeautifyDate)
    },
    enabled: false,
  })

  // Query để tìm kiếm user
  const searchUserQuery = useQuery({
    queryKey: USER_QUERY_KEYS.searchUser,
    queryFn: () => {
      const params = queryClient.getQueryData<Record<string, any>>(
        USER_QUERY_KEYS.searchUser
      )
      return UserService.getUsers(params || {})
    },
    enabled: false,
  })

  // Query để lấy user theo username
  const getUserByUsernameQuery = useQuery({
    queryKey: USER_QUERY_KEYS.getUserByUsername,
    queryFn: () => {
      const params = queryClient.getQueryData<IUser>(
        USER_QUERY_KEYS.getUserByUsername
      )
      const { username } = params || {}
      return UserService.getUserByUsername(username || "")
    },
    enabled: false,
  })

  // Mutation để tạo/cập nhật user
  const createOrUpdateMutation = useMutation({
    mutationFn: (data: any) => UserService.createOrUpdateUser(data, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users })
    },
  })

  // Mutation để xóa user
  const deleteMutation = useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users })
    },
  })

  return {
    getUsersQuery,
    getUserByIdQuery,
    searchUserQuery,
    getUserByUsernameQuery,
    createOrUpdateMutation,
    deleteMutation,
    queryClient,
  }
}
