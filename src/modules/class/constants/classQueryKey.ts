import { QueryKey } from "@tanstack/react-query"

const BASE_KEY = ["classes"] as const

export const CLASS_QUERY_KEYS = {
  classes: BASE_KEY,
  getAll: [...BASE_KEY, "getAll"] as const,
  getById: [...BASE_KEY, "getById"] as const,
  createOrUpdate: [...BASE_KEY, "createOrUpdate"] as const,
  delete: [...BASE_KEY, "delete"] as const,
  addStudentsToClass: [...BASE_KEY, "addStudentsToClass"] as const,
} as const

export type ClassQueryKey = QueryKey
