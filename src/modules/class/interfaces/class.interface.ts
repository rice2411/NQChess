import { IBaseEntity } from "@/core/types/common/entity.interface"
import { EClassStatus, EStudentClassStatus } from "../enums/class.enum"

export interface IStudentClass {
  studentId: string
  joinDate: Date
  status: EStudentClassStatus
}

// Format: "HH:mm - HH:mm Thứ X"
export type ClassSchedule = string

export interface IClass extends IBaseEntity {
  name: string
  startDate: string
  endDate: string
  students: IStudentClass[]
  schedules: ClassSchedule[]
  status: EClassStatus
  tuition: number
}
