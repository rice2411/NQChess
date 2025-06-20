export interface Column<T> {
  key: keyof T | string
  title: string
  renderCell?: (row: T, index: number) => React.ReactNode
  className?: string
}

export interface FilterOption {
  key: string
  label: string
  type: "select" | "text" | "number"
  options?: { label: string; value: any }[] // cho select
}

export interface BaseTableProps<T> {
  columns: Column<T>[]
  data: T[]
  addButton?: React.ReactNode
  renderAction?: (row: T) => React.ReactNode
  isLoading?: boolean
  isError?: boolean
  filters?: FilterOption[]
  itemsPerPage?: number
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
}
