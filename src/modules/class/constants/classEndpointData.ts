import { IEndpoint } from "@/modules/documentation/api/interface/apiEndpoint.interface"
import { EClassStatus } from "../enums/class.enum"

export const CLASS_ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    service: "getAll",
    description: "Lấy danh sách tất cả lớp học",
    parameters: {
      isBeautifyDate: {
        name: "isBeautifyDate",
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
      limit: {
        name: "limit",
        type: "number",
        required: false,
        description: "Số lượng bản ghi tối đa trả về",
        value: 10,
      },
      sortBy: {
        name: "sortBy",
        type: "string",
        required: false,
        description: "Trường để sắp xếp (ví dụ: name, startDate)",
        value: "createdAt",
      },
      sortOrder: {
        name: "sortOrder",
        type: "string",
        required: false,
        description: "Thứ tự sắp xếp (asc hoặc desc)",
        value: "desc",
      },
      lastDoc: {
        name: "lastDoc",
        type: "any",
        required: false,
        description: "Con trỏ phân trang, lấy từ kết quả trước đó",
        value: null,
      },
      status: {
        name: "status",
        type: "string",
        required: false,
        description: "Lọc theo trạng thái lớp học",
        value: "",
      },
    },
  },
  {
    method: "GET",
    service: "getById",
    description: "Lấy thông tin lớp học theo ID",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của lớp học",
        value: "",
      },
      isBeautifyDate: {
        name: "isBeautifyDate",
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
    },
  },
  {
    method: "POST",
    service: "createOrUpdate",
    description: "Tạo mới hoặc cập nhật lớp học",
    parameters: {
      data: {
        name: "data",
        type: "object",
        required: true,
        description: "Dữ liệu lớp học",
        value: {
          name: "Lớp Cờ Vua 1",
          startDate: "01/05/2025",
          endDate: "01/08/2025",
          schedules: ["19:00 - 20:30 Thứ 3", "20:30 - 22:00 Thứ 5"],
          students: [],
          status: EClassStatus.INACTIVE,
          tuition: 1000000,
        },
      },
      isBeautifyDate: {
        name: "isBeautifyDate",
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
    },
  },
  {
    method: "DELETE",
    service: "delete",
    description: "Xóa lớp học",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của lớp học cần xóa",
        value: "",
      },
    },
  },
  {
    method: "POST",
    service: "addStudentsToClass",
    description: "Thêm học sinh vào lớp",
    parameters: {
      classId: {
        name: "classId",
        type: "string",
        required: true,
        description: "ID của lớp học",
        value: "",
      },
      studentIds: {
        name: "studentIds",
        type: "string[]",
        required: true,
        description: "Danh sách ID học sinh",
        value: [],
      },
      isBeautifyDate: {
        name: "isBeautifyDate",
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
    },
  },
]
