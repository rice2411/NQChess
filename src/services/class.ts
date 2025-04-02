// src/services/ClassService.ts

import {
  createOrUpdateDocument,
  readDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/firebase/FSD";
import { Class } from "@/types/class";
import { TuitionService } from "./tuition";

const COLLECTION_NAME = "classes";

export const ClassService = {
  // Tạo mới hoặc cập nhật lớp học
  createOrUpdateClass: async (data: Omit<Class, "id">) => {
    try {
      const result = await createOrUpdateDocument(COLLECTION_NAME, data);
      const classData = result as Class;

      // Nếu đây là lớp mới (không có id), tạo học phí cho tất cả học sinh
      if (!classData.id) {
        await TuitionService.createTuitionsForClass(classData);
      }

      return classData;
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

  // Thêm hoặc xóa học sinh khỏi lớp học
  toggleStudent: async (classId: string, studentIds: string[]) => {
    try {
      const classData = (await readDocument(COLLECTION_NAME)) as Class[];
      const classToUpdate = classData.find((cls: Class) => cls.id === classId);

      if (!classToUpdate) {
        throw new Error("Class not found");
      }

      // Tạo một Set để lưu trữ các ID học sinh hiện tại
      const currentStudents = new Set(classToUpdate.students);

      // Xử lý từng studentId
      studentIds.forEach((studentId) => {
        if (currentStudents.has(studentId)) {
          // Nếu ID đã tồn tại, xóa nó
          currentStudents.delete(studentId);
        } else {
          // Nếu ID chưa tồn tại, thêm nó vào
          currentStudents.add(studentId);
        }
      });

      // Chuyển Set trở lại thành mảng
      const updatedStudents = Array.from(currentStudents);

      // Cập nhật danh sách học sinh trong lớp
      await updateDocument(COLLECTION_NAME, classId, {
        students: updatedStudents,
      });

      // Tạo học phí cho học sinh mới thêm vào
      const newStudents = studentIds.filter(
        (id) => !classToUpdate.students.includes(id)
      );
      if (newStudents.length > 0) {
        const startDate = new Date(classToUpdate.startDate);
        const endDate = new Date(classToUpdate.endDate);
        const amount = 500000; // Giả sử học phí cố định là 500,000đ/tháng

        // Tạo học phí cho từng tháng từ ngày bắt đầu đến ngày kết thúc
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const month = currentDate.toISOString().slice(0, 7); // Format: YYYY-MM

          // Tạo học phí cho từng học sinh mới
          for (const studentId of newStudents) {
            await TuitionService.createTuition(
              classId,
              studentId,
              month,
              amount
            );
          }

          // Chuyển sang tháng tiếp theo
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }

      return updatedStudents;
    } catch (error) {
      console.error("Error toggling students in class:", error);
      throw error;
    }
  },
};
