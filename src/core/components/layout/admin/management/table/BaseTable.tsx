"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import type { BaseTableProps } from "./BaseTable.types"
import { FilterDropdown } from "./FilterDropdown"

export default function BaseTable<T extends { id: string | number }>({
  columns,
  data,
  addButton,
  renderAction,
  isLoading,
  isError,
  filters = [],
  itemsPerPage = 10,
  searchPlaceholder = "Tìm kiếm...",
  searchKeys,
}: BaseTableProps<T>) {
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [pendingFilterValues, setPendingFilterValues] = useState<
    Record<string, any>
  >({})
  const dropdownRef = useRef<any>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const allColumns = useMemo(
    () =>
      renderAction
        ? [
            ...columns,
            {
              key: "actions",
              title: "Tùy chọn",
              renderCell: renderAction,
            },
          ]
        : columns,
    [columns, renderAction]
  )

  // Lọc data theo search và filter
  const filteredData = useMemo(() => {
    let result = data
    // Lọc theo filter nâng cao
    filters.forEach((filter) => {
      const value = filterValues[filter.key]
      if (value !== undefined && value !== "" && value !== null) {
        result = result.filter((row) => {
          const rowValue = row[filter.key as keyof T]
          if (filter.type === "select") return rowValue === value
          if (filter.type === "number")
            return Number(rowValue) === Number(value)
          if (filter.type === "text")
            return String(rowValue)
              .toLowerCase()
              .includes(String(value).toLowerCase())
          return true
        })
      }
    })

    // Lọc theo search toàn cục
    if (!search.trim()) return result
    const lowerSearch = search.toLowerCase()

    const keysToSearch = searchKeys || allColumns.map((c) => c.key as keyof T)

    return result.filter((row) =>
      keysToSearch.some((key) => {
        const value = row[key]
        if (typeof value === "string" || typeof value === "number") {
          return String(value).toLowerCase().includes(lowerSearch)
        }
        return false
      })
    )
  }, [search, data, allColumns, filters, filterValues, searchKeys])

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = useMemo(
    () => filteredData.slice(startIndex, endIndex),
    [filteredData, startIndex, endIndex]
  )

  // Reset page khi search hoặc filter thay đổi
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterValues])

  // Khi mở dropdown, đồng bộ pendingFilterValues với filterValues
  const handleOpenChange = (open: boolean) => {
    if (open) setPendingFilterValues(filterValues)
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    const halfPagesToShow = Math.floor(maxPagesToShow / 2)

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else if (currentPage <= halfPagesToShow) {
      for (let i = 1; i <= maxPagesToShow; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push("...")
      pageNumbers.push(totalPages)
    } else if (currentPage > totalPages - halfPagesToShow) {
      pageNumbers.push(1)
      pageNumbers.push("...")
      for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)
      pageNumbers.push("...")
      for (
        let i = currentPage - halfPagesToShow;
        i <= currentPage + halfPagesToShow;
        i++
      ) {
        pageNumbers.push(i)
      }
      pageNumbers.push("...")
      pageNumbers.push(totalPages)
    }
    return pageNumbers
  }

  return (
    <div className="w-full h-auto p-4 bg-white shadow-xl dashboard-orders rounded-2xl sm:p-6 md:p-8">
      <div className="flex flex-col items-center gap-2 mb-4 md:flex-row sm:mb-6 sm:gap-3">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="py-2 pl-10 pr-4 "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {filters.length > 0 && (
          <FilterDropdown
            filters={filters}
            pendingFilterValues={pendingFilterValues}
            setPendingFilterValues={setPendingFilterValues}
            setFilterValues={setFilterValues}
            dropdownRef={dropdownRef}
            handleOpenChange={handleOpenChange}
          />
        )}

        {addButton && (
          addButton
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
            ) : currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="py-6 text-base italic text-center text-gray-500 sm:py-8 md:py-10 sm:text-lg"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              currentData.map((row, rowIndex) => (
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
                        ? col.renderCell(row, startIndex + rowIndex)
                        : (row[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Hiển thị {startIndex + 1} đến{" "}
            {Math.min(endIndex, filteredData.length)} trong tổng số{" "}
            {filteredData.length} mục
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="light"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </Button>
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-2 py-1">
                    ...
                  </span>
                ) : (
                  <Button
                    key={index}
                    variant={currentPage === page ? "primary" : "light"}
                    size="sm"
                    onClick={() => setCurrentPage(page as number)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="light"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
