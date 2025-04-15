import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { StudentService } from "@/modules/student/services/student.service"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/core/types/api/response.interface"
import { IStudent } from "@/modules/student/interfaces/student.interface"
import { STUDENT_QUERY_KEYS } from "@/modules/student/constants/studentQueryKey"
import { IGetRequest } from "@/core/types/api/request.interface"

export const useStudentQueries = () => {
  const queryClient = useQueryClient()

  // Query để lấy danh sách học sinh
  const getAllQuery = useQuery<ISuccessResponse<IStudent[]> | IErrorResponse>({
    queryKey: STUDENT_QUERY_KEYS.getAll,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        STUDENT_QUERY_KEYS.getAll
      )
      return StudentService.getAll(params || {})
    },
    enabled: false,
  })

  // Query để lấy học sinh theo ID
  const getByIdQuery = useQuery<ISuccessResponse<IStudent> | IErrorResponse>({
    queryKey: STUDENT_QUERY_KEYS.getById,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        STUDENT_QUERY_KEYS.getById
      )
      return StudentService.getById(params?.id || "", params?.isBeautifyDate)
    },
    enabled: false,
  })

  // Query để tìm kiếm học sinh
  const absoluteSearchQuery = useQuery<
    ISuccessResponse<IStudent | null> | IErrorResponse
  >({
    queryKey: STUDENT_QUERY_KEYS.absoluteSearch,
    queryFn: () => {
      const params = queryClient.getQueryData<Record<string, any>>(
        STUDENT_QUERY_KEYS.absoluteSearch
      )
      if (!params) {
        return Promise.reject(new Error("Missing search parameters"))
      }
      return StudentService.absoluteSearch(
        params.fullName,
        params.dateOfBirth,
        params.phoneNumber
      )
    },
    enabled: false,
  })

  // Mutation để tạo/cập nhật học sinh
  const createOrUpdateMutation = useMutation<
    ISuccessResponse<IStudent> | IErrorResponse,
    Error,
    any
  >({
    mutationFn: (params: { data: IStudent; isBeautifyDate: boolean }) => {
      return StudentService.createOrUpdate(params.data, params.isBeautifyDate)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEYS.students })
    },
  })

  // Mutation để xóa học sinh
  const deleteMutation = useMutation<
    ISuccessResponse<void> | IErrorResponse,
    Error,
    string
  >({
    mutationFn: (id: string) => StudentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEYS.students })
    },
  })

  return {
    getAllQuery,
    getByIdQuery,
    absoluteSearchQuery,
    createOrUpdateMutation,
    deleteMutation,
    queryClient,
  }
}
