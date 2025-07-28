import { IBaseEntity } from './base.interface';

export enum EClassStatus {
  NOT_STARTED = 'NOT_STARTED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export enum EStudentClassStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum EStudentClassType {
  FULL = 'FULL',
  HALF = 'HALF',
}

export interface IStudentClass {
  studentId: string;
  fullName?: string;
  joinDate: Date;
  status: EStudentClassStatus;
  type: EStudentClassType; // Loại học (full/nửa buổi)
  session?: string; // Buổi học cụ thể (nếu học nửa buổi)
  tuition: number; // Học phí
}

// Format: "HH:mm - HH:mm Thứ X"
export type ClassSchedule = string;

export interface IClass extends IBaseEntity {
  name: string;
  startDate: string;
  endDate?: string; // Ngày kết thúc lớp học
  students: IStudentClass[];
  schedules: ClassSchedule[];
  status: EClassStatus;
  tuition: number; // Học phí mặc định
}
