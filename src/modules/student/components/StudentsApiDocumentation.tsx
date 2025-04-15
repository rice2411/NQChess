"use client"

import { IApiDocumentationProps } from "@/modules/documentation/api/interface/apiEndpoint.interface"

import { STUDENT_ENDPOINTS } from "@/modules/student/constants/studentEndPointData"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import { StudentService } from "@/modules/student/services/student.service"
import ApiDocumentation from "@/modules/documentation/api/components"
import { STUDENT_QUERY_KEYS } from "@/modules/student/constants/studentQueryKey"
import { useApiDocumentation } from "@/modules/documentation/api/hooks/useApiDocumentation"

export default function StudentsApiDocumentation() {
  const {
    getAllQuery,
    getByIdQuery,
    createOrUpdateMutation,
    deleteMutation,
    absoluteSearchQuery,
  } = useStudentQueries()

  const { handleExecute } = useApiDocumentation()

  const queries = {
    getAll: getAllQuery,
    getById: getByIdQuery,
    absoluteSearch: absoluteSearchQuery,
  }

  const mutations = {
    createOrUpdate: createOrUpdateMutation,
    delete: deleteMutation,
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
