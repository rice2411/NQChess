import { IEndpoint } from "@/types/api/api.endpoints.interface";
import { EClassStatus } from "@/types/domain/class/class.enum";

export const CLASS_ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    service: "getClasses",
    description: "Lấy danh sách tất cả lớp học",
    parameters: {
      isBeutifyDate: {
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
    },
  },
  {
    method: "POST",
    service: "createClass",
    description: "Tạo mới hoặc cập nhật lớp học",
    parameters: {
      id: {
        type: "string",
        required: false,
        description: "ID của lớp học (nếu cập nhật)",
        value: "",
      },
      name: {
        type: "string",
        required: true,
        description: "Tên lớp học",
        value: "Lớp Cờ Vua 1",
      },
      startDate: {
        type: "string",
        required: true,
        description: "Ngày bắt đầu",
        value: "2025-01-01",
      },
      endDate: {
        type: "string",
        required: true,
        description: "Ngày kết thúc",
        value: "2025-03-01",
      },
      schedules: {
        type: "array",
        required: true,
        description: "Lịch học",
        value: ["19:00 - 20:30 Thứ 3", "20:30 - 22:00 Thứ 5"],
      },
      students: {
        type: "array",
        required: false,
        description: "Danh sách ID học sinh",
        value: [],
      },
      status: {
        type: "string",
        required: false,
        description: "Trạng thái lớp học",
        value: EClassStatus.INACTIVE,
      },
      isBeutifyDate: {
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
      tuition: {
        type: "number",
        required: false,
        description: "Học phí lớp học",
        value: 1000000,
      },
    },
  },
  {
    method: "GET",
    service: "getClassById",
    description: "Lấy thông tin lớp học theo ID",
    parameters: {
      id: {
        type: "string",
        required: true,
        description: "ID của lớp học",
        value: "",
      },
      isBeutifyDate: {
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
    },
  },
  {
    method: "DELETE",
    service: "deleteClass",
    description: "Xóa lớp học",
    parameters: {
      id: {
        type: "string",
        required: true,
        description: "ID của lớp học cần xóa",
        value: "",
      },
    },
  },
  {
    method: "PUT",
    service: "addStudentsToClass",
    description: "Thêm  học sinh khỏi lớp học",
    parameters: {
      classId: {
        type: "string",
        required: true,
        description: "ID của lớp học",
        value: "",
      },
      studentId: {
        type: "string",
        required: true,
        description: "danh sách ID của học sinh",
        value: [],
      },
      isBeutifyDate: {
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
    },
  },
];
