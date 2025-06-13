import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { DollarSign } from "lucide-react"
import { EClassStatus } from "@/modules/class/enums/class.enum"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/core/components/ui/select"
import React from "react"

type CustomChangeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  | { target: { name: string; value: string } }

interface BasicInfoTabProps {
  form: {
    name: string
    startDate: string
    status: EClassStatus
    tuition: string
  }
  handleChange: (e: CustomChangeEvent) => void
}

export default function BasicInfoTab({
  form,
  handleChange,
}: BasicInfoTabProps) {
  return (
    <form className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Tên lớp <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Nhập tên lớp"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="startDate"
          className="text-sm font-medium text-gray-700"
        >
          Ngày bắt đầu
        </Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="status" className="text-sm font-medium text-gray-700">
          Trạng thái
        </Label>
        <Select
          value={form.status}
          onValueChange={(value) =>
            handleChange({ target: { name: "status", value } })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EClassStatus.NOT_STARTED}>Chưa mở</SelectItem>
            <SelectItem value={EClassStatus.ACTIVE}>Đang hoạt động</SelectItem>
            <SelectItem value={EClassStatus.ENDED}>Đã kết thúc</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tuition" className="text-sm font-medium text-gray-700">
          Học phí (VNĐ)
        </Label>
        <div className="relative">
          <Input
            id="tuition"
            name="tuition"
            type="text"
            value={form.tuition}
            onChange={handleChange}
            inputMode="numeric"
            pattern="[0-9,]*"
            className="pl-8"
          />
          <DollarSign className="absolute left-2.5 top-3 h-3 w-3 text-primary-500" />
        </div>
      </div>
    </form>
  )
}
