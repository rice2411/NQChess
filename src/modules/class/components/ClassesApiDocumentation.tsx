"use client"

import { ClassService } from "@/modules/class/services/class.service"
import { IApiDocumentationProps } from "@/modules/documentation/api/interface/apiEndpoint.interface"
import ApiDocumentation from "@/modules/documentation/api/components"
import { useClassQueries } from "@/modules/class/hooks/useClassQueries"
import { CLASS_ENDPOINTS } from "@/modules/class/constants/classEndpointData"
import { CLASS_QUERY_KEYS } from "../constants/classQueryKey"
import { useApiDocumentation } from "@/modules/documentation/api/hooks/useApiDocumentation"
export default function ClassesApiDocumentation() {
  const {
    getAllQuery,
    getByIdQuery,
    createOrUpdateMutation,
    addStudentsToClassMutation,
    deleteMutation,
  } = useClassQueries()

  const { handleExecute } = useApiDocumentation()

  const queries = {
    getAll: getAllQuery,
    getById: getByIdQuery,
  }

  const mutations = {
    createOrUpdate: createOrUpdateMutation,
    addStudentsToClass: addStudentsToClassMutation,
    delete: deleteMutation,
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
