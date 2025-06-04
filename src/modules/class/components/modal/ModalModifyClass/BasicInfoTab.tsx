import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Calendar, DollarSign } from "lucide-react"
import { EClassStatus } from "@/modules/class/enums/class.enum"

interface BasicInfoTabProps {
  form: {
    name: string
    startDate: string
    status: EClassStatus
    tuition: string
  }
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
}

export default function BasicInfoTab({
  form,
  handleChange,
}: BasicInfoTabProps) {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-50/30 border-b border-primary-100/50">
        <CardTitle className="text-base text-primary-700 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          Thông tin lớp học
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6 ">
        <div className="space-y-2">
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
            className="bg-white/50 focus:bg-white transition-colors duration-200"
          />
        </div>
        <div className="space-y-2">
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
            className="bg-white/50 focus:bg-white transition-colors duration-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium text-gray-700">
            Trạng thái
          </Label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white/50 focus:bg-white transition-colors duration-200"
          >
            <option value={EClassStatus.NOT_STARTED}>Chưa mở</option>
            <option value={EClassStatus.ACTIVE}>Đang hoạt động</option>
            <option value={EClassStatus.ENDED}>Đã kết thúc</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="tuition"
            className="text-sm font-medium text-gray-700"
          >
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
              className="pl-8 bg-white/50 focus:bg-white transition-colors duration-200"
            />
            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-primary-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
