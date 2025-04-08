export const STUDENT_QUERY_KEYS = {
  getStudents: ["students", "list", "isBeutifyDate"],
  searchStudent: ["students", "search", "params"],
  createOrUpdateStudent: ["students", "createOrUpdate", "id"],
  deleteStudent: ["students", "delete", "id"],
} as const;
