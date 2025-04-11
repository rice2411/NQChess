import { IEndpoint } from "@/types/api/apiEndpoint.interface"

export const AUTH_ENDPOINTS: IEndpoint[] = [
  {
    method: "POST",
    service: "login",
    description: "Đăng nhập vào hệ thống",
    parameters: {
      username: {
        name: "username",
        type: "string",
        required: true,
        description: "Tên đăng nhập",
        value: "admin",
      },
      password: {
        name: "password",
        type: "string",
        required: true,
        description: "Mật khẩu",
        value: "Pass123@",
      },
    },
  },
  {
    method: "POST",
    service: "logout",
    description: "Đăng xuất khỏi hệ thống",
    parameters: {},
  },
]
