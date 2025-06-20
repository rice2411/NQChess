import { QueryKey } from "@tanstack/react-query"

const BASE_KEY = ["students"] as const

export const STUDENT_QUERY_KEYS = {
  students: BASE_KEY,
  getAll: [...BASE_KEY, "getAll"] as const,
  getById: [...BASE_KEY, "getById"] as const,
  getByIds: [...BASE_KEY, "getByIds"] as const,
  absoluteSearch: [...BASE_KEY, "absoluteSearch"] as const,
} as const

export type StudentQueryKey = QueryKey
