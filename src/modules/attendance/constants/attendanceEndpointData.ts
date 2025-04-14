import { IEndpoint } from "@/modules/documentation/api/interface/apiEndpoint.interface"

export const ATTENDANCE_ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    service: "getAll",
    description: "Lấy danh sách tất cả các điểm danh",
    parameters: {},
  },
  {
    method: "GET",
    service: "getById",
    description: "Lấy thông tin chi tiết của một điểm danh",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của điểm danh",
      },
    },
  },
  {
    method: "POST",
    service: "create",
    description: "Tạo mới một điểm danh",
    parameters: {
      lessonId: {
        name: "lessonId",
        type: "string",
        required: true,
        description: "ID của buổi học",
      },
      studentId: {
        name: "studentId",
        type: "string",
        required: true,
        description: "ID của học viên",
      },
      status: {
        name: "status",
        type: "string",
        required: true,
        description: "Trạng thái điểm danh (PRESENT/ABSENT/LATE)",
      },
      note: {
        name: "note",
        type: "string",
        required: false,
        description: "Ghi chú",
      },
    },
  },
  {
    method: "PUT",
    service: "update",
    description: "Cập nhật thông tin điểm danh",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của điểm danh",
      },
      status: {
        name: "status",
        type: "string",
        required: false,
        description: "Trạng thái điểm danh (PRESENT/ABSENT/LATE)",
      },
      note: {
        name: "note",
        type: "string",
        required: false,
        description: "Ghi chú",
      },
    },
  },
  {
    method: "DELETE",
    service: "delete",
    description: "Xóa điểm danh",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của điểm danh",
      },
    },
  },
  {
    method: "GET",
    service: "getByLesson",
    description: "Lấy danh sách điểm danh theo buổi học",
    parameters: {
      lessonId: {
        name: "lessonId",
        type: "string",
        required: true,
        description: "ID của buổi học",
      },
    },
  },
  {
    method: "GET",
    service: "getByStudent",
    description: "Lấy danh sách điểm danh theo học viên",
    parameters: {
      studentId: {
        name: "studentId",
        type: "string",
        required: true,
        description: "ID của học viên",
      },
    },
  },
  {
    method: "GET",
    service: "getByDate",
    description: "Lấy danh sách điểm danh theo ngày",
    parameters: {
      date: {
        name: "date",
        type: "string",
        required: true,
        description: "Ngày cần lấy điểm danh (format: YYYY-MM-DD)",
      },
    },
  },
]
