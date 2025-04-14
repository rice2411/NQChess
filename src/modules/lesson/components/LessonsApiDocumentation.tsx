"use client"

import { IApiDocumentationProps } from "@/modules/documentation/api/interface/apiEndpoint.interface"
import { LESSON_ENDPOINTS } from "@/modules/lesson/constants/lessonEndpointData"
import { useLessonQueries } from "@/modules/lesson/hooks/useLessonQueries"
import { LessonService } from "@/modules/lesson/services/lesson.service"
import { useApiDocumentation } from "@/modules/shared/hooks/useApiDocumentation"
import ApiDocumentation from "@/modules/documentation/api/components"
import { LESSON_QUERY_KEYS } from "@/modules/lesson/constants/lessonQueryKey"

export default function LessonsApiDocumentation() {
  const {
    getAllQuery,
    getByIdQuery,
    getByClassIdQuery,
    createOrUpdateMutation,
    deleteMutation,
    changeStatusMutation,
  } = useLessonQueries()

  const { handleExecute } = useApiDocumentation()

  const queries = {
    getAll: getAllQuery,
    getById: getByIdQuery,
    getByClassId: getByClassIdQuery,
  }

  const mutations = {
    createOrUpdateLesson: createOrUpdateMutation,
    deleteLesson: deleteMutation,
    changeStatusLesson: changeStatusMutation,
  }

  const props: IApiDocumentationProps = {
    title: "Lessons API",
    endpoints: LESSON_ENDPOINTS,
    service: LessonService,
    onExecute: (endpoint, params) =>
      handleExecute(
        endpoint,
        params,
        queries,
        mutations,
        //@ts-expect-error - endpoint.service is dynamically typed and LESSON_QUERY_KEYS is readonly
        LESSON_QUERY_KEYS[`${endpoint.service}`] || []
      ),
  }

  return <ApiDocumentation {...props} />
}
