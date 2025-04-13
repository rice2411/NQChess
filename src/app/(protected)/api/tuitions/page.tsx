"use client"

import { IApiDocumentationProps } from "@/types/api/apiEndpoint.interface"

import { TUITION_ENDPOINTS } from "@/constants/endpoint/tuitionEndPointData"
import { useTuitionQueries } from "@/hooks/react-query/useTuitionQueries"
import { TuitionService } from "@/services/tuition.service"
import { useApiDocumentation } from "@/hooks/useApiDocumentation"
import ApiDocumentation from "@/components/features/apiDocumentation"
import { TUITION_QUERY_KEYS } from "@/constants/queryKey/tuitionQueryKey"

export default function TuitionsApiDocumentation() {
  const {
    getTuitionsQuery,
    getTuitionByIdQuery,
    getTuitionsByStudentIdQuery,
    getTuitionsByClassIdQuery,
    createTuitionForStudentMutation,
    changeStatusTuitionMutation,
    deleteTuitionMutation,
  } = useTuitionQueries()

  const { handleExecute } = useApiDocumentation()

  const queries = {
    getTuitions: getTuitionsQuery,
    getTuitionById: getTuitionByIdQuery,
    getTuitionsByStudentId: getTuitionsByStudentIdQuery,
    getTuitionsByClassId: getTuitionsByClassIdQuery,
  }

  const mutations = {
    createTuitionForStudent: createTuitionForStudentMutation,
    changeStatusTuition: changeStatusTuitionMutation,
    deleteTuition: deleteTuitionMutation,
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
