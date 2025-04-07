"use client";

import { ClassService } from "@/services/class/class.service";
import ApiDocumentation from "@/components/api-documentation";
import {
  IEndpoint,
  IApiDocumentationProps,
} from "@/types/api/api.endpoints.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface";
import { IClass } from "@/types/domain/class/class.interface";
import { CLASS_ENDPOINTS } from "@/services/class/class.endpoint.sample";

export default function ClassesApiDocumentation() {
  const queryClient = useQueryClient();

  // Query để lấy danh sách lớp học
  const getClassesQuery = useQuery<ISuccessResponse<IClass[]> | IErrorResponse>(
    {
      queryKey: ["classes", "list"],
      queryFn: () => ClassService.getClasses(true),
      enabled: false, // Chỉ thực hiện khi được gọi
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
        if (!id) {
          return Promise.reject(new Error("Missing class ID"));
        }
        return ClassService.getClassById(id, true);
      },
      enabled: false, // Chỉ thực hiện khi được gọi
    }
  );

  // Mutation để tạo/cập nhật lớp học
  const createOrUpdateMutation = useMutation<
    ISuccessResponse<IClass> | IErrorResponse,
    Error,
    any
  >({
    mutationFn: (data: any) => ClassService.createOrUpdateClass(data, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  // Mutation để cập nhật lớp học
  const updateClassMutation = useMutation<
    ISuccessResponse<IClass> | IErrorResponse,
    Error,
    { id: string; data: Partial<IClass> }
  >({
    mutationFn: ({ id, data }) => ClassService.updateClass(id, data, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  // Mutation để xóa lớp học
  const deleteMutation = useMutation<
    ISuccessResponse<null> | IErrorResponse,
    Error,
    string
  >({
    mutationFn: (id: string) => ClassService.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  // Mutation để thêm/xóa học sinh khỏi lớp học
  const updateClassStudentsMutation = useMutation<
    ISuccessResponse<IClass> | IErrorResponse,
    Error,
    { classId: string; studentId: string; isAdd: boolean }
  >({
    mutationFn: ({ classId, studentId, isAdd }) =>
      ClassService.updateClassStudents(classId, studentId, isAdd, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  const handleExecute = async (
    endpoint: IEndpoint,
    params: Record<string, any>
  ): Promise<ISuccessResponse<any> | IErrorResponse> => {
    try {
      switch (endpoint.service) {
        case "getClasses":
          const getClassesResult = await getClassesQuery.refetch();
          return (
            getClassesResult.data || {
              success: false,
              errorCode: "API_ERROR",
              message: "Failed to fetch classes",
            }
          );
        case "getClassById":
          queryClient.setQueryData(["classes", "detail", "id"], params.id);
          const getClassResult = await getClassByIdQuery.refetch();
          return (
            getClassResult.data || {
              success: false,
              errorCode: "API_ERROR",
              message: "Failed to fetch class",
            }
          );
        case "createOrUpdateClass":
          return await createOrUpdateMutation.mutateAsync(params);
        case "updateClass":
          return await updateClassMutation.mutateAsync({
            id: params.id,
            data: params.data,
          });
        case "deleteClass":
          return await deleteMutation.mutateAsync(params.id);
        case "updateClassStudents":
          return await updateClassStudentsMutation.mutateAsync({
            classId: params.classId,
            studentId: params.studentId,
            isAdd: params.isAdd,
          });
        default:
          return {
            success: false,
            errorCode: "INVALID_ENDPOINT",
            message: "Invalid endpoint",
          };
      }
    } catch (error) {
      return {
        success: false,
        errorCode: "API_ERROR",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  const props: IApiDocumentationProps = {
    title: "Classes API",
    endpoints: CLASS_ENDPOINTS,
    service: ClassService,
    onExecute: handleExecute,
  };

  return <ApiDocumentation {...props} />;
}
