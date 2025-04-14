import { IBaseEntity } from "../../../core/types/common/entity.interface"
import { EGender } from "../enum/student.enum"

export interface IStudent extends IBaseEntity {
  phoneNumber: string
  fullName: string
  dateOfBirth: string
  avatar: string
  gender: EGender
  classes: string[]
}
