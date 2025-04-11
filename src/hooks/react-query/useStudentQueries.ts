import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { StudentService } from "@/services/student.service"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface"
import { IStudent } from "@/types/domain/student.interface"
import { STUDENT_QUERY_KEYS } from "../../constant/queryKey/studentQueryKey"
import { IGetRequest } from "@/types/api/request.interface"

export const useStudentQueries = () => {
  const queryClient = useQueryClient()

  // Query để lấy danh sách học sinh
  const getStudentsQuery = useQuery<
    ISuccessResponse<IStudent[]> | IErrorResponse
  >({
    queryKey: STUDENT_QUERY_KEYS.getStudents,
    queryFn: () => {
      const params = queryClient.getQueryData<IGetRequest>(
        STUDENT_QUERY_KEYS.getStudents
      )
      return StudentService.getStudents(params || {})
    },
    enabled: false,
  })

  // Query để tìm kiếm học sinh
  const searchStudentQuery = useQuery<
    ISuccessResponse<IStudent | null> | IErrorResponse
  >({
    queryKey: STUDENT_QUERY_KEYS.searchStudent,
    queryFn: () => {
      const params = queryClient.getQueryData<Record<string, any>>(
        STUDENT_QUERY_KEYS.searchStudent
      )
      if (!params) {
        return Promise.reject(new Error("Missing search parameters"))
      }
      return StudentService.searchStudent(
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
    mutationFn: (data: any) => StudentService.createOrUpdateStudent(data, true),
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
    mutationFn: (id: string) => StudentService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEYS.students })
    },
  })

  return {
    getStudentsQuery,
    searchStudentQuery,
    createOrUpdateMutation,
    deleteMutation,
    queryClient,
  }
}
