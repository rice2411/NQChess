export interface IGetRequest {
  isBeautifyDate?: boolean
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  lastDoc?: any
}
