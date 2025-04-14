import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ClassService } from "@/modules/class/services/class.service"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/core/types/api/response.interface"
import { IGetRequest } from "@/core/types/api/request.interface"
import { CLASS_QUERY_KEYS } from "../constants/classQueryKey"
import { IClass } from "../interfaces/class.interface"

export const useClassQueries = () => {
  const queryClient = useQueryClient()

  // Query để lấy danh sách lớp học
  const getAllQuery = useQuery<ISuccessResponse<IClass[]> | IErrorResponse>({
    queryKey: CLASS_QUERY_KEYS.getAll,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        CLASS_QUERY_KEYS.getAll
      )
      return ClassService.getAll(params || {})
    },
    enabled: false,
  })

  // Query để lấy thông tin lớp học theo ID
  const getByIdQuery = useQuery<ISuccessResponse<IClass> | IErrorResponse>({
    queryKey: CLASS_QUERY_KEYS.getById,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        CLASS_QUERY_KEYS.getById
      )
      return ClassService.getById(params?.id || "", params?.isBeautifyDate)
    },
    enabled: false,
  })

  // Mutation để tạo/cập nhật lớp học
  const createOrUpdateMutation = useMutation<
    ISuccessResponse<IClass> | IErrorResponse,
    Error,
    { data: Omit<IClass, "id">; isBeautifyDate: boolean }
  >({
    mutationFn: ({ data, isBeautifyDate }) =>
      ClassService.createOrUpdate(data, isBeautifyDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.classes })
    },
  })

  // Mutation để thêm học sinh vào lớp
  const addStudentsToClassMutation = useMutation<
    ISuccessResponse<IClass> | IErrorResponse,
    Error,
    { classId: string; studentIds: string[]; isBeautifyDate?: boolean }
  >({
    mutationFn: ({ classId, studentIds, isBeautifyDate }) =>
      ClassService.addStudentsToClass(classId, studentIds, isBeautifyDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.classes })
    },
  })

  // Mutation để xóa lớp học
  const deleteMutation = useMutation<
    ISuccessResponse<void> | IErrorResponse,
    Error,
    string
  >({
    mutationFn: (id: string) => ClassService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.classes })
    },
  })

  return {
    getAllQuery,
    getByIdQuery,
    createOrUpdateMutation,
    addStudentsToClassMutation,
    deleteMutation,
    queryClient,
  }
}
