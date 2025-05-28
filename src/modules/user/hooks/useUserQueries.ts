import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { UserService } from "../services/user.service"
import { IUser } from "../interfaces/user.interface"

import { IGetRequest } from "@/core/types/api/request.interface"
import { USER_QUERY_KEYS } from "../constants/userQueryKey"

export const useUserQueries = () => {
  const queryClient = useQueryClient()

  // Query để lấy danh sách users
  const getAllQuery = useQuery({
    queryKey: USER_QUERY_KEYS.getAll,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        USER_QUERY_KEYS.getAll
      )
      return UserService.getAll(params || {})
    },
    enabled: false,
  })

  // Query để lấy user theo ID
  const getByIdQuery = useQuery({
    queryKey: USER_QUERY_KEYS.getById,
    queryFn: () => {
      const params: IGetRequest | undefined =
        queryClient.getQueryData<IGetRequest>(USER_QUERY_KEYS.getById)

      return UserService.getById(params?.id || "")
    },
    enabled: false,
  })

  // Query để lấy user theo username
  const getByUsernameQuery = useQuery({
    queryKey: USER_QUERY_KEYS.getByUsername,
    queryFn: () => {
      const params = queryClient.getQueryData<IUser>(
        USER_QUERY_KEYS.getByUsername
      )
      const { username } = params || {}
      return UserService.getByUsername(username || "")
    },
    enabled: false,
  })

  // Mutation để tạo/cập nhật user
  const createOrUpdateMutation = useMutation({
    mutationFn: (data: any) => UserService.createOrUpdater(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.getAll })
    },
  })

  // Mutation để xóa user
  const deleteMutation = useMutation({
    mutationFn: (id: string) => UserService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.getAll })
    },
  })

  return {
    getAllQuery,
    getByIdQuery,
    getByUsernameQuery,
    createOrUpdateMutation,
    deleteMutation,
    queryClient,
  }
}
