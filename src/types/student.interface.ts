import { EGender } from "@/enum";
import { IBaseEntity } from "./entity.interface";

export interface IStudent extends IBaseEntity {
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string;
  avatar: string;
  gender: EGender;
  classes: string[];
}
