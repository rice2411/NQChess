import { QueryKey } from "@tanstack/react-query"

const BASE_KEY = ["tuitions"] as const

export const TUITION_QUERY_KEYS = {
  tuitions: BASE_KEY,
  getTuitions: [...BASE_KEY, "list", "isBeautifyDate"] as const,
  getTuitionById: [...BASE_KEY, "detail", "id", "isBeautifyDate"] as const,
  getTuitionsByStudentId: [
    ...BASE_KEY,
    "student",
    "studentId",
    "isBeautifyDate",
  ] as const,
  getTuitionsByClassId: [
    ...BASE_KEY,
    "class",
    "classId",
    "isBeautifyDate",
  ] as const,
} as const

export type TuitionQueryKey = QueryKey
