import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { Button } from "@/core/components/ui/button"
import { Label } from "@/core/components/ui/label"
import {
  EClassStatus,
  EStudentClassStatus,
} from "@/modules/class/enums/class.enum"
import { useClassQueries } from "@/modules/class/hooks/useClassQueries"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import { IStudent } from "@/modules/student/interfaces/student.interface"
import { UserPlus, UserX } from "lucide-react"
import { IStudentClass } from "@/modules/class/interfaces/class.interface"
import { format, parse } from "date-fns"

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]

function getToday() {
  const today = new Date()
  return today.toISOString().slice(0, 10)
}

function getThreeMonthsLater(fromDateStr: string) {
  const date = new Date(fromDateStr)
  date.setMonth(date.getMonth() + 3)
  return date.toISOString().slice(0, 10)
}

function formatCurrency(value: string) {
  const number = value.replace(/\D/g, "")
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default function ClassModal({
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
  const defaultEndDate = getThreeMonthsLater(today)
  const [form, setForm] = useState({
    name: "",
    startDate: today,
    endDate: defaultEndDate,
    status: EClassStatus.INACTIVE,
    tuition: "",
    students: [] as IStudentClass[],
  })
  const [schedules, setSchedules] = useState([
    { start: "", end: "", day: days[0] },
  ])
  const [error, setError] = useState<string | null>(null)
  const [studentSearch, setStudentSearch] = useState("")

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
        endDate:
          parseDate(initialData.endDate) ||
          getThreeMonthsLater(parseDate(initialData.startDate) || today),
        status: initialData.status || EClassStatus.INACTIVE,
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
        endDate: defaultEndDate,
        status: EClassStatus.INACTIVE,
        tuition: "",
        students: [],
      })
      setSchedules([{ start: "", end: "", day: days[0] }])
    }
  }, [initialData, open])

  useEffect(() => {
    if (open) getAllStudentsQuery.refetch()
  }, [open])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === "tuition") {
      setForm((prev) => ({ ...prev, [name]: formatCurrency(value) }))
    } else if (name === "startDate") {
      setForm((prev) => ({
        ...prev,
        startDate: value,
        endDate: getThreeMonthsLater(value),
      }))
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
  const handleAddStudent = (student: IStudent) => {
    setForm((prev) => ({
      ...prev,
      students: [
        ...prev.students,
        {
          studentId: student.id,
          joinDate: new Date(),
          status: EStudentClassStatus.ONLINE,
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
    if (!form.name || !form.startDate || !form.endDate) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.")
      return
    }
    if (schedules.some((s) => !s.start || !s.end || !s.day)) {
      setError("Vui lòng nhập đầy đủ thông tin cho tất cả các buổi học.")
      return
    }
    const scheduleStrings = schedules.map(
      (s) => `${s.start} - ${s.end} ${s.day}`
    )
    const newClass = {
      ...form,
      id: initialData?.id,
      tuition: Number(form.tuition.replace(/,/g, "")),
      schedules: scheduleStrings,
    }
    if (!initialData && Object.prototype.hasOwnProperty.call(newClass, "id")) {
      delete newClass.id
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
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-full bg-white !max-w-3/4">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Sửa lớp học" : "Thêm lớp học mới"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 "
          autoComplete="off"
        >
          {/* Cột trái: Form nhập liệu */}
          <div className="grid grid-cols-1 md:col-span-2 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <Label htmlFor="name" className="block mb-1 font-bold">
                Tên lớp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Tên lớp"
                value={form.name}
                onChange={handleChange}
                required
                className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <Label htmlFor="startDate" className="block mb-1 font-bold">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
                className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="block mb-1 font-bold">
                Ngày kết thúc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
                className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <Label htmlFor="status" className="block mb-1 font-bold">
                Trạng thái
              </Label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 transition border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
              >
                <option value={EClassStatus.ACTIVE}>Đang hoạt động</option>
                <option value={EClassStatus.INACTIVE}>Ngừng hoạt động</option>
                <option value={EClassStatus.FULL}>Đã đầy</option>
                <option value={EClassStatus.CANCELLED}>Đã hủy</option>
              </select>
            </div>
            <div>
              <Label htmlFor="tuition" className="block mb-1 font-bold">
                Học phí (VNĐ)
              </Label>
              <Input
                id="tuition"
                name="tuition"
                type="text"
                value={form.tuition}
                onChange={handleChange}
                className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
                inputMode="numeric"
                pattern="[0-9,]*"
              />
            </div>
            {/* Buổi học */}
            <div className="col-span-1 sm:col-span-2">
              <Label className="block mb-1 font-bold">Buổi học</Label>
              {schedules.map((sch, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <Input
                    type="time"
                    value={sch.start}
                    onChange={(e) =>
                      handleScheduleChange(idx, "start", e.target.value)
                    }
                    className="w-28"
                    required
                  />
                  <span>-</span>
                  <Input
                    type="time"
                    value={sch.end}
                    onChange={(e) =>
                      handleScheduleChange(idx, "end", e.target.value)
                    }
                    className="w-28"
                    required
                  />
                  <select
                    value={sch.day}
                    onChange={(e) =>
                      handleScheduleChange(idx, "day", e.target.value)
                    }
                    className="px-2 py-1 border rounded"
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => removeSchedule(idx)}
                    disabled={schedules.length === 1}
                    className="border border-black-500"
                  >
                    -
                  </Button>
                  {idx === schedules.length - 1 && (
                    <Button type="button" size="icon" onClick={addSchedule}>
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Cột phải: Danh sách học sinh */}
          <div className="flex flex-col h-full pl-4 border-l md:col-span-1">
            <Label className="mb-2 font-bold">Thêm học sinh vào lớp</Label>
            <Input
              placeholder="Tìm kiếm tên học sinh..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="mb-3"
            />
            <div className="flex-1 pr-2 overflow-y-auto max-h-80">
              {filteredStudents.length === 0 && (
                <div className="mt-4 text-sm text-center text-gray-400">
                  Không có học sinh phù hợp
                </div>
              )}
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between px-2 py-2 mb-1 transition rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 text-base font-bold text-gray-600 bg-gray-200 rounded-full">
                      {student.fullName.charAt(0).toUpperCase()}
                    </span>
                    <span className="mr-2 text-sm font-medium">
                      {student.fullName}
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="dark"
                    className={`border-2 ${
                      selectedStudentIds.includes(student.id)
                        ? "border-green-500 text-green-600"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleAddStudent(student)}
                    disabled={selectedStudentIds.includes(student.id)}
                  >
                    <UserPlus className="w-4 h-4 mr-1" /> Thêm
                  </Button>
                </div>
              ))}
            </div>
            {/* Danh sách đã chọn */}
            {form.students.length > 0 && (
              <div className="mt-4">
                <Label className="mb-1 font-bold">Đã chọn:</Label>
                <div className="flex flex-col gap-2 mt-1">
                  {form.students.map((s) => {
                    const student = allStudents.find(
                      (st) => st.id === s.studentId
                    )
                    return (
                      <div
                        key={s.studentId}
                        className="flex items-center justify-between px-2 py-1 rounded bg-green-50"
                      >
                        <span className="text-sm font-medium text-green-700">
                          {student?.fullName || s.studentId}
                        </span>
                        <Button
                          type="button"
                          size="icon"
                          variant="dark"
                          onClick={() =>
                            handleRemoveStudent({ id: s.studentId } as IStudent)
                          }
                        >
                          <UserX className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          {error && (
            <div className="col-span-1 mt-2 text-sm text-center text-red-500 md:col-span-3">
              {error}
            </div>
          )}
        </form>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={createOrUpdateMutation.isPending}
            className="w-full px-8 py-2 text-base font-semibold rounded-lg shadow-md sm:w-auto"
          >
            {createOrUpdateMutation.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
