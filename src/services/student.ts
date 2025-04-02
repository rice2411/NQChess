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
  getStudents: async () => {
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

  // Search for a single student by criteria
  searchStudent: async (searchCriteria: {
    fullName?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
  }): Promise<Student | null> => {
    try {
      const allStudents = (await readDocument(COLLECTION_NAME)) as Student[];
      const foundStudent = allStudents.find((student: Student) => {
        const matchesFullName = searchCriteria.fullName
          ? student.fullName === searchCriteria.fullName
          : true;
        const matchesDateOfBirth = searchCriteria.dateOfBirth
          ? student.dateOfBirth === searchCriteria.dateOfBirth
          : true;
        const matchesPhoneNumber = searchCriteria.phoneNumber
          ? student.phoneNumber === searchCriteria.phoneNumber
          : true;

        return matchesFullName && matchesDateOfBirth && matchesPhoneNumber;
      });

      return foundStudent || null; // Trả về học sinh tìm thấy hoặc null nếu không có
    } catch (error) {
      console.error("Error searching student:", error);
      return null; // Trả về null nếu có lỗi
    }
  },
};
