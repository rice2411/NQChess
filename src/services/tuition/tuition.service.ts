import { createOrUpdateDocument } from "@/lib/firebase/FSD";
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface";
import { ITuition } from "@/types/domain/tuition/tuition.interface";
import { serverTimestamp } from "firebase/firestore";
import { ETuitionStatus } from "@/types/domain/tuition/tuition.enum";

const COLLECTION_NAME = "tuitions";

export const TuitionService = {
  // Tạo học phí cho một học sinh
  createTuitionForStudent: async (
    data: Omit<ITuition, "id">,
    isBeutifyDate: boolean = true
  ): Promise<ISuccessResponse<ITuition> | IErrorResponse> => {
    try {
      // Kiểm tra các trường bắt buộc
      if (!data.classId || !data.studentId || !data.amount) {
        return {
          success: false,
          errorCode: "MISSING_REQUIRED_FIELDS",
          message: "Missing required fields: classId, studentId, amount",
        } as IErrorResponse;
      }

      // Tạo dữ liệu học phí mới
      const newTuition: Omit<ITuition, "id"> = {
        ...data,
        status: ETuitionStatus.PENDING,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const result = await createOrUpdateDocument<Omit<ITuition, "id">>(
        COLLECTION_NAME,
        newTuition,
        isBeutifyDate
      );

      if (!result.success) {
        return result as IErrorResponse;
      }
      return result as ISuccessResponse<ITuition>;
    } catch (error: any) {
      console.error("Create tuition error:", error);

      if (error.code === "permission-denied") {
        return {
          success: false,
          errorCode: "PERMISSION_DENIED",
          message: "You don't have permission to create tuition",
        } as IErrorResponse;
      }

      return {
        success: false,
        errorCode: "INTERNAL_ERROR",
        message: "Failed to create tuition",
      } as IErrorResponse;
    }
  },
};
