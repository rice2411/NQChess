// src/services/ClassService.ts

import {
  createOrUpdateDocument,
  readDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/firebase/FSD";
import { Class } from "@/types/class";

const COLLECTION_NAME = "classes";

export const ClassService = {
  // Tạo mới hoặc cập nhật lớp học
  createOrUpdateClass: async (data: Omit<Class, "id">) => {
    try {
      const result = await createOrUpdateDocument(COLLECTION_NAME, data);
      return result as Class;
    } catch (error) {
      console.error("Error creating/updating class:", error);
      throw error;
    }
  },

  // Đọc danh sách lớp học
  getClasses: async () => {
    try {
      const results = await readDocument(COLLECTION_NAME);
      return results as Class[];
    } catch (error) {
      console.error("Error reading classes:", error);
      throw error;
    }
  },

  // Cập nhật thông tin lớp học
  updateClass: async (id: string, data: Partial<Class>) => {
    try {
      await updateDocument(COLLECTION_NAME, id, data);
    } catch (error) {
      console.error("Error updating class:", error);
      throw error;
    }
  },

  // Xóa lớp học
  deleteClass: async (id: string) => {
    try {
      await deleteDocument(COLLECTION_NAME, id);
    } catch (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  },

  // Thêm học sinh vào lớp học
  addStudent: async (classId: string, studentIds: string[]) => {
    try {
      const classData = (await readDocument(COLLECTION_NAME)) as Class[];
      const classToUpdate = classData.find((cls: Class) => cls.id === classId);

      if (!classToUpdate) {
        throw new Error("Class not found");
      }

      // Cập nhật danh sách học sinh
      const updatedStudents = Array.from(
        new Set([...classToUpdate.students, ...studentIds])
      ); // Loại bỏ ID trùng lặp
      await updateDocument(COLLECTION_NAME, classId, {
        students: updatedStudents,
      });
    } catch (error) {
      console.error("Error adding students to class:", error);
      throw error;
    }
  },
};
