import { EUserRole } from "../enums/user.enum"
import { IBaseEntity } from "@/core/types/common/entity.interface"

export interface IUser extends IBaseEntity {
  username: string
  password: string
  email: string
  role: EUserRole
}
