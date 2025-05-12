export interface IGetRequest {
  id?: string
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  lastDoc?: any
}
