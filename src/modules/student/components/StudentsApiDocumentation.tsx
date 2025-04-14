"use client"

import { IApiDocumentationProps } from "@/modules/documentation/api/interface/apiEndpoint.interface"

import { STUDENT_ENDPOINTS } from "@/modules/student/constants/studentEndPointData"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import { StudentService } from "@/modules/student/services/student.service"
import { useApiDocumentation } from "@/modules/shared/hooks/useApiDocumentation"
import ApiDocumentation from "@/modules/documentation/api/components"
import { STUDENT_QUERY_KEYS } from "@/modules/student/constants/studentQueryKey"

export default function StudentsApiDocumentation() {
  const { getAllQuery, getByIdQuery, createOrUpdateMutation, deleteMutation } =
    useStudentQueries()

  const { handleExecute } = useApiDocumentation()

  const queries = {
    getAll: getAllQuery,
    getById: getByIdQuery,
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
