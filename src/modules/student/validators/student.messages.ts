export const STUDENT_MESSAGES = {
  // Validation messages
  INVALID_NAME: "Tên học sinh không được để trống và phải từ 2 đến 50 ký tự",
  INVALID_PHONE: "Số điện thoại không hợp lệ",
  INVALID_DOB: "Ngày sinh không hợp lệ",
  INVALID_GENDER: "Giới tính không hợp lệ",
  INVALID_CLASSES: "Danh sách lớp không hợp lệ",
  MISSING_REQUIRED_FIELDS:
    "Thiếu thông tin bắt buộc: tên, ngày sinh, số điện thoại",

  // Error messages
  STUDENT_NOT_FOUND: "Không tìm thấy học sinh",
  CREATE_FAILED: "Thêm học sinh thất bại",
  UPDATE_FAILED: "Cập nhật thông tin học sinh thất bại",
  DELETE_FAILED: "Xóa học sinh thất bại",

  // Success messages
  CREATE_SUCCESS: "Thêm học sinh thành công",
  UPDATE_SUCCESS: "Cập nhật thông tin học sinh thành công",
  DELETE_SUCCESS: "Xóa học sinh thành công",
} as const
