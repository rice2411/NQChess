import { IEndpoint } from "@/modules/documentation/api/interface/apiEndpoint.interface"

export const LESSON_ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    service: "getAll",
    description: "Lấy danh sách tất cả các buổi học",
    parameters: {},
  },
  {
    method: "GET",
    service: "getById",
    description: "Lấy thông tin chi tiết của một buổi học",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của buổi học",
      },
    },
  },
  {
    method: "POST",
    service: "create",
    description: "Tạo mới một buổi học",
    parameters: {
      title: {
        name: "title",
        type: "string",
        required: true,
        description: "Tiêu đề buổi học",
      },
      description: {
        name: "description",
        type: "string",
        required: false,
        description: "Mô tả buổi học",
      },
      startTime: {
        name: "startTime",
        type: "string",
        required: true,
        description: "Thời gian bắt đầu",
      },
      endTime: {
        name: "endTime",
        type: "string",
        required: true,
        description: "Thời gian kết thúc",
      },
      teacherId: {
        name: "teacherId",
        type: "string",
        required: true,
        description: "ID của giáo viên",
      },
      classId: {
        name: "classId",
        type: "string",
        required: true,
        description: "ID của lớp học",
      },
    },
  },
  {
    method: "PUT",
    service: "update",
    description: "Cập nhật thông tin buổi học",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của buổi học",
      },
      title: {
        name: "title",
        type: "string",
        required: false,
        description: "Tiêu đề buổi học",
      },
      description: {
        name: "description",
        type: "string",
        required: false,
        description: "Mô tả buổi học",
      },
      startTime: {
        name: "startTime",
        type: "string",
        required: false,
        description: "Thời gian bắt đầu",
      },
      endTime: {
        name: "endTime",
        type: "string",
        required: false,
        description: "Thời gian kết thúc",
      },
    },
  },
  {
    method: "DELETE",
    service: "delete",
    description: "Xóa buổi học",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của buổi học",
      },
    },
  },
  {
    method: "GET",
    service: "getByTeacher",
    description: "Lấy danh sách buổi học theo giáo viên",
    parameters: {
      teacherId: {
        name: "teacherId",
        type: "string",
        required: true,
        description: "ID của giáo viên",
      },
    },
  },
  {
    method: "GET",
    service: "getByStudent",
    description: "Lấy danh sách buổi học theo học viên",
    parameters: {
      studentId: {
        name: "studentId",
        type: "string",
        required: true,
        description: "ID của học viên",
      },
    },
  },
]
