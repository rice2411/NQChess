import { QueryKey } from "@tanstack/react-query"

const BASE_KEY = ["students"] as const

export const STUDENT_QUERY_KEYS = {
  students: BASE_KEY,
  getStudents: [...BASE_KEY, "list", "isBeautifyDate"] as const,
  searchStudent: [...BASE_KEY, "search", "params"] as const,
  createOrUpdateStudent: [...BASE_KEY, "createOrUpdate", "id"] as const,
  deleteStudent: [...BASE_KEY, "delete", "id"] as const,
} as const

export type StudentQueryKey = QueryKey
