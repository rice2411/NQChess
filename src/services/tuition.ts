import {
  createOrUpdateDocument,
  readDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/firebase/FSD";
import { Tuition } from "@/types/tuition";
import { Class } from "@/types/class";

const COLLECTION_NAME = "tuitions";

export const TuitionService = {
  // Tạo học phí cho một học sinh trong một lớp
  createTuition: async (
    classId: string,
    studentId: string,
    month: string,
    amount: number
  ) => {
    try {
      const now = new Date().toISOString();
      const dueDate = new Date(month + "-01");
      dueDate.setDate(dueDate.getDate() + 15); // Hạn nộp là ngày 15 hàng tháng

      const tuition: Omit<Tuition, "id"> = {
        classId,
        studentId,
        month,
        amount,
        status: "pending",
        dueDate: dueDate.toISOString().split("T")[0],
        createdAt: now,
        updatedAt: now,
      };

      const result = await createOrUpdateDocument(COLLECTION_NAME, tuition);
      return result as Tuition;
    } catch (error) {
      console.error("Error creating tuition:", error);
      throw error;
    }
  },

  // Tạo học phí cho tất cả học sinh trong một lớp
  createTuitionsForClass: async (classData: Class) => {
    try {
      const tuitions: Promise<Tuition>[] = [];
      const startDate = new Date(classData.startDate);
      const endDate = new Date(classData.endDate);
      const amount = 500000; // Giả sử học phí cố định là 500,000đ/tháng

      // Tạo học phí cho từng tháng từ ngày bắt đầu đến ngày kết thúc
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const month = currentDate.toISOString().slice(0, 7); // Format: YYYY-MM

        // Tạo học phí cho từng học sinh trong lớp
        for (const studentId of classData.students) {
          tuitions.push(
            TuitionService.createTuition(
              classData.id!,
              studentId,
              month,
              amount
            )
          );
        }

        // Chuyển sang tháng tiếp theo
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      await Promise.all(tuitions);
    } catch (error) {
      console.error("Error creating tuitions for class:", error);
      throw error;
    }
  },

  // Lấy danh sách học phí của một học sinh trong một lớp
  getTuitionsByClassAndStudent: async (classId: string, studentId: string) => {
    try {
      const tuitions = await readDocument(COLLECTION_NAME);
      return (tuitions as Tuition[]).filter(
        (t) => t.classId === classId && t.studentId === studentId
      );
    } catch (error) {
      console.error("Error getting tuitions:", error);
      throw error;
    }
  },

  // Cập nhật trạng thái học phí
  updateTuitionStatus: async (tuitionId: string, status: Tuition["status"]) => {
    try {
      const now = new Date().toISOString();
      const updateData: Partial<Tuition> = {
        status,
        updatedAt: now,
      };

      // Chỉ thêm paidDate khi status là "paid"
      if (status === "paid") {
        updateData.paidDate = now.split("T")[0];
      } else {
        // Khi status không phải "paid", xóa paidDate
        delete updateData.paidDate;
      }

      await updateDocument(COLLECTION_NAME, tuitionId, updateData);
    } catch (error) {
      console.error("Error updating tuition status:", error);
      throw error;
    }
  },

  // Xóa học phí
  deleteTuition: async (id: string) => {
    try {
      await deleteDocument(COLLECTION_NAME, id);
    } catch (error) {
      console.error("Error deleting tuition:", error);
      throw error;
    }
  },
};
