"use client";

<<<<<<< Updated upstream
import ApiDocumentation from "@/components/api-documentation";
import { IApiDocumentationProps } from "@/types/api/api.endpoints.interface";

=======
import { StudentService } from "@/services/student/student.service";
import ApiDocumentation from "@/components/features/api-documentation";
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
>>>>>>> Stashed changes
import { STUDENT_ENDPOINTS } from "@/services/student/student.endpoint.sample";
import { useStudentQueries } from "@/hooks/react-query/student/useStudentQueries";
import { StudentService } from "@/services/student/student.service";
import { useApiDocumentation } from "@/hooks/useApiDocumentation";

export default function StudentsApiDocumentation() {
  const {
    getStudentsQuery,
    searchStudentQuery,
    createOrUpdateMutation,
    deleteMutation,
  } = useStudentQueries();

  const { handleExecute } = useApiDocumentation();

  const queries = {
    getStudents: getStudentsQuery,
    searchStudent: searchStudentQuery,
  };

  const mutations = {
    createOrUpdateStudent: createOrUpdateMutation,
    deleteStudent: deleteMutation,
  };

  const props: IApiDocumentationProps = {
    title: "Students API",
    endpoints: STUDENT_ENDPOINTS,
    service: StudentService,
    onExecute: (endpoint, params) =>
      handleExecute(
        endpoint,
        params,
        queries,
        mutations,
        //@ts-expect-error - endpoint.service is dynamically typed and STUDENT_QUERY_KEYS is readonly
        STUDENT_QUERY_KEYS[`${endpoint.service}`] || []
      ),
  };

  return <ApiDocumentation {...props} />;
}
