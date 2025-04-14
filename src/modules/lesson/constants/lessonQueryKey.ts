import { QueryKey } from "@tanstack/react-query"

const BASE_KEY = ["lessons"] as const

export const LESSON_QUERY_KEYS = {
  lessons: [...BASE_KEY],
  getAll: [...BASE_KEY, "getAll"],
  getById: [...BASE_KEY, "getById"],
  getByTeacher: [...BASE_KEY, "getByTeacher"],
  getByStudent: [...BASE_KEY, "getByStudent"],
  getByClassId: [...BASE_KEY, "getByClassId"],
} as const

export type LessonQueryKey = QueryKey
