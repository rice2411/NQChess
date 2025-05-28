import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AttendanceService } from "@/modules/attendance/services/attendance.service"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/core/types/api/response.interface"
import { IAttendance } from "@/modules/attendance/interfaces/attendance.interface"
import { ATTENDANCE_QUERY_KEYS } from "@/modules/attendance/constants/attendanceQueryKey"
import { IGetRequest } from "@/core/types/api/request.interface"
import { EAttendanceStatus } from "@/modules/attendance/enum/attendance.enum"

export const useAttendanceQueries = () => {
  const queryClient = useQueryClient()

  // Query để lấy danh sách điểm danh
  const getAllQuery = useQuery<
    ISuccessResponse<IAttendance[]> | IErrorResponse
  >({
    queryKey: ATTENDANCE_QUERY_KEYS.getAll,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        ATTENDANCE_QUERY_KEYS.getAll
      )
      return AttendanceService.getAttendances(params || {})
    },
    enabled: false,
  })

  // Query để lấy điểm danh theo ID
  const getByIdQuery = useQuery<ISuccessResponse<IAttendance> | IErrorResponse>(
    {
      queryKey: ATTENDANCE_QUERY_KEYS.getById,
      queryFn: () => {
        const params = queryClient.getQueryData<IGetRequest>(
          ATTENDANCE_QUERY_KEYS.getById
        )
        return AttendanceService.getAttendanceById(
          params?.id || "",
          params?.isBeautifyDate
        )
      },
      enabled: false,
    }
  )

  // Query để lấy danh sách điểm danh theo buổi học
  const getByLessonIdQuery = useQuery<
    ISuccessResponse<IAttendance[]> | IErrorResponse
  >({
    queryKey: ATTENDANCE_QUERY_KEYS.getByLessonId,
    queryFn: () => {
      const params = queryClient.getQueryData<{ lessonId: string }>(
        ATTENDANCE_QUERY_KEYS.getByLessonId
      )
      if (!params?.lessonId) {
        return Promise.reject(new Error("Missing lessonId parameter"))
      }
      return AttendanceService.getAttendancesByLessonId(params.lessonId)
    },
    enabled: false,
  })

  // Query để lấy danh sách điểm danh theo học sinh
  const getByStudentIdQuery = useQuery<
    ISuccessResponse<IAttendance[]> | IErrorResponse
  >({
    queryKey: ATTENDANCE_QUERY_KEYS.getByStudentId,
    queryFn: () => {
      const params = queryClient.getQueryData<{ studentId: string }>(
        ATTENDANCE_QUERY_KEYS.getByStudentId
      )
      if (!params?.studentId) {
        return Promise.reject(new Error("Missing studentId parameter"))
      }
      return AttendanceService.getAttendancesByStudentId(params.studentId)
    },
    enabled: false,
  })

  // Mutation để tạo/cập nhật điểm danh
  const createOrUpdateMutation = useMutation<
    ISuccessResponse<IAttendance> | IErrorResponse,
    Error,
    Omit<IAttendance, "id">
  >({
    mutationFn: (data: Omit<IAttendance, "id">) =>
      AttendanceService.createOrUpdateAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ATTENDANCE_QUERY_KEYS.attendances,
      })
    },
  })

  // Mutation để xóa điểm danh
  const deleteMutation = useMutation<
    ISuccessResponse<null> | IErrorResponse,
    Error,
    string
  >({
    mutationFn: (id: string) => AttendanceService.deleteAttendance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ATTENDANCE_QUERY_KEYS.attendances,
      })
    },
  })

  // Mutation để thay đổi trạng thái điểm danh
  const changeStatusMutation = useMutation<
    ISuccessResponse<IAttendance> | IErrorResponse,
    Error,
    { id: string; status: EAttendanceStatus; note?: string }
  >({
    mutationFn: ({ id, status, note }) =>
      AttendanceService.changeStatusAttendance(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ATTENDANCE_QUERY_KEYS.attendances,
      })
    },
  })

  return {
    getAllQuery,
    getByIdQuery,
    getByLessonIdQuery,
    getByStudentIdQuery,
    createOrUpdateMutation,
    deleteMutation,
    changeStatusMutation,
    queryClient,
  }
}
