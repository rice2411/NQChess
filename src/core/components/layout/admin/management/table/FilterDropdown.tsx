import React from "react"
import { Button } from "@/core/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/core/components/ui/dropdown-menu"
import { Filter } from "lucide-react"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import type { FilterOption } from "./BaseTable.types"

interface FilterDropdownProps {
  filters: FilterOption[]
  pendingFilterValues: Record<string, any>
  setPendingFilterValues: React.Dispatch<
    React.SetStateAction<Record<string, any>>
  >
  setFilterValues: React.Dispatch<React.SetStateAction<Record<string, any>>>
  dropdownRef: React.RefObject<any>
  handleOpenChange: (open: boolean) => void
}

export function FilterDropdown({
  filters,
  pendingFilterValues,
  setPendingFilterValues,
  setFilterValues,
  dropdownRef,
  handleOpenChange,
}: FilterDropdownProps) {
  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="info"
          size="sm"
          className="flex items-center gap-2 p-3"
        >
          <Filter className="w-4 h-4" />
          Lọc nâng cao
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="p-4 min-w-[250px] flex flex-col gap-3"
        ref={dropdownRef}
      >
        {filters.map((filter) => (
          <div key={filter.key} className="min-w-[180px] flex flex-col gap-1">
            <Label className="mb-0.5">{filter.label}</Label>
            {filter.type === "select" ? (
              <select
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border rounded-md focus:ring-2 focus:ring-primary-400"
                value={pendingFilterValues[filter.key] ?? ""}
                onChange={(e) =>
                  setPendingFilterValues((prev) => ({
                    ...prev,
                    [filter.key]: e.target.value,
                  }))
                }
              >
                {filter.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                type={filter.type === "number" ? "number" : "text"}
                value={pendingFilterValues[filter.key] ?? ""}
                onChange={(e) =>
                  setPendingFilterValues((prev) => ({
                    ...prev,
                    [filter.key]: e.target.value,
                  }))
                }
                placeholder={filter.label}
              />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setFilterValues(pendingFilterValues)
              if (dropdownRef.current) {
                dropdownRef.current.blur?.()
              }
              document.activeElement?.dispatchEvent(new Event("blur"))
            }}
          >
            Áp dụng
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPendingFilterValues({})
              setFilterValues({})
              if (dropdownRef.current) {
                dropdownRef.current.blur?.()
              }
              document.activeElement?.dispatchEvent(new Event("blur"))
            }}
          >
            Hủy bỏ
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
