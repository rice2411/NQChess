import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Label } from "@/core/components/ui/label"
import { Calendar, Clock } from "lucide-react"
import { IClass } from "@/modules/class/interfaces/class.interface"
import { formatCurrencyVND } from "@/core/utils/currency.util"

interface GeneralInfoTabProps {
  classData: IClass
}

export default function GeneralInfoTab({ classData }: GeneralInfoTabProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-50/30 border-b border-primary-100/50">
          <CardTitle className="text-base text-primary-700 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <p className="text-xs text-gray-500 mb-1">Ngày bắt đầu</p>
              <p className="text-sm font-medium">{classData.startDate}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <p className="text-xs text-gray-500 mb-1">Học phí mặc định</p>
              <p className="text-sm font-medium">
                {formatCurrencyVND(classData.tuition.toString())} VNĐ
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <p className="text-xs text-gray-500 mb-1">Tổng số học sinh</p>
              <p className="text-sm font-medium">{classData.students.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-50/30 border-b border-primary-100/50">
          <CardTitle className="text-base text-primary-700 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            Lịch học
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {classData.schedules.map((schedule, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <Label className="font-bold text-primary-600">
                  Buổi {index + 1}
                </Label>
                <span>{schedule}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
