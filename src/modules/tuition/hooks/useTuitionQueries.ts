import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { TuitionService } from "@/modules/tuition/services/tuition.service"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/core/types/api/response.interface"
import { ITuition } from "@/modules/tuition/interfaces/tuition.interface"
import { TUITION_QUERY_KEYS } from "@/modules/tuition/constants/tuitionQueryKey"
import { ETuitionStatus } from "@/modules/tuition/enum/tuition.enum"
import { IGetRequest } from "@/core/types/api/request.interface"

export const useTuitionQueries = () => {
  const queryClient = useQueryClient()

  // Query để lấy danh sách học phí
  const getAllQuery = useQuery<ISuccessResponse<ITuition[]> | IErrorResponse>({
    queryKey: TUITION_QUERY_KEYS.getAll,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        TUITION_QUERY_KEYS.getAll
      )
      return TuitionService.getAll(params || {})
    },
    enabled: false,
  })

  // Query để lấy thông tin học phí theo ID
  const getByIdQuery = useQuery<ISuccessResponse<ITuition> | IErrorResponse>({
    queryKey: TUITION_QUERY_KEYS.getById,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        TUITION_QUERY_KEYS.getById
      )
      return TuitionService.getById(params?.id || "")
    },
    enabled: false,
  })

  // Query để lấy danh sách học phí theo ID học sinh
  const getByStudentIdQuery = useQuery<
    ISuccessResponse<ITuition[]> | IErrorResponse
  >({
    queryKey: TUITION_QUERY_KEYS.getByStudentId,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        TUITION_QUERY_KEYS.getByStudentId
      )
      return TuitionService.getByStudentId(params?.id || "")
    },
    enabled: false,
  })

  // Query để lấy danh sách học phí theo ID lớp học
  const getByClassIdQuery = useQuery<
    ISuccessResponse<ITuition[]> | IErrorResponse
  >({
    queryKey: TUITION_QUERY_KEYS.getByClassId,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        TUITION_QUERY_KEYS.getByClassId
      )
      return TuitionService.getByClassId(params?.id || "")
    },
    enabled: false,
  })

  // Mutation để tạo học phí cho học sinh
  const createForStudentMutation = useMutation<
    ISuccessResponse<ITuition> | IErrorResponse,
    Error,
    { data: Omit<ITuition, "id"> }
  >({
    mutationFn: ({ data }) => TuitionService.createForStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUITION_QUERY_KEYS.tuitions })
    },
  })

  // Mutation để cập nhật trạng thái học phí
  const changeStatusMutation = useMutation<
    ISuccessResponse<ITuition> | IErrorResponse,
    Error,
    { id: string; status: ETuitionStatus }
  >({
    mutationFn: ({ id, status }) => TuitionService.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUITION_QUERY_KEYS.tuitions })
    },
  })

  // Mutation để xóa học phí
  const deleteMutation = useMutation<
    ISuccessResponse<void> | IErrorResponse,
    Error,
    string
  >({
    mutationFn: (id: string) => TuitionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUITION_QUERY_KEYS.tuitions })
    },
  })

  return {
    getAllQuery,
    getByIdQuery,
    getByStudentIdQuery,
    getByClassIdQuery,
    createForStudentMutation,
    changeStatusMutation,
    deleteMutation,
    queryClient,
  }
}
