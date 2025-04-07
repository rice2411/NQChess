// src/services/ClassService.ts

import {
  createOrUpdateDocument,
  readDocument,
  updateDocument,
  deleteDocument,
  readDocuments,
} from "@/lib/firebase/FSD";
import { TuitionService } from "./tuition.service";
import { IClass } from "@/types/domain/class/class.interface";
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface";
import { serverTimestamp } from "firebase/firestore";
import { EClassStatus } from "@/types/domain/class/class.enum";

const COLLECTION_NAME = "classes";

export const ClassService = {
  // Create or Update
  createOrUpdateClass: async (
    data: Partial<IClass> & { id?: string },
    isBeutifyDate: boolean = true
  ) => {
    try {
      // Nếu có id, thực hiện update
      if (data.id) {
        const result = await updateDocument<IClass>(
          COLLECTION_NAME,
          data.id,
          {
            ...data,
            updatedAt: serverTimestamp(),
          },
          isBeutifyDate
        );
        if (!result.success) {
          return result as IErrorResponse;
        }
        return result as ISuccessResponse<IClass>;
      }

      // Kiểm tra các trường bắt buộc khi tạo mới
      if (!data.name || !data.startDate || !data.endDate || !data.schedule) {
        return {
          success: false,
          errorCode: "MISSING_REQUIRED_FIELDS",
          message:
            "Missing required fields: name, startDate, endDate, schedule",
        } as IErrorResponse;
      }

      // Nếu không có id, thực hiện create
      const newClass: IClass = {
        ...data,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        schedule: data.schedule,
        students: data.students || [],
        status: data.status || EClassStatus.NOT_STARTED,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const result = await createOrUpdateDocument<IClass>(
        COLLECTION_NAME,
        newClass,
        isBeutifyDate
      );

      if (!result.success) {
        return result as IErrorResponse;
      }
      return result as ISuccessResponse<IClass>;
    } catch {
      return {
        success: false,
        errorCode: "INTERNAL_ERROR",
        message: "Failed to create or update class",
      } as IErrorResponse;
    }
  },

  // Read
  getClasses: async (isBeutifyDate: boolean = true) => {
    const result = await readDocuments<IClass>(
      COLLECTION_NAME,
      [],
      isBeutifyDate
    );
    if (!result.success) {
      return result as IErrorResponse;
    }
    return result as ISuccessResponse<IClass[]>;
  },

  // Delete
  deleteClass: async (id: string) => {
    const result = await deleteDocument(COLLECTION_NAME, id);
    if (!result.success) {
      return result as IErrorResponse;
    }
    return result as ISuccessResponse<null>;
  },

  // Search for a single class by criteria
  searchClass: async (
    name: string,
    startDate: string,
    isBeutifyDate: boolean = true
  ): Promise<ISuccessResponse<IClass | null> | IErrorResponse> => {
    // Kiểm tra nếu thiếu bất kỳ tham số nào
    if (!name || !startDate) {
      return {
        success: false,
        errorCode: "MISSING_PARAMETERS",
        message: "All search parameters (name, startDate) are required",
      };
    }

    const result = await readDocuments<IClass>(
      COLLECTION_NAME,
      [],
      isBeutifyDate
    );

    if (!result.success) {
      return result as IErrorResponse;
    }

    const foundClass = result.data?.find((class_) => {
      return class_.name === name && class_.startDate === startDate;
    });

    return {
      success: true,
      message: foundClass ? "Class found" : "Class not found",
      data: foundClass || null,
    };
  },

  // Get classes by student
  getClassesByStudent: async (
    studentId: string,
    isBeutifyDate: boolean = true
  ): Promise<ISuccessResponse<IClass[]> | IErrorResponse> => {
    const result = await readDocuments<IClass>(
      COLLECTION_NAME,
      [],
      isBeutifyDate
    );

    if (!result.success) {
      return result as IErrorResponse;
    }

    const classes = result.data?.filter((class_) => {
      return class_.students.includes(studentId);
    });

    return {
      success: true,
      message: "Classes retrieved successfully",
      data: classes || [],
    };
  },

  // Get class by id
  getClassById: async (
    id: string,
    isBeutifyDate: boolean = true
  ): Promise<ISuccessResponse<IClass> | IErrorResponse> => {
    const result = await readDocument<IClass>(
      COLLECTION_NAME,
      id,
      isBeutifyDate
    );
    if (!result.success) {
      return result as IErrorResponse;
    }
    return result as ISuccessResponse<IClass>;
  },

  // Add or remove student from class
  updateClassStudents: async (
    classId: string,
    studentId: string,
    isAdd: boolean,
    isBeutifyDate: boolean = true
  ): Promise<ISuccessResponse<IClass> | IErrorResponse> => {
    const classResult = await readDocument<IClass>(
      COLLECTION_NAME,
      classId,
      isBeutifyDate
    );
    if (!classResult.success) {
      return classResult as IErrorResponse;
    }

    const classData = classResult.data;
    if (!classData) {
      return {
        success: false,
        errorCode: "NOT_FOUND",
        message: "Class not found",
      } as IErrorResponse;
    }

    const students = classData.students || [];

    if (isAdd) {
      if (!students.includes(studentId)) {
        students.push(studentId);
      }
    } else {
      const index = students.indexOf(studentId);
      if (index !== -1) {
        students.splice(index, 1);
      }
    }

    const result = await updateDocument<IClass>(
      COLLECTION_NAME,
      classId,
      {
        students,
        updatedAt: serverTimestamp(),
      },
      isBeutifyDate
    );

    if (!result.success) {
      return result as IErrorResponse;
    }
    return result as ISuccessResponse<IClass>;
  },

  // Get class by id
  getClass: async (id: string, isBeutifyDate: boolean = true) => {
    const result = await readDocument<IClass>(
      COLLECTION_NAME,
      id,
      isBeutifyDate
    );
    if (!result.success) {
      return result as IErrorResponse;
    }
    return {
      success: true,
      message: result.data ? "Class found" : "Class not found",
      data: result.data || null,
    } as ISuccessResponse<IClass | null>;
  },

  // Update class
  updateClass: async (
    id: string,
    data: Partial<IClass>,
    isBeutifyDate: boolean = true
  ) => {
    const result = await updateDocument<IClass>(
      COLLECTION_NAME,
      id,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      isBeutifyDate
    );
    if (!result.success) {
      return result as IErrorResponse;
    }
    return result as ISuccessResponse<IClass>;
  },

  // Toggle student in class
  toggleStudent: async (
    classId: string,
    studentIds: string[],
    isBeutifyDate: boolean = true
  ) => {
    const result = await readDocument<IClass>(
      COLLECTION_NAME,
      classId,
      isBeutifyDate
    );
    if (!result.success) {
      return result as IErrorResponse;
    }

    const classToUpdate = result.data;
    if (!classToUpdate) {
      return {
        success: false,
        errorCode: "CLASS_NOT_FOUND",
        message: "Class not found",
      } as IErrorResponse;
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
    const updatedStudents = Array.from(currentStudents) as string[];

    // Cập nhật danh sách học sinh trong lớp
    const updateResult = await updateDocument<IClass>(
      COLLECTION_NAME,
      classId,
      {
        students: updatedStudents,
        updatedAt: serverTimestamp(),
      },
      isBeutifyDate
    );

    if (!updateResult.success) {
      return updateResult as IErrorResponse;
    }

    // Tạo học phí cho học sinh mới thêm vào
    const newStudents = studentIds.filter(
      (id) => !classToUpdate.students.includes(id)
    );
    if (newStudents.length > 0) {
      const startDate = new Date(classToUpdate.startDate);
      const endDate = new Date(classToUpdate.endDate);
      const amount = 500000; // Giả sử học phí cố định là 500,000đ/tháng

      // Tạo học phí cho từng tháng từ ngày bắt đầu đến ngày kết thúc
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const month = currentDate.toISOString().slice(0, 7); // Format: YYYY-MM

        // Tạo học phí cho từng học sinh mới
        for (const studentId of newStudents) {
          const tuitionResult = await TuitionService.createTuition(
            classId,
            studentId,
            month,
            amount
          );
          if (!tuitionResult.success) {
            return tuitionResult as IErrorResponse;
          }
        }

        // Chuyển sang tháng tiếp theo
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return {
      success: true,
      message: "Students updated successfully",
      data: updatedStudents,
    } as ISuccessResponse<string[]>;
  },
};
