import React from "react"

interface Column<T> {
  key: keyof T | string
  title: string
  render?: (value: any, record: T, index: number) => React.ReactNode
  className?: string
}

interface BaseTableProps<T> {
  columns: Column<T>[]
  data: T[]
  renderAction?: (record: T, index: number) => React.ReactNode
}

export function BaseTable<T extends { id: string | number }>({
  columns,
  data,
  renderAction,
}: BaseTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl shadow bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-700">
            {columns.map((col) => (
              <th
                key={col.key as string}
                className={`py-3 px-4 font-semibold text-left ${
                  col.className || ""
                }`}
              >
                {col.title}
              </th>
            ))}
            {renderAction && (
              <th className="py-3 px-4 font-semibold text-left">Thao tác</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((record, idx) => (
            <tr
              key={record.id}
              className="border-b last:border-b-0 hover:bg-gray-50 transition"
            >
              {columns.map((col) => (
                <td key={col.key as string} className="py-3 px-4">
                  {col.render
                    ? col.render((record as any)[col.key], record, idx)
                    : (record as any)[col.key]}
                </td>
              ))}
              {renderAction && (
                <td className="py-3 px-4">{renderAction(record, idx)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
