import {
  createOrUpdateDocument,
  readDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/firebase/FSD";
import { Student } from "@/types/student";

const COLLECTION_NAME = "students";

export const StudentService = {
  // Create or Update
  createOrUpdateStudent: async (data: Omit<Student, "id">) => {
    try {
      const result = await createOrUpdateDocument(COLLECTION_NAME, data);
      return result as Student;
    } catch (error) {
      console.error("Error creating/updating student:", error);
      throw error;
    }
  },

  // Read
  readStudents: async () => {
    try {
      const results = await readDocument(COLLECTION_NAME);
      return results as Student[];
    } catch (error) {
      console.error("Error reading students:", error);
      throw error;
    }
  },

  // Update
  updateStudent: async (id: string, data: Partial<Student>) => {
    try {
      await updateDocument(COLLECTION_NAME, id, data);
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  },

  // Delete
  deleteStudent: async (id: string) => {
    try {
      await deleteDocument(COLLECTION_NAME, id);
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  },

  // Search students by criteria
  searchStudents: async (searchCriteria: {
    fullName?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
  }) => {
    try {
      const allStudents = (await readDocument(COLLECTION_NAME)) as Student[];
      const filteredStudents = allStudents.filter((student) => {
        if (
          searchCriteria.fullName &&
          student.fullName !== searchCriteria.fullName
        )
          return false;
        if (
          searchCriteria.dateOfBirth &&
          student.dateOfBirth !== searchCriteria.dateOfBirth
        )
          return false;
        if (
          searchCriteria.phoneNumber &&
          student.phoneNumber !== searchCriteria.phoneNumber
        )
          return false;
        return true;
      });
      return filteredStudents as Student[];
    } catch (error) {
      console.error("Error searching students:", error);
      throw error;
    }
  },
};
