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
import { ITuition } from "@/types/domain/tuition/tuition.interface";
import { IClass } from "@/types/domain/class/class.interface";
import { serverTimestamp } from "firebase/firestore";
import { ETuitionStatus } from "@/types/domain/tuition/tuition.enum";

const COLLECTION_NAME = "tuitions";

export const TuitionService = {
  // Create or Update
  createOrUpdateTuition: async (
    data: Partial<ITuition> & { id?: string },
    isBeutifyDate: boolean = true
  ) => {
    try {
      // Nếu có id, thực hiện update
      if (data.id) {
        const result = await updateDocument<ITuition>(
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
        return result as ISuccessResponse<ITuition>;
      }

      // Kiểm tra các trường bắt buộc khi tạo mới
      if (
        !data.studentId ||
        !data.classId ||
        !data.amount ||
        !data.month ||
        !data.dueDate
      ) {
        return {
          success: false,
          errorCode: "MISSING_REQUIRED_FIELDS",
          message:
            "Missing required fields: studentId, classId, amount, month, dueDate",
        } as IErrorResponse;
      }

      // Nếu không có id, thực hiện create
      const newTuition: ITuition = {
        ...data,
        studentId: data.studentId,
        classId: data.classId,
        amount: data.amount,
        month: data.month,
        dueDate: data.dueDate,
        status: data.status || ETuitionStatus.PENDING,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const result = await createOrUpdateDocument<ITuition>(
        COLLECTION_NAME,
        newTuition,
        isBeutifyDate
      );

      if (!result.success) {
        return result as IErrorResponse;
      }
      return result as ISuccessResponse<ITuition>;
    } catch {
      return {
        success: false,
        errorCode: "INTERNAL_ERROR",
        message: "Failed to create or update tuition",
      } as IErrorResponse;
    }
  },

  // Read
  getTuitions: async (isBeutifyDate: boolean = true) => {
    const result = await readDocuments<ITuition>(
      COLLECTION_NAME,
      [],
      isBeutifyDate
    );
    if (!result.success) {
      return result as IErrorResponse;
    }
    return result as ISuccessResponse<ITuition[]>;
  },

  // Delete
  deleteTuition: async (id: string) => {
    const result = await deleteDocument(COLLECTION_NAME, id);
    if (!result.success) {
      return result as IErrorResponse;
    }
    return result as ISuccessResponse<null>;
  },

  // Search for a single tuition by criteria
  searchTuition: async (
    studentId: string,
    month: string,
    isBeutifyDate: boolean = true
  ): Promise<ISuccessResponse<ITuition | null> | IErrorResponse> => {
    // Kiểm tra nếu thiếu bất kỳ tham số nào
    if (!studentId || !month) {
      return {
        success: false,
        errorCode: "MISSING_PARAMETERS",
        message: "All search parameters (studentId, month) are required",
      };
    }

    const result = await readDocuments<ITuition>(
      COLLECTION_NAME,
      [],
      isBeutifyDate
    );

    if (!result.success) {
      return result as IErrorResponse;
    }

    const foundTuition = result.data?.find((tuition) => {
      return tuition.studentId === studentId && tuition.month === month;
    });

    return {
      success: true,
      message: foundTuition ? "Tuition found" : "Tuition not found",
      data: foundTuition || null,
    };
  },

  // Get tuitions by class and student
  getTuitionsByClassAndStudent: async (
    classId: string,
    studentId: string,
    isBeutifyDate: boolean = true
  ): Promise<ISuccessResponse<ITuition[]> | IErrorResponse> => {
    const result = await readDocuments<ITuition>(
      COLLECTION_NAME,
      [],
      isBeutifyDate
    );

    if (!result.success) {
      return result as IErrorResponse;
    }

    const tuitions = result.data?.filter((tuition) => {
      return tuition.classId === classId && tuition.studentId === studentId;
    });

    return {
      success: true,
      message: "Tuitions retrieved successfully",
      data: tuitions || [],
    };
  },

  // Create tuition
  createTuition: async (
    classId: string,
    studentId: string,
    month: string,
    amount: number
  ) => {
    const tuitionData: Omit<ITuition, "id"> = {
      classId,
      studentId,
      month,
      amount,
      status: ETuitionStatus.PENDING,
      dueDate: new Date().toISOString().split("T")[0],
    };

    return await TuitionService.createOrUpdateTuition(tuitionData);
  },

  // Tạo học phí cho tất cả học sinh trong một lớp
  createTuitionsForClass: async (classData: IClass) => {
    const startDate = new Date(classData.startDate);
    const endDate = new Date(classData.endDate);
    const amount = 500000; // Giả sử học phí cố định là 500,000đ/tháng

    // Tạo học phí cho từng tháng từ ngày bắt đầu đến ngày kết thúc
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const month = currentDate.toISOString().slice(0, 7); // Format: YYYY-MM

      // Tạo học phí cho từng học sinh trong lớp
      for (const studentId of classData.students) {
        const result = await TuitionService.createTuition(
          classData.id!,
          studentId,
          month,
          amount
        );
        if (!result.success) {
          return result as IErrorResponse;
        }
      }

      // Chuyển sang tháng tiếp theo
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return {
      success: true,
      message: "Tuitions created successfully",
      data: null,
    } as ISuccessResponse<null>;
  },

  // Cập nhật trạng thái học phí
  updateTuitionStatus: async (tuitionId: string, status: ETuitionStatus) => {
    const now = new Date().toISOString();
    const updateData: Partial<ITuition> = {
      status,
      updatedAt: now,
    };

    // Chỉ thêm paidDate khi status là "paid"
    if (status === ETuitionStatus.PAID) {
      updateData.paidDate = now.split("T")[0];
    } else {
      // Khi status không phải "paid", xóa paidDate
      delete updateData.paidDate;
    }

    const result = await updateDocument<ITuition>(
      COLLECTION_NAME,
      tuitionId,
      updateData
    );
    if (!result.success) {
      return result as IErrorResponse;
    }
    return result as ISuccessResponse<ITuition>;
  },
};
