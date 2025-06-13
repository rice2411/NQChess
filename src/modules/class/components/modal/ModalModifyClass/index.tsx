import React, { useEffect, useState } from "react"
import { format, parse } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/core/components/ui/dialog"
import { Button } from "@/core/components/ui/button"
import { Alert, AlertDescription } from "@/core/components/ui/alert"
import {
  EClassStatus,
  EStudentClassStatus,
  EStudentClassType,
} from "@/modules/class/enums/class.enum"
import { useClassQueries } from "@/modules/class/hooks/useClassQueries"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import { IStudent } from "@/modules/student/interfaces/student.interface"
import {
  IStudentClass,
  IClass,
} from "@/modules/class/interfaces/class.interface"
import BasicInfoTab from "./BasicInfoTab"
import ScheduleTab from "./ScheduleTab"
import StudentTab from "./StudentTab"
import ModalDetailClass from "../ModalDetailClass"

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]

function getToday() {
  const today = new Date()
  return today.toISOString().slice(0, 10)
}

function formatCurrency(value: string) {
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

type CustomChangeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  | { target: { name: string; value: string } }

export default function ModalModifyClass({
  open,
  onClose,
  initialData,
  onSave,
}: {
  open: boolean
  onClose: () => void
  initialData?: any
  onSave?: (newClass: any) => void
}) {
  const { createOrUpdateMutation } = useClassQueries()
  const { getAllQuery: getAllStudentsQuery } = useStudentQueries()
  const today = getToday()
  const [form, setForm] = useState({
    name: "",
    startDate: today,
    status: EClassStatus.NOT_STARTED,
    tuition: "",
    students: [] as IStudentClass[],
  })
  const [schedules, setSchedules] = useState([
    { start: "", end: "", day: days[0] },
  ])
  const [error, setError] = useState<string | null>(null)
  const [studentSearch, setStudentSearch] = useState("")
  const [selectedStudentType, setSelectedStudentType] =
    useState<EStudentClassType>(EStudentClassType.FULL)
  const [selectedStudentSession, setSelectedStudentSession] =
    useState<string>("")
  const [showDetail, setShowDetail] = useState(false)

  // Lấy danh sách học sinh chưa có trong lớp
  const allStudents: IStudent[] = getAllStudentsQuery.data?.success
    ? getAllStudentsQuery.data.data || []
    : []
  const selectedStudentIds = form.students.map((s) => s.studentId)
  const filteredStudents = allStudents.filter(
    (s) =>
      (!studentSearch ||
        s.fullName.toLowerCase().includes(studentSearch.toLowerCase())) &&
      !selectedStudentIds.includes(s.id)
  )

  useEffect(() => {
    if (initialData) {
      // Chuyển đổi ngày về yyyy-MM-dd cho input type="date"
      const parseDate = (dateStr: string) => {
        if (!dateStr) return ""
        try {
          // Nếu đã đúng yyyy-MM-dd thì trả về luôn
          if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr
          // Nếu là dd/MM/yyyy thì convert
          const d = parse(dateStr, "dd/MM/yyyy", new Date())
          return format(d, "yyyy-MM-dd")
        } catch {
          return ""
        }
      }
      setForm({
        name: initialData.name || "",
        startDate: parseDate(initialData.startDate) || today,
        status: initialData.status || EClassStatus.NOT_STARTED,
        tuition: initialData.tuition
          ? formatCurrency(initialData.tuition.toString())
          : "",
        students: initialData.students || [],
      })
      setSchedules(
        Array.isArray(initialData.schedules) && initialData.schedules.length > 0
          ? initialData.schedules.map((s: string) => {
              const match = s.match(/(\d{2}:\d{2}) - (\d{2}:\d{2}) (.+)/)
              return match
                ? { start: match[1], end: match[2], day: match[3] }
                : { start: "", end: "", day: days[0] }
            })
          : [{ start: "", end: "", day: days[0] }]
      )
    } else {
      setForm({
        name: "",
        startDate: today,
        status: EClassStatus.NOT_STARTED,
        tuition: "",
        students: [],
      })
      setSchedules([{ start: "", end: "", day: days[0] }])
    }
  }, [initialData, open])

  useEffect(() => {
    if (open) getAllStudentsQuery.refetch()
  }, [open])

  const handleChange = (e: CustomChangeEvent) => {
    const { name, value } = e.target
    if (name === "tuition") {
      setForm((prev) => ({ ...prev, [name]: formatCurrency(value) }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleScheduleChange = (idx: number, field: string, value: string) => {
    setSchedules((schs) =>
      schs.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    )
  }
  const addSchedule = () =>
    setSchedules([...schedules, { start: "", end: "", day: days[0] }])
  const removeSchedule = (idx: number) =>
    setSchedules((schs) => schs.filter((_, i) => i !== idx))

  // Thêm/xóa học sinh vào lớp
  const handleAddStudent = (
    student: IStudent & { type?: string; session?: string }
  ) => {
    const baseTuition = Number(form.tuition.replace(/,/g, ""))
    const type = (student.type as EStudentClassType) || EStudentClassType.FULL
    const studentTuition =
      type === EStudentClassType.HALF ? baseTuition / 2 : baseTuition

    setForm((prev) => ({
      ...prev,
      students: [
        ...prev.students,
        {
          studentId: student.id,
          joinDate: new Date(),
          status: EStudentClassStatus.ONLINE,
          type,
          session:
            type === EStudentClassType.HALF ? student.session : undefined,
          tuition: studentTuition,
        },
      ],
    }))
  }

  const handleRemoveStudent = (student: IStudent) => {
    setForm((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.studentId !== student.id),
    }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    if (!form.name) {
      setError("Vui lòng nhập tên lớp.")
      return
    }
    if (schedules.some((s) => !s.start || !s.end || !s.day)) {
      setError("Vui lòng nhập đầy đủ thông tin cho tất cả các buổi học.")
      return
    }
    const scheduleStrings = schedules.map(
      (s) => `${s.start} - ${s.end} ${s.day}`
    )

    // Loại bỏ các trường undefined từ students
    const cleanStudents = form.students.map((student) => {
      const cleanStudent = { ...student }
      if (cleanStudent.session === undefined) {
        delete cleanStudent.session
      }
      return cleanStudent
    })

    // Tạo object mới với các trường bắt buộc
    const newClass: Omit<IClass, "id"> = {
      name: form.name,
      startDate: form.startDate,
      status: form.status,
      tuition: Number(form.tuition.replace(/,/g, "")),
      schedules: scheduleStrings,
      students: cleanStudents,
    }

    // Thêm id nếu là cập nhật
    if (initialData?.id) {
      ;(newClass as any).id = initialData.id
    }

    createOrUpdateMutation.mutate(
      {
        data: newClass,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            if (onSave) onSave(res.data)
            else if (typeof window !== "undefined") window.location.reload()
            onClose()
          } else {
            setError(res.message || "Có lỗi xảy ra!")
          }
        },
        onError: () => setError("Có lỗi xảy ra, vui lòng thử lại!"),
      }
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 z-50 bg-white p-0 rounded-2xl shadow-lg !max-w-11/12 overflow-x-auto max-h-[90vh] overflow-y-auto px-4 md:px-8">
          {/* Header Figma */}
          <div className="relative flex flex-col rounded-t-2xl bg-white">
            <div className="flex items-center gap-4 px-8 pt-8 pb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6941C6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-building-2 w-8 h-8"
                >
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
                  <path d="M9 17v2" />
                  <path d="M15 17v2" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-semibold text-gray-900">
                  {initialData ? "Sửa lớp học" : "Thêm lớp học mới"}
                </span>
                <span className="text-sm text-gray-500">
                  Tạo hoặc chỉnh sửa thông tin lớp học
                </span>
              </div>
              <div className="flex-1" />
            </div>
            <div className="h-px bg-gray-200 w-full" />
          </div>
          {/* Super Modal Content - 3 columns */}
          <form
            onSubmit={handleSubmit}
            className="pt-8 pb-0 bg-white"
            autoComplete="off"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-6">
                <BasicInfoTab form={form} handleChange={handleChange} />
                <ScheduleTab
                  schedules={schedules}
                  handleScheduleChange={handleScheduleChange}
                  addSchedule={addSchedule}
                  removeSchedule={removeSchedule}
                  days={days}
                />
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <StudentTab
                  studentSearch={studentSearch}
                  setStudentSearch={setStudentSearch}
                  filteredStudents={filteredStudents}
                  selectedStudentIds={selectedStudentIds}
                  handleAddStudent={handleAddStudent}
                  form={form}
                  handleRemoveStudent={handleRemoveStudent}
                  allStudents={allStudents}
                  schedules={schedules}
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="h-px bg-gray-200 w-full my-6" />
            <DialogFooter className="flex flex-row justify-end gap-3 px-0 pb-8">
              <Button
                type="button"
                variant="dark"
                onClick={onClose}
                className="min-w-[120px]"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="min-w-[120px]"
                disabled={createOrUpdateMutation.isPending}
              >
                {createOrUpdateMutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {initialData && (
        <ModalDetailClass
          open={showDetail}
          onClose={() => setShowDetail(false)}
          classData={initialData}
        />
      )}
    </>
  )
}
