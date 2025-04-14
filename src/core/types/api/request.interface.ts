export interface IGetRequest {
  id?: string
  isBeautifyDate?: boolean
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  lastDoc?: any
}
