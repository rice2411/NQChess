import React from "react"
import {  Plus, Search } from "lucide-react"

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
}

export default function BaseTable<T extends { id: string | number }>({
  columns,
  data,
  addButton,
  renderAction,
}: BaseTableProps<T>) {
  const allColumns = renderAction
    ? [
        ...columns,
        {
          key: "actions",
          title: "Tùy chọn",
          renderCell: renderAction,
        },
      ]
    : columns;

  return (
    <div className="dashboard-orders bg-white rounded-2xl h-auto w-full p-4 sm:p-6 md:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row items-center mb-4 sm:mb-6 gap-2 sm:gap-3">
        <div className="relative w-full md:w-1/3">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border border-gray-300 rounded-full pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition outline-none shadow-sm text-sm sm:text-base"
          />
        </div>

        {addButton ? (
          addButton
        ) : (
          <button className="ml-0 md:ml-auto bg-green-500 text-white px-4 sm:px-5 py-2 rounded-full hover:bg-green-600 shadow-lg transition flex items-center gap-2 mt-2 md:mt-0 font-semibold text-sm sm:text-base">
            <Plus className="h-5 w-5" />
            Thêm mới
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl shadow bg-white border border-gray-100">
        <table className="min-w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
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
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b last:border-b-0 hover:bg-primary-50/60 transition group"
              >
                {allColumns.map((col, index) => (
                  <td
                    key={col.key as string}
                    className="py-3 sm:py-4 px-3 sm:px-5"
                  >
                    {col.renderCell
                      ? col.renderCell(row, index)
                      : (row[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
