import { IEndpoint } from "@/modules/documentation/api/interface/apiEndpoint.interface"
import { ETuitionStatus } from "@/modules/tuition/enum/tuition.enum"

export const TUITION_ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    service: "getAll",
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
    service: "getById",
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
    service: "getByStudentId",
    description: "Lấy danh sách học phí theo ID học sinh",
    parameters: {
      studentId: {
        name: "studentId",
        type: "string",
        required: true,
        description: "ID của học sinh",
        value: "",
      },
    },
  },
  {
    method: "GET",
    service: "getByClassId",
    description: "Lấy danh sách học phí theo ID lớp học",
    parameters: {
      classId: {
        name: "classId",
        type: "string",
        required: true,
        description: "ID của lớp học",
        value: "",
      },
    },
  },
  {
    method: "POST",
    service: "createForStudent",
    description: "Tạo học phí cho học sinh",
    parameters: {
      data: {
        name: "data",
        type: "object",
        required: true,
        description: "Dữ liệu học phí",
        value: {
          classId: "",
          studentId: "",
          amount: 1000000,
          month: "2024-03",
          status: ETuitionStatus.PENDING,
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
    method: "PUT",
    service: "changeStatus",
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
    service: "delete",
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
