import {
  createOrUpdateDocument,
  updateDocument,
  deleteDocument,
  readDocuments,
} from "@/lib/firebase/FSD";
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface";
import { IStudent } from "@/types/domain/student/student.interface";
import { serverTimestamp } from "firebase/firestore";

const COLLECTION_NAME = "students";

export const StudentService = {
  // Create or Update
  createOrUpdateStudent: async (
    data: Partial<IStudent> & { id?: string },
    isBeutifyDate: boolean = true
  ) => {
    try {
      // Nếu có id, thực hiện update
      if (data.id) {
        const result = await updateDocument<IStudent>(
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
        return result as ISuccessResponse<IStudent>;
      }

      // Kiểm tra các trường bắt buộc khi tạo mới
      if (
        !data.phoneNumber ||
        !data.fullName ||
        !data.dateOfBirth ||
        !data.gender
      ) {
        return {
          success: false,
          errorCode: "MISSING_REQUIRED_FIELDS",
          message:
            "Missing required fields: phoneNumber, fullName, dateOfBirth, gender",
        } as IErrorResponse;
      }

      // Nếu không có id, thực hiện create
      const newStudent: Omit<IStudent, "id"> = {
        ...data,
        phoneNumber: data.phoneNumber,
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        avatar: data.avatar || "",
        classes: data.classes || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const result = await createOrUpdateDocument<Omit<IStudent, "id">>(
        COLLECTION_NAME,
        newStudent,
        isBeutifyDate
      );

      if (!result.success) {
        return result as IErrorResponse;
      }
      return result as ISuccessResponse<IStudent>;
    } catch {
      return {
        success: false,
        errorCode: "INTERNAL_ERROR",
        message: "Failed to create or update student",
      } as IErrorResponse;
    }
  },

  // Read
  getStudents: async (isBeutifyDate: boolean = false) => {
    const result = await readDocuments<IStudent>(
      COLLECTION_NAME,
      [],
      isBeutifyDate
    );
    if (!result.success) {
      return result as IErrorResponse;
    }
    return result as ISuccessResponse<IStudent[]>;
  },

  // Delete
  deleteStudent: async (id: string) => {
    const result = await deleteDocument(COLLECTION_NAME, id);
    if (!result.success) {
      return result as IErrorResponse;
    }
    return result as ISuccessResponse<null>;
  },

  // Search for a single student by criteria
  searchStudent: async (
    fullName: string,
    dateOfBirth: string,
    phoneNumber: string,
    isBeutifyDate: boolean = true
  ): Promise<ISuccessResponse<IStudent | null> | IErrorResponse> => {
    // Kiểm tra nếu thiếu bất kỳ tham số nào
    console.log("fullName", fullName);
    console.log("dateOfBirth", dateOfBirth);
    console.log("phoneNumber", phoneNumber);
    if (!fullName || !dateOfBirth || !phoneNumber) {
      return {
        success: false,
        errorCode: "MISSING_PARAMETERS",
        message:
          "All search parameters (fullName, dateOfBirth, phoneNumber) are required",
      };
    }

    const result = await readDocuments<IStudent>(
      COLLECTION_NAME,
      [],
      isBeutifyDate
    );

    if (!result.success) {
      return result as IErrorResponse;
    }

    const foundStudent = result.data?.find((student) => {
      return (
        student.fullName === fullName &&
        student.dateOfBirth === dateOfBirth &&
        student.phoneNumber === phoneNumber
      );
    });

    return {
      success: true,
      message: foundStudent ? "Student found" : "Student not found",
      data: foundStudent || null,
    };
  },
};
