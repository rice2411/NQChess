import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { TuitionService } from "@/services/tuition/tuition.service"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface"
import { ITuition } from "@/types/domain/tuition/tuition.interface"
import { TUITION_QUERY_KEYS } from "./tuition-query-key"
import { ETuitionStatus } from "@/types/domain/tuition/tuition.enum"

export const useTuitionQueries = () => {
  const queryClient = useQueryClient()

  // Query để lấy danh sách học phí
  const getTuitionsQuery = useQuery<
    ISuccessResponse<ITuition[]> | IErrorResponse
  >({
    queryKey: TUITION_QUERY_KEYS.getTuitions,
    queryFn: () => {
      const isBeautifyDate = queryClient.getQueryData<boolean>(
        TUITION_QUERY_KEYS.getTuitions
      )
      return TuitionService.getTuitions(isBeautifyDate)
    },
    enabled: false,
  })

  // Query để lấy thông tin học phí theo ID
  const getTuitionByIdQuery = useQuery<
    ISuccessResponse<ITuition> | IErrorResponse
  >({
    queryKey: TUITION_QUERY_KEYS.getTuitionById,
    queryFn: () => {
      const [id, isBeautifyDate] = queryClient.getQueryData<[string, boolean]>(
        TUITION_QUERY_KEYS.getTuitionById
      ) || ["", true]
      return TuitionService.getTuitionById(id, isBeautifyDate)
    },
    enabled: false,
  })

  // Query để lấy danh sách học phí theo ID học sinh
  const getTuitionsByStudentIdQuery = useQuery<
    ISuccessResponse<ITuition[]> | IErrorResponse
  >({
    queryKey: TUITION_QUERY_KEYS.getTuitionsByStudentId,
    queryFn: () => {
      const [studentId, isBeautifyDate] = queryClient.getQueryData<
        [string, boolean]
      >(TUITION_QUERY_KEYS.getTuitionsByStudentId) || ["", true]
      return TuitionService.getTuitionsByStudentId(studentId, isBeautifyDate)
    },
    enabled: false,
  })

  // Query để lấy danh sách học phí theo ID lớp học
  const getTuitionsByClassIdQuery = useQuery<
    ISuccessResponse<ITuition[]> | IErrorResponse
  >({
    queryKey: TUITION_QUERY_KEYS.getTuitionsByClassId,
    queryFn: () => {
      const [classId, isBeautifyDate] = queryClient.getQueryData<
        [string, boolean]
      >(TUITION_QUERY_KEYS.getTuitionsByClassId) || ["", true]
      return TuitionService.getTuitionsByClassId(classId, isBeautifyDate)
    },
    enabled: false,
  })

  // Mutation để tạo học phí cho học sinh
  const createTuitionForStudentMutation = useMutation<
    ISuccessResponse<ITuition> | IErrorResponse,
    Error,
    any
  >({
    mutationFn: (data: any) =>
      TuitionService.createTuitionForStudent(data, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUITION_QUERY_KEYS.tuitions })
    },
  })

  // Mutation để cập nhật trạng thái học phí
  const updateTuitionMutation = useMutation<
    ISuccessResponse<ITuition> | IErrorResponse,
    Error,
    { id: string; status: ETuitionStatus }
  >({
    mutationFn: ({ id, status }) =>
      TuitionService.updateTuition(id, status, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUITION_QUERY_KEYS.tuitions })
    },
  })

  // Mutation để xóa học phí
  const deleteTuitionMutation = useMutation<
    ISuccessResponse<void> | IErrorResponse,
    Error,
    string
  >({
    mutationFn: (id: string) => TuitionService.deleteTuition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUITION_QUERY_KEYS.tuitions })
    },
  })

  return {
    getTuitionsQuery,
    getTuitionByIdQuery,
    getTuitionsByStudentIdQuery,
    getTuitionsByClassIdQuery,
    createTuitionForStudentMutation,
    updateTuitionMutation,
    deleteTuitionMutation,
    queryClient,
  }
}
