import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/components/ui/dialog"
import { IAttendance } from "@/modules/attendance/interfaces/attendance.interface"
import { useState, useEffect } from "react"
import { Button } from "@/core/components/ui/button"
import { useLessonQueries } from "@/modules/lesson/hooks/useLessonQueries"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import { Label } from "@/core/components/ui/label"
import { Textarea } from "@/core/components/ui/textarea"
import { Input } from "@/core/components/ui/input"

interface AttendanceModalProps {
  open: boolean
  onClose: () => void
  initialData: IAttendance | null
  onSave: (a: IAttendance) => void
}

export default function AttendanceModal({
  open,
  onClose,
  initialData,
  onSave,
}: AttendanceModalProps) {
  const [form, setForm] = useState<IAttendance>(
    initialData || ({} as IAttendance)
  )

  const { getAllQuery: lessonQuery } = useLessonQueries()
  const { getAllQuery: studentQuery } = useStudentQueries()

  useEffect(() => {
    setForm(initialData || ({} as IAttendance))
    lessonQuery.refetch()
    studentQuery.refetch()
  }, [initialData])

  const lessons = lessonQuery.data?.success ? lessonQuery.data.data || [] : []
  const students = studentQuery.data?.success
    ? studentQuery.data.data || []
    : []

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh giá buổi học</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="mb-1 font-semibold" htmlFor="lessonId">
              Buổi học
            </Label>
            <Input
              id="lessonId"
              className="w-full p-2 border rounded-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={lessons.find((l) => l.id === form.lessonId)?.title || ""}
              disabled
            ></Input>
          </div>
          <div>
            <Label className="mb-1 font-semibold" htmlFor="studentId">
              Học sinh
            </Label>
            <Input
              id="studentId"
              className="w-full p-2 border rounded-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={
                students.find((s) => s.id === form.studentId)?.fullName || ""
              }
              disabled
            ></Input>
          </div>

          <div>
            <Label className="mb-1 font-semibold" htmlFor="note">
              Ghi chú
            </Label>
            <Textarea
              id="note"
              className="min-h-[80px]"
              value={form.note || ""}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Nhập ghi chú, nhận xét buổi học..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => onSave(form)}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
