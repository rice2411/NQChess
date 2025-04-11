import { IEndpoint } from "@/types/api/apiEndpoint.interface"
import { ETuitionStatus } from "@/enum/tuition.enum"

export const TUITION_ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    service: "getTuitions",
    description: "Lấy danh sách tất cả học phí",
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
        description: "Trường để sắp xếp (ví dụ: amount, month)",
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
        description: "Lọc theo trạng thái học phí",
        value: "",
      },
      classId: {
        name: "classId",
        type: "string",
        required: false,
        description: "Lọc theo mã lớp học",
        value: "",
      },
      studentId: {
        name: "studentId",
        type: "string",
        required: false,
        description: "Lọc theo mã học sinh",
        value: "",
      },
    },
  },
  {
    method: "GET",
    service: "getTuitionById",
    description: "Lấy thông tin học phí theo ID",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của học phí",
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
    method: "GET",
    service: "getTuitionsByStudentId",
    description: "Lấy danh sách học phí theo ID học sinh",
    parameters: {
      studentId: {
        name: "studentId",
        type: "string",
        required: true,
        description: "ID của học sinh",
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
    method: "GET",
    service: "getTuitionsByClassId",
    description: "Lấy danh sách học phí theo ID lớp học",
    parameters: {
      classId: {
        name: "classId",
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
    service: "createTuitionForStudent",
    description: "Tạo học phí cho học sinh",
    parameters: {
      classId: {
        name: "classId",
        type: "string",
        required: true,
        description: "ID của lớp học",
        value: "",
      },
      studentId: {
        name: "studentId",
        type: "string",
        required: true,
        description: "ID của học sinh",
        value: "",
      },
      month: {
        name: "month",
        type: "string",
        required: true,
        description: "Tháng của học phí (format: YYYY-MM)",
        value: "2024-03",
      },
      amount: {
        name: "amount",
        type: "number",
        required: true,
        description: "Số tiền học phí",
        value: 1000000,
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
    method: "PUT",
    service: "changeStatusTuition",
    description: "Cập nhật trạng thái học phí",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của học phí",
        value: "",
      },
      status: {
        name: "status",
        type: "string",
        required: true,
        description: "Trạng thái học phí",
        value: ETuitionStatus.PAID,
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
    service: "deleteTuition",
    description: "Xóa học phí",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của học phí cần xóa",
        value: "",
      },
    },
  },
]
