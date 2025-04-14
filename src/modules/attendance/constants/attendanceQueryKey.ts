import { QueryKey } from "@tanstack/react-query"

const BASE_KEY = ["attendances"] as const

export const ATTENDANCE_QUERY_KEYS = {
  attendances: [...BASE_KEY],
  getAll: [...BASE_KEY, "getAll"],
  getById: [...BASE_KEY, "getById"],
  getByLessonId: [...BASE_KEY, "getByLessonId"],
  getByStudentId: [...BASE_KEY, "getByStudentId"],
} as const

export type AttendanceQueryKey = QueryKey
