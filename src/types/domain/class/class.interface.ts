import { IBaseEntity } from "../../common/entity.interface";
import { EClassStatus } from "./class.enum";
export interface IClass extends Omit<IBaseEntity, "id"> {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  students: string[];
  schedule: string;
  status: EClassStatus;
}
