export const CLASS_QUERY_KEYS = {
  getClasses: ["classes", "list", "isBeutifyDate"],
  getClassById: ["classes", "detail", "id"],
  addStudentsToClass: ["classes", "addStudents", "id"],
  deleteClass: ["classes", "delete", "id"],
} as const;
