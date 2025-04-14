import { IEndpoint } from "@/modules/documentation/api/interface/apiEndpoint.interface"
import { EUserRole } from "../enums/user.enum"

export const USER_ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    service: "getAll",
    description: "Lấy danh sách tất cả người dùng",
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
        description: "Số lượng bản ghi tối đa trả về (tối thiểu là 1)",
        value: 10,
      },
      sortBy: {
        name: "sortBy",
        type: "string",
        required: false,
        description: "Trường để sắp xếp (ví dụ: username, createdAt)",
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
      search: {
        name: "search",
        type: "string",
        required: false,
        description: "Từ khóa tìm kiếm theo username",
        value: "",
      },
    },
  },
  {
    method: "GET",
    service: "getById",
    description: "Lấy thông tin người dùng theo ID",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của người dùng",
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
    service: "getByUsername",
    description: "Lấy thông tin người dùng theo username",
    parameters: {
      username: {
        name: "username",
        type: "string",
        required: true,
        description: "Username của người dùng",
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
    service: "createOrUpdater",
    description: "Tạo mới hoặc cập nhật người dùng",
    parameters: {
      data: {
        name: "data",
        type: "object",
        required: true,
        description: "Dữ liệu người dùng",
        value: {
          username: "",
          password: "",
          role: EUserRole.TEACHER,
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
    description: "Xóa người dùng",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: true,
        description: "ID của người dùng cần xóa",
        value: "",
      },
    },
  },
]
