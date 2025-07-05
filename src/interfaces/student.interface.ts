import { IBaseEntity } from './base.interface';

export interface IStudent extends IBaseEntity {
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string;
  avatar: string;
  gender: EGender;
}

export enum EGender {
  MALE = 'male',
  FEMALE = 'female',
}
