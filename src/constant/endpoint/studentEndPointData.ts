import { IEndpoint } from "@/types/api/apiEndpoint.interface"
import { EGender } from "@/enum/student.enum"

export const STUDENT_ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    service: "getStudents",
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
    method: "POST",
    service: "createOrUpdateStudent",
    description: "Tạo mới hoặc cập nhật học sinh",
    parameters: {
      id: {
        name: "id",
        type: "string",
        required: false,
        description: "ID của học sinh (nếu cập nhật)",
        value: "",
      },
      fullName: {
        name: "fullName",
        type: "string",
        required: true,
        description: "Họ và tên học sinh",
        value: "Nguyễn Văn A",
      },
      dateOfBirth: {
        name: "dateOfBirth",
        type: "string",
        required: true,
        description: "Ngày sinh",
        value: "2010-01-01",
      },
      phoneNumber: {
        name: "phoneNumber",
        type: "string",
        required: true,
        description: "Số điện thoại",
        value: "0123456789",
      },
      gender: {
        name: "gender",
        type: "string",
        required: true,
        description: "Giới tính",
        value: EGender.MALE,
      },
      avatar: {
        name: "avatar",
        type: "string",
        required: false,
        description: "Ảnh đại diện",
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
    service: "searchStudent",
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
    service: "deleteStudent",
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
