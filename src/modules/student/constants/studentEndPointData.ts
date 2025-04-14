import { IEndpoint } from "@/modules/documentation/api/interface/apiEndpoint.interface"
import { EGender } from "@/modules/student/enum/student.enum"

export const STUDENT_ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    service: "getAll",
    description: "Lấy danh sách tất cả học sinh",
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
        description: "Trường để sắp xếp (ví dụ: fullName, dateOfBirth)",
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
    },
  },
  {
    method: "GET",
    service: "getById",
    description: "Lấy thông tin học sinh theo ID",
    parameters: {
      id: {
        name: "id",
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
    method: "POST",
    service: "createOrUpdate",
    description: "Tạo mới hoặc cập nhật học sinh",
    parameters: {
      data: {
        name: "data",
        type: "object",
        required: true,
        description: "Dữ liệu học sinh",
        value: {
          fullName: "Nguyễn Văn A",
          dateOfBirth: "2010-01-01",
          phoneNumber: "0123456789",
          gender: EGender.MALE,
          avatar: "",
          classes: [],
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
    method: "GET",
    service: "absoluteSearch",
    description: "Tìm kiếm học sinh",
    parameters: {
      fullName: {
        name: "fullName",
        type: "string",
        required: false,
        description: "Họ và tên học sinh",
        value: "",
      },
      dateOfBirth: {
        name: "dateOfBirth",
        type: "string",
        required: false,
        description: "Ngày sinh",
        value: "",
      },
      phoneNumber: {
        name: "phoneNumber",
        type: "string",
        required: false,
        description: "Số điện thoại",
        value: "",
      },
    },
  },
  {
    method: "DELETE",
    service: "delete",
    description: "Xóa học sinh",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của học sinh cần xóa",
        value: "",
      },
    },
  },
]
