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
    service: "createOrUpdateClass",
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
        value: "2024-01-01",
      },
      endDate: {
        type: "string",
        required: true,
        description: "Ngày kết thúc",
        value: "2024-12-31",
      },
      schedule: {
        type: "object",
        required: true,
        description: "Lịch học",
        value: {
          days: ["MONDAY", "WEDNESDAY"],
          startTime: "18:00",
          endTime: "19:30",
        },
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
    method: "PUT",
    service: "updateClass",
    description: "Cập nhật thông tin lớp học",
    parameters: {
      id: {
        type: "string",
        required: true,
        description: "ID của lớp học cần cập nhật",
        value: "",
      },
      data: {
        type: "object",
        required: true,
        description: "Dữ liệu cập nhật",
        value: {},
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
    service: "updateClassStudents",
    description: "Thêm hoặc xóa học sinh khỏi lớp học",
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
        description: "ID của học sinh",
        value: "",
      },
      isAdd: {
        type: "boolean",
        required: true,
        description: "Thêm (true) hoặc xóa (false) học sinh",
        value: true,
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
