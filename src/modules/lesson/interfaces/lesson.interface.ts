import { ELessonStatus } from "@/modules/lesson/enums/lesson.enum"
import { IBaseEntity } from "../../../core/types/common/entity.interface"

export interface ILesson extends IBaseEntity {
  classId: string // Reference đến lớp
  startTime: string // Thời gian bắt đầu
  endTime: string // Thời gian kết thúc
  status?: ELessonStatus // Trạng thái buổi học
}
