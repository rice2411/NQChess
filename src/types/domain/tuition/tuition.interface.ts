import { IBaseEntity } from "../../common/entity.interface";
import { ETuitionStatus } from "./tuition.enum";

export interface ITuition extends Omit<IBaseEntity, "id"> {
  id?: string;
  classId: string;
  studentId: string;
  month: string; // Format: YYYY-MM
  amount: number;
  status: ETuitionStatus;
  dueDate: string; // Format: YYYY-MM-DD
  paidDate?: string; // Format: YYYY-MM-DD
}
