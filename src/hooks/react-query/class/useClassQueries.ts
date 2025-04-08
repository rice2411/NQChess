import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClassService } from "@/services/class/class.service";
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface";
import { IClass } from "@/types/domain/class/class.interface";

export const useClassQueries = () => {
  const queryClient = useQueryClient();

  // Query để lấy danh sách lớp học
  const getClassesQuery = useQuery<ISuccessResponse<IClass[]> | IErrorResponse>(
    {
      queryKey: ["classes", "list"],
      queryFn: () => {
        const isBeutifyDate =
          queryClient.getQueryData<boolean>([
            "classes",
            "list",
            "isBeutifyDate",
          ]) ?? false;
        return ClassService.getClasses(isBeutifyDate);
      },
      enabled: false,
    }
  );

  // Query để lấy thông tin lớp học theo ID
  const getClassByIdQuery = useQuery<ISuccessResponse<IClass> | IErrorResponse>(
    {
      queryKey: ["classes", "detail"],
      queryFn: () => {
        const id = queryClient.getQueryData<string>([
          "classes",
          "detail",
          "id",
        ]);
        const isBeutifyDate =
          queryClient.getQueryData<boolean>([
            "classes",
            "detail",
            "isBeutifyDate",
          ]) ?? false;
        if (!id) {
          return Promise.reject(new Error("Missing class ID"));
        }
        return ClassService.getClassById(id, isBeutifyDate);
      },
      enabled: false,
    }
  );

  // Mutation để tạo lớp học
  const createMutation = useMutation<
    ISuccessResponse<IClass> | IErrorResponse,
    Error,
    { data: Omit<IClass, "id">; isBeutifyDate: boolean }
  >({
    mutationFn: ({ data, isBeutifyDate }) =>
      ClassService.createClass(data, isBeutifyDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  // Mutation để thêm học sinh vào lớp
  const addStudentsMutation = useMutation<
    ISuccessResponse<IClass> | IErrorResponse,
    Error,
    { classId: string; studentIds: string[] }
  >({
    mutationFn: ({ classId, studentIds }) =>
      ClassService.addStudentsToClass(classId, studentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  // Mutation để xóa lớp học
  const deleteMutation = useMutation<
    ISuccessResponse<void> | IErrorResponse,
    Error,
    string
  >({
    mutationFn: (id: string) => ClassService.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  return {
    getClassesQuery,
    getClassByIdQuery,
    createMutation,
    addStudentsMutation,
    deleteMutation,
    queryClient,
  };
};
