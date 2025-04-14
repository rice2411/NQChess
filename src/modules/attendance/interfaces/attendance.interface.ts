import { EAttendanceStatus } from "@/modules/attendance/enum/attendance.enum"
import { IBaseEntity } from "../../../core/types/common/entity.interface"

export interface IAttendance extends IBaseEntity {
  lessonId: string
  studentId: string
  status: EAttendanceStatus
  note?: string
}
