"use client"

import { CLASS_ENDPOINTS } from "@/constants/endpoint/classEndpointData"
import { ClassService } from "@/services/class.service"
import { useClassQueries } from "@/hooks/react-query/useClassQueries"
import { IApiDocumentationProps } from "@/types/api/apiEndpoint.interface"
import { useApiDocumentation } from "@/hooks/useApiDocumentation"
import { CLASS_QUERY_KEYS } from "@/constants/queryKey/classQueryKey"
import ApiDocumentation from "@/components/features/apiDocumentation"
export default function ClassApiDocumentation() {
  const {
    getClassesQuery,
    getClassByIdQuery,
    createMutation,
    addStudentsMutation,
    deleteMutation,
  } = useClassQueries()

  const { handleExecute } = useApiDocumentation()

  const queries = {
    getClasses: getClassesQuery,
    getClassById: getClassByIdQuery,
  }

  const mutations = {
    createClass: createMutation,
    addStudentsToClass: addStudentsMutation,
    deleteClass: deleteMutation,
  }

  const props: IApiDocumentationProps = {
    title: "Class API",
    endpoints: CLASS_ENDPOINTS,
    service: ClassService,
    onExecute: (endpoint, params) =>
      handleExecute(
        endpoint,
        params,
        queries,
        mutations,
        //@ts-expect-error - endpoint.service is dynamically typed and CLASS_QUERY_KEYS is readonly
        CLASS_QUERY_KEYS[`${endpoint.service}`] || []
      ),
  }

  return <ApiDocumentation {...props} />
}
