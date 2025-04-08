import { IEndpoint } from "@/types/api/api.endpoints.interface";

export const TUITION_ENDPOINTS: IEndpoint[] = [
  {
    method: "POST",
    service: "createTuitionForStudent",
    description: "Tạo học phí cho một học sinh",
    parameters: {
      classId: {
        type: "string",
        required: true,
        description: "ID của lớp học",
        value: "",
      },
      studentId: {
        type: "string",
        required: true,
        description: "ID của học sinh",
        value: "",
      },
      month: {
        type: "string",
        required: true,
        description: "Tháng của học phí (format: YYYY-MM)",
        value: "2024-03",
      },
      amount: {
        type: "number",
        required: true,
        description: "Số tiền học phí",
        value: 1000000,
      },
      isBeutifyDate: {
        type: "boolean",
        required: false,
        description: "Có định dạng lại ngày tháng hay không",
        value: true,
      },
    },
  },
];
