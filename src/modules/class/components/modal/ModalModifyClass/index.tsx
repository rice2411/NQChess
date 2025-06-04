import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/components/ui/dialog"
import { Button } from "@/core/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs"
import { Alert, AlertDescription } from "@/core/components/ui/alert"
import { Eye, Calendar, Clock, Users } from "lucide-react"
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
import { format, parse } from "date-fns"
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
  const handleAddStudent = (student: IStudent) => {
    const baseTuition = Number(form.tuition.replace(/,/g, ""))
    const studentTuition =
      selectedStudentType === EStudentClassType.HALF
        ? baseTuition / 2
        : baseTuition

    setForm((prev) => ({
      ...prev,
      students: [
        ...prev.students,
        {
          studentId: student.id,
          joinDate: new Date(),
          status: EStudentClassStatus.ONLINE,
          type: selectedStudentType,
          session:
            selectedStudentType === EStudentClassType.HALF
              ? selectedStudentSession
              : undefined,
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
        <DialogContent className="w-full bg-white !max-w-2xl transition-all duration-500 ease-in-out">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-medium">
                {initialData ? "Sửa lớp học" : "Thêm lớp học mới"}
              </DialogTitle>
              {initialData && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDetail(true)}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700"
                >
                  <Eye className="w-4 h-4" />
                  Xem chi tiết
                </Button>
              )}
            </div>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Thông tin cơ bản
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="schedule"
                  className="data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Lịch học
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Học sinh
                  </div>
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 relative">
                <TabsContent
                  value="basic"
                  className="transition-transform duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"
                >
                  <BasicInfoTab form={form} handleChange={handleChange} />
                </TabsContent>

                <TabsContent
                  value="schedule"
                  className="transition-transform duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"
                >
                  <ScheduleTab
                    schedules={schedules}
                    handleScheduleChange={handleScheduleChange}
                    addSchedule={addSchedule}
                    removeSchedule={removeSchedule}
                    days={days}
                  />
                </TabsContent>

                <TabsContent
                  value="students"
                  className="transition-transform duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"
                >
                  <StudentTab
                    selectedStudentType={selectedStudentType}
                    setSelectedStudentType={setSelectedStudentType}
                    selectedStudentSession={selectedStudentSession}
                    setSelectedStudentSession={setSelectedStudentSession}
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
                </TabsContent>
              </div>
            </Tabs>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createOrUpdateMutation.isPending}
                  className="px-6"
                >
                  {createOrUpdateMutation.isPending ? "Đang lưu..." : "Lưu"}
                </Button>
                <Button type="button" variant="dark" onClick={onClose}>
                  Hủy
                </Button>
              </div>
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
