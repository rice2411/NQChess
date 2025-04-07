"use client";

import { StudentService } from "@/services/student/student.service";
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
import { IStudent } from "@/types/domain/student/student.interface";
import { STUDENT_ENDPOINTS } from "@/services/student/student.endpoint";

export default function StudentsApiDocumentation() {
  const queryClient = useQueryClient();

  // Query để lấy danh sách học sinh
  const getStudentsQuery = useQuery<
    ISuccessResponse<IStudent[]> | IErrorResponse
  >({
    queryKey: ["students", "list"],
    queryFn: () => StudentService.getStudents(true),
    enabled: false, // Chỉ thực hiện khi được gọi
  });

  // Query để tìm kiếm học sinh
  const searchStudentQuery = useQuery<
    ISuccessResponse<IStudent | null> | IErrorResponse
  >({
    queryKey: ["students", "search"],
    queryFn: () => {
      const params = queryClient.getQueryData<Record<string, any>>([
        "students",
        "search",
        "params",
      ]);
      if (!params) {
        return Promise.reject(new Error("Missing search parameters"));
      }
      return StudentService.searchStudent(
        params.fullName,
        params.dateOfBirth,
        params.phoneNumber,
        params.isBeutifyDate
      );
    },
    enabled: false, // Chỉ thực hiện khi được gọi
  });

  // Mutation để tạo/cập nhật học sinh
  const createOrUpdateMutation = useMutation<
    ISuccessResponse<IStudent> | IErrorResponse,
    Error,
    any
  >({
    mutationFn: (data: any) => StudentService.createOrUpdateStudent(data, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  // Mutation để xóa học sinh
  const deleteMutation = useMutation<
    ISuccessResponse<void> | IErrorResponse,
    Error,
    string
  >({
    mutationFn: (id: string) => StudentService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const handleExecute = async (
    endpoint: IEndpoint,
    params: Record<string, any>
  ): Promise<ISuccessResponse<any> | IErrorResponse> => {
    try {
      switch (endpoint.service) {
        case "getStudents":
          const getStudentsResult = await getStudentsQuery.refetch();
          return (
            getStudentsResult.data || {
              success: false,
              errorCode: "API_ERROR",
              message: "Failed to fetch students",
            }
          );
        case "createOrUpdateStudent":
          return await createOrUpdateMutation.mutateAsync(params);
        case "searchStudent":
          queryClient.setQueryData(["students", "search", "params"], params);
          const searchResult = await searchStudentQuery.refetch();
          return (
            searchResult.data || {
              success: false,
              errorCode: "API_ERROR",
              message: "Failed to search students",
            }
          );
        case "deleteStudent":
          return await deleteMutation.mutateAsync(params.id);
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
    title: "Students API",
    endpoints: STUDENT_ENDPOINTS,
    service: StudentService,
    onExecute: handleExecute,
  };

  return <ApiDocumentation {...props} />;
}
