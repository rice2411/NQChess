import { Input } from "@/core/components/ui/input"
import { Button } from "@/core/components/ui/button"
import { Alert, AlertDescription } from "@/core/components/ui/alert"
import { Avatar } from "@/core/components/ui/avatar"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/core/components/ui/select"
import { IStudent } from "@/modules/student/interfaces/student.interface"
import { IStudentClass } from "@/modules/class/interfaces/class.interface"
import { EStudentClassType } from "@/modules/class/enums/class.enum"
import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDesc,
  DialogClose,
  DialogFooter,
  DialogTrigger,
} from "@/core/components/ui/dialog"
import { Checkbox } from "@/core/components/ui/checkbox"

interface StudentTabProps {
  studentSearch: string
  setStudentSearch: (search: string) => void
  filteredStudents: IStudent[]
  selectedStudentIds: string[]
  handleAddStudent: (student: IStudent) => void
  form: {
    students: IStudentClass[]
  }
  handleRemoveStudent: (student: IStudent) => void
  allStudents: IStudent[]
  schedules: { start: string; end: string; day: string }[]
}

export default function StudentTab({
  studentSearch,
  setStudentSearch,
  filteredStudents,
  selectedStudentIds,
  handleAddStudent,
  form,
  handleRemoveStudent,
  allStudents,
  schedules,
}: StudentTabProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [studentType, setStudentType] = useState<EStudentClassType>(
    EStudentClassType.FULL
  )
  const [studentSession, setStudentSession] = useState<string>("")

  const handleAddStudentWithType = (student: IStudent) => {
    handleAddStudent({
      ...student,
      type: studentType,
      session:
        studentType === EStudentClassType.HALF ? studentSession : undefined,
    } as any)
  }

  return (
    <form className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Danh sách học sinh
          </label>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="primary"
                size="sm"
                aria-label="Thêm học sinh"
              >
                Thêm học sinh
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm học sinh vào lớp</DialogTitle>
                <DialogDesc>Chọn học sinh để thêm vào lớp học này.</DialogDesc>
              </DialogHeader>
              <Input
                placeholder="Tìm kiếm học sinh..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="mb-3"
              />
              <div className="flex items-center gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={studentType === EStudentClassType.FULL}
                    onCheckedChange={() =>
                      setStudentType(EStudentClassType.FULL)
                    }
                  />
                  <span>Học đầy đủ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={studentType === EStudentClassType.HALF}
                    onCheckedChange={() =>
                      setStudentType(EStudentClassType.HALF)
                    }
                  />
                  <span>Học nửa buổi</span>
                </label>
                {studentType === EStudentClassType.HALF && (
                  <Select
                    value={studentSession}
                    onValueChange={setStudentSession}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn buổi học" />
                    </SelectTrigger>
                    <SelectContent>
                      {schedules.map((schedule, idx) => (
                        <SelectItem
                          key={idx}
                          value={`${schedule.start} - ${schedule.end} ${schedule.day}`}
                        >
                          {`${schedule.start} - ${schedule.end} ${schedule.day}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 border border-gray-100 rounded-lg bg-white">
                {filteredStudents.length === 0 && (
                  <Alert className="bg-gray-50/50 border-gray-200">
                    <AlertDescription className="text-gray-500">
                      Không có học sinh phù hợp
                    </AlertDescription>
                  </Alert>
                )}
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-gray-500 text-white shadow-sm ring-2 ring-white flex justify-center items-center">
                        <span className="text-sm font-semibold">
                          {student.fullName.charAt(0).toUpperCase()}
                        </span>
                      </Avatar>
                      <span className="text-base font-medium text-gray-900">
                        {student.fullName}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="info"
                      size="sm"
                      onClick={() => handleAddStudentWithType(student)}
                      disabled={selectedStudentIds.includes(student.id)}
                      className="rounded-lg min-w-[80px]"
                    >
                      Thêm
                    </Button>
                  </div>
                ))}
              </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="dark">
                    Đóng
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 border border-gray-100 rounded-lg bg-white">
          {form.students.length === 0 && (
            <Alert className="bg-gray-50/50 border-gray-200">
              <AlertDescription className="text-gray-500">
                Chưa có học sinh nào
              </AlertDescription>
            </Alert>
          )}
          {form.students.map((s) => {
            const student = allStudents.find((st) => st.id === s.studentId)
            return (
              <div
                key={s.studentId}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 bg-gray-500 text-white shadow-sm ring-2 ring-white flex justify-center items-center">
                    <span className="text-sm font-semibold">
                      {student?.fullName.charAt(0).toUpperCase()}
                    </span>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-base font-medium text-gray-900">
                      {student?.fullName || s.studentId}
                    </span>
                    <span className="text-xs text-gray-500">
                      {s.type === "FULL"
                        ? "Học full"
                        : `Học nửa buổi (${s.session})`}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="dark"
                  size="icon"
                  onClick={() =>
                    handleRemoveStudent({ id: s.studentId } as any)
                  }
                  className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  aria-label="Xóa học sinh"
                >
                  x
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </form>
  )
}
