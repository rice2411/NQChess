import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ClassService } from "@/services/class.service"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface"
import { IClass } from "@/types/domain/class.interface"
import { CLASS_QUERY_KEYS } from "../../constant/queryKey/classQueryKey"
import { IGetRequest } from "@/types/api/request.interface"

export const useClassQueries = () => {
  const queryClient = useQueryClient()

  // Query để lấy danh sách lớp học
  const getClassesQuery = useQuery<ISuccessResponse<IClass[]> | IErrorResponse>(
    {
      queryKey: CLASS_QUERY_KEYS.getClasses,
      queryFn: () => {
        const params = queryClient.getQueryData<IGetRequest>(
          CLASS_QUERY_KEYS.getClasses
        )
        return ClassService.getClasses(params || {})
      },
      enabled: false,
    }
  )

  // Query để lấy thông tin lớp học theo ID
  const getClassByIdQuery = useQuery<ISuccessResponse<IClass> | IErrorResponse>(
    {
      queryKey: CLASS_QUERY_KEYS.getClassById,
      queryFn: () => {
        const id = queryClient.getQueryData<string>(
          CLASS_QUERY_KEYS.getClassById
        )
        const isBeautifyDate =
          queryClient.getQueryData<boolean>([
            ...CLASS_QUERY_KEYS.getClassById,
            "isBeautifyDate",
          ]) ?? false
        if (!id) {
          return Promise.reject(new Error("Missing class ID"))
        }
        return ClassService.getClassById(id, isBeautifyDate)
      },
      enabled: false,
    }
  )

  // Mutation để tạo lớp học
  const createMutation = useMutation<
    ISuccessResponse<IClass> | IErrorResponse,
    Error,
    { data: Omit<IClass, "id">; isBeautifyDate: boolean }
  >({
    mutationFn: ({ data, isBeautifyDate }) =>
      ClassService.createClass(data, isBeautifyDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.classes })
    },
  })

  // Mutation để thêm học sinh vào lớp
  const addStudentsMutation = useMutation<
    ISuccessResponse<IClass> | IErrorResponse,
    Error,
    { classId: string; studentIds: string[] }
  >({
    mutationFn: ({ classId, studentIds }) => {
      console.log(classId)
      return ClassService.addStudentsToClass(classId, studentIds)
    },
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
    mutationFn: (id: string) => ClassService.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.classes })
    },
  })

  return {
    getClassesQuery,
    getClassByIdQuery,
    createMutation,
    addStudentsMutation,
    deleteMutation,
    queryClient,
  }
}
