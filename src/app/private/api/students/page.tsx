"use client"

import { IApiDocumentationProps } from "@/types/api/apiEndpoint.interface"

import { STUDENT_ENDPOINTS } from "@/constant/endpoint/studentEndPointData"
import { useStudentQueries } from "@/hooks/react-query/useStudentQueries"
import { StudentService } from "@/services/student.service"
import { useApiDocumentation } from "@/hooks/useApiDocumentation"
import ApiDocumentation from "@/components/features/apiDocumentation"
import { STUDENT_QUERY_KEYS } from "@/constant/queryKey/studentQueryKey"

export default function StudentsApiDocumentation() {
  const {
    getStudentsQuery,
    searchStudentQuery,
    createOrUpdateMutation,
    deleteMutation,
  } = useStudentQueries()

  const { handleExecute } = useApiDocumentation()

  const queries = {
    getStudents: getStudentsQuery,
    searchStudent: searchStudentQuery,
  }

  const mutations = {
    createOrUpdateStudent: createOrUpdateMutation,
    deleteStudent: deleteMutation,
  }

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
  }

  return <ApiDocumentation {...props} />
}
