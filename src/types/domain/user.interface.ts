import { EUserRole } from "@/enum/user.enum"
import { IBaseEntity } from "../common/entity.interface"

export interface IUser extends IBaseEntity {
  username: string
  password: string
  role: EUserRole
}
