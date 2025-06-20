import { IBaseEntity } from "@/core/types/common/entity.interface"
import {
  EClassStatus,
  EStudentClassStatus,
  EStudentClassType,
} from "../enums/class.enum"

export interface IStudentClass {
  studentId: string
  fullName?: string
  joinDate: Date
  status: EStudentClassStatus
  type: EStudentClassType // Loại học (full/nửa buổi)
  session?: string // Buổi học cụ thể (nếu học nửa buổi)
  tuition: number // Học phí
}

// Format: "HH:mm - HH:mm Thứ X"
export type ClassSchedule = string

export interface IClass extends IBaseEntity {
  name: string
  startDate: string
  students: IStudentClass[]
  schedules: ClassSchedule[]
  status: EClassStatus
  tuition: number // Học phí mặc định
}
