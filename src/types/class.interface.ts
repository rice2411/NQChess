import { IBaseEntity } from "./entity.interface";
import { EClassStatus } from "@/enum";
export interface IClass extends Omit<IBaseEntity, "id"> {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  students: string[];
  schedule: string;
  status: EClassStatus;
}
