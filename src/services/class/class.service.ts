// src/services/ClassService.ts

import {
  createOrUpdateDocument,
  readDocument,
  updateDocument,
  deleteDocument,
  readDocuments,
} from "@/lib/firebase/FSD";
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
        status: data.status || EClassStatus.INACTIVE,
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
};
