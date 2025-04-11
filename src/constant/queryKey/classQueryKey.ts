import { QueryKey } from "@tanstack/react-query"

const BASE_KEY = ["classes"] as const

export const CLASS_QUERY_KEYS = {
  classes: BASE_KEY,
  getClasses: [...BASE_KEY, "list", "isBeautifyDate"] as const,
  getClassById: [...BASE_KEY, "detail", "id"] as const,
} as const

export type ClassQueryKey = QueryKey
