"use client"

import { IApiDocumentationProps } from "@/modules/documentation/api/interface/apiEndpoint.interface"
import { ATTENDANCE_ENDPOINTS } from "@/modules/attendance/constants/attendanceEndpointData"
import { useAttendanceQueries } from "@/modules/attendance/hooks/useAttendanceQueries"
import { AttendanceService } from "@/modules/attendance/services/attendance.service"
import ApiDocumentation from "@/modules/documentation/api/components"
import { ATTENDANCE_QUERY_KEYS } from "@/modules/attendance/constants/attendanceQueryKey"
import { useApiDocumentation } from "@/modules/documentation/api/hooks/useApiDocumentation"

export default function AttendancesApiDocumentation() {
  const {
    getAllQuery,
    getByIdQuery,
    getByLessonIdQuery,
    getByStudentIdQuery,
    createOrUpdateMutation,
    deleteMutation,
    changeStatusMutation,
  } = useAttendanceQueries()

  const { handleExecute } = useApiDocumentation()

  const queries = {
    getAll: getAllQuery,
    getById: getByIdQuery,
    getByLessonId: getByLessonIdQuery,
    getByStudentId: getByStudentIdQuery,
  }

  const mutations = {
    createOrUpdateAttendance: createOrUpdateMutation,
    deleteAttendance: deleteMutation,
    changeStatusAttendance: changeStatusMutation,
  }

  const props: IApiDocumentationProps = {
    title: "Attendances API",
    endpoints: ATTENDANCE_ENDPOINTS,
    service: AttendanceService,
    onExecute: (endpoint, params) =>
      handleExecute(
        endpoint,
        params,
        queries,
        mutations,
        //@ts-expect-error - endpoint.service is dynamically typed and ATTENDANCE_QUERY_KEYS is readonly
        ATTENDANCE_QUERY_KEYS[`${endpoint.service}`] || []
      ),
  }

  return <ApiDocumentation {...props} />
}
