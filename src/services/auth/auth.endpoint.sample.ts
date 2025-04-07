import { IEndpoint } from "@/types/api/api.endpoints.interface";

export const AUTH_ENDPOINTS: IEndpoint[] = [
  {
    method: "POST",
    service: "login",
    description: "Đăng nhập bằng email và password",
    parameters: {
      username: {
        type: "string",
        required: true,
        description: "Tên đăng nhập",
        value: "admin",
      },
      password: {
        type: "string",
        required: true,
        description: "Mật khẩu",
        value: "Pass123@",
      },
    },
  },
];
