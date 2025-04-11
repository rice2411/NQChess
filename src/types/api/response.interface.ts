export interface ISuccessResponse<T> {
  success: true
  message: string
  data: T | null
}

export interface IErrorResponse {
  success: false
  errorCode: string
  message: string
}
