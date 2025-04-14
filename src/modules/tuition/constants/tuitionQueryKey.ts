import { QueryKey } from "@tanstack/react-query"

const BASE_KEY = ["tuitions"] as const

export const TUITION_QUERY_KEYS = {
  tuitions: BASE_KEY,
  getAll: [...BASE_KEY, "getAll"] as const,
  getById: [...BASE_KEY, "getById"] as const,
  getByStudentId: [...BASE_KEY, "getByStudentId"] as const,
  getByClassId: [...BASE_KEY, "getByClassId"] as const,
} as const

export type TuitionQueryKey = QueryKey
