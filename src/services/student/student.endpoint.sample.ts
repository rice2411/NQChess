import { IEndpoint } from "@/types/api/api.endpoints.interface";
import { EGender } from "@/types/domain/student/student.enum";

export const STUDENT_ENDPOINTS: IEndpoint[] = [
  {
    method: "GET",
    service: "getStudents",
    description: "Lấy danh sách tất cả học sinh",
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
    service: "createOrUpdateStudent",
    description: "Tạo mới hoặc cập nhật học sinh",
    parameters: {
      isBeutifyDate: {
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
      phoneNumber: {
        type: "string",
        required: true,
        description: "Số điện thoại",
        value: "0776750418",
      },
      fullName: {
        type: "string",
        required: true,
        description: "Họ và tên học sinh",
        value: "Tôn Thất Anh Minh",
      },
      dateOfBirth: {
        type: "string",
        required: true,
        description: "Ngày sinh",
        value: "24/11/2001",
      },
      avatar: {
        type: "string",
        required: true,
        description: "Ảnh đại diện",
        value: "https://picsum.photos/200/300",
      },
      gender: {
        type: "string",
        required: true,
        description: "Giới tính",
        value: EGender.FEMALE,
      },
    },
  },
  {
    method: "GET",
    service: "searchStudent",
    description: "Tìm kiếm học sinh theo tiêu chí",
    parameters: {
      fullName: {
        type: "string",
        required: true,
        description: "Họ và tên học sinh",
        value: "Tôn Thất Anh Minh",
      },
      dateOfBirth: {
        type: "string",
        required: true,
        description: "Ngày sinh",
        value: "24/11/2001",
      },
      isBeutifyDate: {
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
      phoneNumber: {
        type: "string",
        required: true,
        description: "Số điện thoại",
        value: "0776750418",
      },
    },
  },
  {
    method: "DELETE",
    service: "deleteStudent",
    description: "Xóa học sinh",
    parameters: {
      id: {
        type: "string",
        required: true,
        description: "ID của học sinh cần xóa",
        value: "",
      },
    },
  },
];
