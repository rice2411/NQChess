// src/services/ClassService.ts

import {
  createOrUpdateDocument,
  readDocument,
  updateDocument,
  deleteDocument,
  readDocuments,
} from "@/lib/firebase/FSD";
import { IClass, IStudentClass } from "@/types/domain/class/class.interface";
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface";
import { serverTimestamp } from "firebase/firestore";
import {
  EClassStatus,
  EStudentClassStatus,
} from "@/types/domain/class/class.enum";
import { TuitionService } from "../tuition/tuition.service";
import { ETuitionStatus } from "@/types/domain/tuition/tuition.enum";
import { calculateTuitionMonths } from "@/helpers/tuition.helper";

const COLLECTION_NAME = "classes";

export const ClassService = {
  // Create
  createClass: async (
    data: Omit<IClass, "id">,
    isBeutifyDate: boolean = true
  ) => {
    try {
      // Kiểm tra các trường bắt buộc khi tạo mới
      if (!data.name || !data.startDate || !data.endDate || !data.schedules) {
        return {
          success: false,
          errorCode: "MISSING_REQUIRED_FIELDS",
          message:
            "Missing required fields: name, startDate, endDate, schedule",
        } as IErrorResponse;
      }

      // Tạo dữ liệu mới
      const newClass: Omit<IClass, "id"> = {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        schedules: data.schedules,
        students: data.students || [],
        status: data.status || EClassStatus.INACTIVE,
        tuition: data.tuition || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const result = await createOrUpdateDocument<Omit<IClass, "id">>(
        COLLECTION_NAME,
        newClass,
        isBeutifyDate
      );

      if (!result.success) {
        return result as IErrorResponse;
      }
      return result as ISuccessResponse<IClass>;
    } catch (error: any) {
      console.error("Create class error:", error);

      if (error.code === "permission-denied") {
        return {
          success: false,
          errorCode: "PERMISSION_DENIED",
          message: "You don't have permission to create class",
        } as IErrorResponse;
      }

      return {
        success: false,
        errorCode: "INTERNAL_ERROR",
        message: "Failed to create class",
      } as IErrorResponse;
    }
  },

  // Read
  getClasses: async (isBeutifyDate: boolean = true) => {
    try {
      const result = await readDocuments<IClass>(
        COLLECTION_NAME,
        [],
        isBeutifyDate
      );
      if (!result.success) {
        return result as IErrorResponse;
      }

      return result as ISuccessResponse<IClass[]>;
    } catch (error: any) {
      console.error("Get classes error:", error);

      if (error.code === "permission-denied") {
        return {
          success: false,
          errorCode: "PERMISSION_DENIED",
          message: "You don't have permission to view classes",
        } as IErrorResponse;
      }

      return {
        success: false,
        errorCode: "INTERNAL_ERROR",
        message: "Failed to get classes",
      } as IErrorResponse;
    }
  },

  // Delete
  deleteClass: async (id: string) => {
    try {
      const result = await deleteDocument(COLLECTION_NAME, id);
      if (!result.success) {
        return result as IErrorResponse;
      }
      return result as ISuccessResponse<null>;
    } catch (error: any) {
      console.error("Delete class error:", error);

      if (error.code === "permission-denied") {
        return {
          success: false,
          errorCode: "PERMISSION_DENIED",
          message: "You don't have permission to delete this class",
        } as IErrorResponse;
      } else if (error.code === "not-found") {
        return {
          success: false,
          errorCode: "NOT_FOUND",
          message: "Class not found",
        } as IErrorResponse;
      }

      return {
        success: false,
        errorCode: "INTERNAL_ERROR",
        message: "Failed to delete class",
      } as IErrorResponse;
    }
  },

  // Get class by id
  getClassById: async (
    id: string,
    isBeutifyDate: boolean
  ): Promise<ISuccessResponse<IClass> | IErrorResponse> => {
    try {
      const result = await readDocument<IClass>(
        COLLECTION_NAME,
        id,
        isBeutifyDate
      );
      if (!result.success) {
        return result as IErrorResponse;
      }
      return result as ISuccessResponse<IClass>;
    } catch (error: any) {
      console.error("Get class by id error:", error);

      if (error.code === "permission-denied") {
        return {
          success: false,
          errorCode: "PERMISSION_DENIED",
          message: "You don't have permission to view this class",
        } as IErrorResponse;
      } else if (error.code === "not-found") {
        return {
          success: false,
          errorCode: "NOT_FOUND",
          message: "Class not found",
        } as IErrorResponse;
      }

      return {
        success: false,
        errorCode: "INTERNAL_ERROR",
        message: "Failed to get class",
      } as IErrorResponse;
    }
  },

  // Add or remove student from class
  addStudentsToClass: async (
    classId: string,
    studentIds: string[],
    isBeutifyDate: boolean = true
  ): Promise<ISuccessResponse<IClass> | IErrorResponse> => {
    try {
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

      studentIds.forEach(async (id) => {
        const newStudent: IStudentClass = {
          studentId: id,
          joinDate: new Date(),
          status: EStudentClassStatus.ONLINE,
        };
        const months = calculateTuitionMonths(
          classData.startDate,
          classData.endDate,
          newStudent.joinDate.toISOString()
        );

        months.forEach(async (month) => {
          await TuitionService.createTuitionForStudent(
            {
              classId,
              studentId: newStudent.studentId,
              amount: classData.tuition || 0,
              month: month,
              status: ETuitionStatus.PENDING,
            },
            isBeutifyDate
          );
        });
      });

      const result = await updateDocument<IClass>(
        COLLECTION_NAME,
        classId,
        { students },
        isBeutifyDate
      );

      return result as ISuccessResponse<IClass>;
    } catch (error: any) {
      console.error("Update class students error:", error);

      if (error.code === "permission-denied") {
        return {
          success: false,
          errorCode: "PERMISSION_DENIED",
          message: "You don't have permission to update this class",
        } as IErrorResponse;
      } else if (error.code === "not-found") {
        return {
          success: false,
          errorCode: "NOT_FOUND",
          message: "Class not found",
        } as IErrorResponse;
      }

      return {
        success: false,
        errorCode: "INTERNAL_ERROR",
        message: "Failed to update class students",
      } as IErrorResponse;
    }
  },
};
