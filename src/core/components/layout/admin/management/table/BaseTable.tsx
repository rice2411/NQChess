"use client"

import React, { useState, useMemo } from "react"
import { Plus, Search } from "lucide-react"

interface Column<T> {
  key: keyof T | string
  title: string
  renderCell?: (row: T, index: number) => React.ReactNode
  className?: string
}

interface BaseTableProps<T> {
  columns: Column<T>[]
  data: T[]
  addButton?: React.ReactNode
  renderAction?: (row: T) => React.ReactNode
  isLoading?: boolean
  isError?: boolean
}

export default function BaseTable<T extends { id: string | number }>({
  columns,
  data,
  addButton,
  renderAction,
  isLoading,
  isError,
}: BaseTableProps<T>) {
  const [search, setSearch] = useState("")

  const allColumns = renderAction
    ? [
        ...columns,
        {
          key: "actions",
          title: "Tùy chọn",
          renderCell: renderAction,
        },
      ]
    : columns

  // Lọc data theo search
  const filteredData = useMemo(() => {
    if (!search.trim()) return data
    const lowerSearch = search.toLowerCase()
    return data.filter((row) =>
      allColumns.some((col) => {
        const value = row[col.key as keyof T]
        if (typeof value === "string" || typeof value === "number") {
          return String(value).toLowerCase().includes(lowerSearch)
        }
        return false
      })
    )
  }, [search, data, allColumns])

  return (
    <div className="w-full h-auto p-4 bg-white shadow-xl dashboard-orders rounded-2xl sm:p-6 md:p-8">
      <div className="flex flex-col items-center gap-2 mb-4 md:flex-row sm:mb-6 sm:gap-3">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full py-2 pl-10 pr-4 text-sm transition border border-gray-300 rounded-full shadow-sm outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 sm:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {addButton ? (
          addButton
        ) : (
          <button className="flex items-center gap-2 px-4 py-2 mt-2 ml-0 text-sm font-semibold text-white transition bg-green-500 rounded-full shadow-lg md:ml-auto sm:px-5 hover:bg-green-600 md:mt-0 sm:text-base">
            <Plus className="w-5 h-5" />
            Thêm mới
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white border border-gray-100 shadow rounded-2xl">
        <table className="min-w-full text-xs sm:text-sm">
          <thead>
            <tr className="text-gray-700 bg-gray-100 border-b border-gray-200">
              {allColumns.map((col, idx) => (
                <th
                  key={col.key as string}
                  className={`py-3 sm:py-4 px-3 sm:px-5 font-bold text-left ${
                    idx === 0 ? "rounded-tl-2xl" : ""
                  } ${idx === allColumns.length - 1 ? "rounded-tr-2xl" : ""} ${
                    col.className || ""
                  }`}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="py-6 text-base text-center sm:py-8 md:py-10 sm:text-lg"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="py-6 text-base text-center text-red-500 sm:py-8 md:py-10 sm:text-lg"
                >
                  Lỗi tải dữ liệu
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="py-6 text-base italic text-center text-gray-500 sm:py-8 md:py-10 sm:text-lg"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className="transition border-b last:border-b-0 hover:bg-primary-50/60 group"
                >
                  {allColumns.map((col) => (
                    <td
                      key={col.key as string}
                      className="px-3 py-3 sm:py-4 sm:px-5"
                    >
                      {col.renderCell
                        ? col.renderCell(row, rowIndex)
                        : (row[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
