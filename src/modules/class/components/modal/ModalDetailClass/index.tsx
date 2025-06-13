import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/core/components/ui/dialog"
import { Button } from "@/core/components/ui/button"
import { Badge } from "@/core/components/ui/badge"
import {
  IClass,
  IStudentClass,
} from "@/modules/class/interfaces/class.interface"
import {
  EClassStatus,
  EStudentClassType,
} from "@/modules/class/enums/class.enum"
import { formatCurrencyVND } from "@/core/utils/currency.util"

interface ModalDetailClassProps {
  open: boolean
  onClose: () => void
  classData: IClass
}

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]

const statusMap: Record<EClassStatus, { label: string; color: string }> = {
  [EClassStatus.NOT_STARTED]: {
    label: "Chưa mở",
    color: "bg-gray-200 text-gray-700",
  },
  [EClassStatus.ACTIVE]: {
    label: "Đang hoạt động",
    color: "bg-green-200 text-green-700",
  },
  [EClassStatus.ENDED]: {
    label: "Đã kết thúc",
    color: "bg-red-200 text-red-700",
  },
}

const ModalDetailClass: React.FC<ModalDetailClassProps> = ({
  open,
  onClose,
  classData,
}) => {
  const [tab, setTab] = React.useState<"info" | "schedule" | "students">("info")

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Chi tiết lớp học</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết về lớp học
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Button
            variant={tab === "info" ? "primary" : "light"}
            onClick={() => setTab("info")}
            aria-label="Thông tin lớp"
            tabIndex={0}
          >
            Thông tin lớp
          </Button>
          <Button
            variant={tab === "schedule" ? "primary" : "light"}
            onClick={() => setTab("schedule")}
            aria-label="Lịch học"
            tabIndex={0}
          >
            Lịch học
          </Button>
          <Button
            variant={tab === "students" ? "primary" : "light"}
            onClick={() => setTab("students")}
            aria-label="Danh sách học sinh"
            tabIndex={0}
          >
            Danh sách học sinh
          </Button>
        </div>
        {tab === "info" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Tên lớp:</span>
              <span>{classData.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Ngày bắt đầu:</span>
              <span>{classData.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Trạng thái:</span>
              <Badge className={statusMap[classData.status].color}>
                {statusMap[classData.status].label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Học phí:</span>
              <span>{formatCurrencyVND(classData.tuition)}</span>
            </div>
          </div>
        )}
        {tab === "schedule" && (
          <div className="space-y-2">
            {classData.schedules && classData.schedules.length > 0 ? (
              classData.schedules.map((sch, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-semibold">Buổi {idx + 1}:</span>
                  <span>{sch}</span>
                </div>
              ))
            ) : (
              <span className="text-gray-500">Chưa có lịch học</span>
            )}
          </div>
        )}
        {tab === "students" && (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 border border-gray-100 rounded-lg bg-white">
            {classData.students && classData.students.length > 0 ? (
              classData.students.map((s, idx) => (
                <div
                  key={s.studentId}
                  className="flex items-center gap-3 p-2 border-b last:border-b-0"
                >
                  <span className="font-semibold">{idx + 1}.</span>
                  <span>Mã học sinh: {s.studentId}</span>
                  <Badge variant="secondary">
                    {s.type === EStudentClassType.FULL
                      ? "Học đầy đủ"
                      : `Học nửa buổi (${s.session || "-"})`}
                  </Badge>
                  <span className="ml-auto">
                    Học phí: {formatCurrencyVND(s.tuition)}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-gray-500">Chưa có học sinh nào</span>
            )}
          </div>
        )}
        <div className="flex justify-end mt-6">
          <Button
            variant="dark"
            onClick={onClose}
            aria-label="Đóng"
            tabIndex={0}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalDetailClass
