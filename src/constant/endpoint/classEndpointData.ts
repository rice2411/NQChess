import { IEndpoint } from "@/types/api/apiEndpoint.interface"
import { EClassStatus } from "@/enum/class.enum"

export const CLASS_ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    service: "getClasses",
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
    method: "POST",
    service: "createClass",
    description: "Tạo mới hoặc cập nhật lớp học",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: false,
        description: "ID của lớp học (nếu cập nhật)",
        value: "",
      },
      name: {
        name: "name",
        type: "string",
        required: true,
        description: "Tên lớp học",
        value: "Lớp Cờ Vua 1",
      },
      startDate: {
        name: "startDate",
        type: "string",
        required: true,
        description: "Ngày bắt đầu",
        value: "2025-01-01",
      },
      endDate: {
        name: "endDate",
        type: "string",
        required: true,
        description: "Ngày kết thúc",
        value: "2025-03-01",
      },
      schedules: {
        name: "schedules",
        type: "array",
        required: true,
        description: "Lịch học",
        value: ["19:00 - 20:30 Thứ 3", "20:30 - 22:00 Thứ 5"],
      },
      students: {
        name: "students",
        type: "array",
        required: false,
        description: "Danh sách ID học sinh",
        value: [],
      },
      status: {
        name: "status",
        type: "string",
        required: false,
        description: "Trạng thái lớp học",
        value: EClassStatus.INACTIVE,
      },
      isBeautifyDate: {
        name: "isBeautifyDate",
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
      tuition: {
        name: "tuition",
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
    method: "DELETE",
    service: "deleteClass",
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
      id: {
        name: "classId",
        type: "string",
        required: true,
        description: "ID của lớp học",
        value: "i6b5WkoGNKpQGVspfPVe",
      },
      studentIds: {
        name: "studentIds",
        type: "string[]",
        required: true,
        description: "Danh sách ID học sinh",
        value: ["GZYgGfJ34SoPTKxwVabg"],
      },
    },
  },
]
