import { IBaseEntity } from "../../common/entity.interface";
import { ETuitionStatus } from "./tuition.enum";

export interface ITuition extends IBaseEntity {
  classId: string;
  studentId: string;
  status: ETuitionStatus;
  amount: number;
  month: string;
}
