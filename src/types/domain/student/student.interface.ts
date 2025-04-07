import { IBaseEntity } from "../../common/entity.interface";
import { EGender } from "./student.enum";

export interface IStudent extends IBaseEntity {
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string;
  avatar: string;
  gender: EGender;
  classes: string[];
}
