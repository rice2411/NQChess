import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { LessonService } from "@/modules/lesson/services/lesson.service"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/core/types/api/response.interface"
import { ILesson } from "@/modules/lesson/interfaces/lesson.interface"
import { LESSON_QUERY_KEYS } from "@/modules/lesson/constants/lessonQueryKey"
import { IGetRequest } from "@/core/types/api/request.interface"
import { ELessonStatus } from "@/modules/lesson/enums/lesson.enum"

export const useLessonQueries = () => {
  const queryClient = useQueryClient()

  // Query để lấy danh sách buổi học
  const getAllQuery = useQuery<ISuccessResponse<ILesson[]> | IErrorResponse>({
    queryKey: LESSON_QUERY_KEYS.getAll,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        LESSON_QUERY_KEYS.getAll
      )
      return LessonService.getLessons(params || {})
    },
    enabled: false,
  })

  // Query để lấy buổi học theo ID
  const getByIdQuery = useQuery<ISuccessResponse<ILesson> | IErrorResponse>({
    queryKey: LESSON_QUERY_KEYS.getById,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        LESSON_QUERY_KEYS.getById
      )
      return LessonService.getLessonById(
        params?.id || "",
        params?.isBeautifyDate
      )
    },
    enabled: false,
  })

  // Query để lấy danh sách buổi học theo lớp
  const getByClassIdQuery = useQuery<
    ISuccessResponse<ILesson[]> | IErrorResponse
  >({
    queryKey: LESSON_QUERY_KEYS.getByClassId,
    queryFn: () => {
      const params = queryClient.getQueryData<{ classId: string }>(
        LESSON_QUERY_KEYS.getByClassId
      )
      if (!params?.classId) {
        return Promise.reject(new Error("Missing classId parameter"))
      }
      return LessonService.getLessonsByClassId(params.classId)
    },
    enabled: false,
  })

  // Mutation để tạo/cập nhật buổi học
  const createOrUpdateMutation = useMutation<
    ISuccessResponse<ILesson> | IErrorResponse,
    Error,
    Omit<ILesson, "id">
  >({
    mutationFn: (data: Omit<ILesson, "id">) =>
      LessonService.createOrUpdateLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.lessons })
    },
  })

  // Mutation để xóa buổi học
  const deleteMutation = useMutation<
    ISuccessResponse<null> | IErrorResponse,
    Error,
    string
  >({
    mutationFn: (id: string) => LessonService.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.lessons })
    },
  })

  // Mutation để thay đổi trạng thái buổi học
  const changeStatusMutation = useMutation<
    ISuccessResponse<ILesson> | IErrorResponse,
    Error,
    { id: string; status: ELessonStatus }
  >({
    mutationFn: ({ id, status }) =>
      LessonService.changeStatusLesson(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.lessons })
    },
  })

  return {
    getAllQuery,
    getByIdQuery,
    getByClassIdQuery,
    createOrUpdateMutation,
    deleteMutation,
    changeStatusMutation,
    queryClient,
  }
}
