/**
 * Constants cho các parameters của StudentService
 */
export const STUDENT_SERVICE = {
  PARAMS: {
    CREATE_OR_UPDATE: {
      REQUIRED_FIELDS: [
        "phoneNumber",
        "fullName",
        "dateOfBirth",
        "gender",
      ] as const,
      OPTIONAL_FIELDS: ["avatar", "classes"] as const,
    },
    SEARCH: {
      REQUIRED_FIELDS: ["fullName", "dateOfBirth", "phoneNumber"] as const,
    },
  },
  COLLECTION: {
    NAME: "students" as const,
  },
  ERROR_CODES: {
    MISSING_REQUIRED_FIELDS: "MISSING_REQUIRED_FIELDS" as const,
    MISSING_PARAMETERS: "MISSING_PARAMETERS" as const,
    INTERNAL_ERROR: "INTERNAL_ERROR" as const,
  },
  ERROR_MESSAGES: {
    MISSING_REQUIRED_FIELDS:
      "Missing required fields: phoneNumber, fullName, dateOfBirth, gender",
    MISSING_PARAMETERS:
      "All search parameters (fullName, dateOfBirth, phoneNumber) are required",
    INTERNAL_ERROR: "Failed to create or update student",
  },
} as const;
