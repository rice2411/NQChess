"use client"

import { IApiDocumentationProps } from "@/modules/documentation/api/interface/apiEndpoint.interface"

import { TUITION_ENDPOINTS } from "@/modules/tuition/constants/tuitionEndPointData"
import { useTuitionQueries } from "@/modules/tuition/hooks/useTuitionQueries"
import { TuitionService } from "@/modules/tuition/services/tuition.service"
import ApiDocumentation from "@/modules/documentation/api/components"
import { TUITION_QUERY_KEYS } from "@/modules/tuition/constants/tuitionQueryKey"
import { useApiDocumentation } from "@/modules/documentation/api/hooks/useApiDocumentation"

export default function TuitionsApiDocumentation() {
  const {
    getAllQuery,
    getByIdQuery,
    getByStudentIdQuery,
    getByClassIdQuery,
    createForStudentMutation,
    changeStatusMutation,
    deleteMutation,
  } = useTuitionQueries()

  const { handleExecute } = useApiDocumentation()

  const queries = {
    getAll: getAllQuery,
    getById: getByIdQuery,
    getByStudentId: getByStudentIdQuery,
    getByClassId: getByClassIdQuery,
  }

  const mutations = {
    createForStudent: createForStudentMutation,
    changeStatus: changeStatusMutation,
    delete: deleteMutation,
  }

  const props: IApiDocumentationProps = {
    title: "Tuitions API",
    endpoints: TUITION_ENDPOINTS,
    service: TuitionService,
    onExecute: (endpoint, params) =>
      handleExecute(
        endpoint,
        params,
        queries,
        mutations,
        //@ts-expect-error - endpoint.service is dynamically typed and TUITION_QUERY_KEYS is readonly
        TUITION_QUERY_KEYS[`${endpoint.service}`] || []
      ),
  }

  return <ApiDocumentation {...props} />
}
