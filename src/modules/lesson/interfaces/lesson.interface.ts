import { ELessonStatus } from "@/modules/lesson/enums/lesson.enum"
import { IBaseEntity } from "../../../core/types/common/entity.interface"

export interface ILesson extends IBaseEntity {
  title: string // Tiêu đề buổi học
  description?: string // Mô tả buổi học
  classId: string // Reference đến lớp
  startDate: string // Thời gian bắt đầu
  endDate: string // Thời gian kết thúc
  status?: ELessonStatus // Trạng thái buổi học
}
