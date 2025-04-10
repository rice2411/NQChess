"use client"

import { IApiDocumentationProps } from "@/types/api/api.endpoints.interface"

import { TUITION_ENDPOINTS } from "@/services/tuition/tuition.endpoint.sample"
import { useTuitionQueries } from "@/hooks/react-query/tuition/useTuitionQueries"
import { TuitionService } from "@/services/tuition/tuition.service"
import { useApiDocumentation } from "@/hooks/useApiDocumentation"
import ApiDocumentation from "@/components/features/api-documentation"
import { TUITION_QUERY_KEYS } from "@/hooks/react-query/tuition/tuition-query-key"

export default function TuitionsApiDocumentation() {
  const {
    getTuitionsQuery,
    getTuitionByIdQuery,
    getTuitionsByStudentIdQuery,
    getTuitionsByClassIdQuery,
    createTuitionForStudentMutation,
    updateTuitionMutation,
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
    updateTuition: updateTuitionMutation,
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
