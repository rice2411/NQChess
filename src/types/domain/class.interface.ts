import { IBaseEntity } from "../common/entity.interface"
import { EClassStatus, EStudentClassStatus } from "../../enum/class.enum"

export interface IStudentClass {
  studentId: string
  joinDate: Date
  status: EStudentClassStatus
}

export interface IClass extends IBaseEntity {
  name: string
  startDate: string
  endDate: string
  students: IStudentClass[]
  schedules: string[]
  status: EClassStatus
  tuition: number
}
