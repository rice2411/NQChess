import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Input } from "@/core/components/ui/input"
import { Button } from "@/core/components/ui/button"
import { Label } from "@/core/components/ui/label"
import { Alert, AlertDescription } from "@/core/components/ui/alert"
import { Avatar } from "@/core/components/ui/avatar"
import { Users, UserPlus, UserX } from "lucide-react"
import { IStudent } from "@/modules/student/interfaces/student.interface"
import { IStudentClass } from "@/modules/class/interfaces/class.interface"
import { EStudentClassType } from "@/modules/class/enums/class.enum"

interface StudentTabProps {
  selectedStudentType: EStudentClassType
  setSelectedStudentType: (type: EStudentClassType) => void
  selectedStudentSession: string
  setSelectedStudentSession: (session: string) => void
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
  selectedStudentType,
  setSelectedStudentType,
  selectedStudentSession,
  setSelectedStudentSession,
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
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-50/30 border-b border-primary-100/50">
        <CardTitle className="text-base text-primary-700 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-600" />
          Quản lý học sinh
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium text-gray-700">
            Hình thức học:
          </Label>
          <select
            value={selectedStudentType}
            onChange={(e) =>
              setSelectedStudentType(e.target.value as EStudentClassType)
            }
            className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white/50 focus:bg-white transition-colors duration-200"
          >
            <option value={EStudentClassType.FULL}>Học full</option>
            <option value={EStudentClassType.HALF}>Học nửa buổi</option>
          </select>
          {selectedStudentType === EStudentClassType.HALF && (
            <select
              value={selectedStudentSession}
              onChange={(e) => setSelectedStudentSession(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white/50 focus:bg-white transition-colors duration-200"
            >
              <option value="">Chọn buổi học</option>
              {schedules.map((schedule, index) => (
                <option
                  key={index}
                  value={`${schedule.start} - ${schedule.end} ${schedule.day}`}
                >
                  {`${schedule.start} - ${schedule.end} ${schedule.day}`}
                </option>
              ))}
            </select>
          )}
        </div>

        <Input
          placeholder="Tìm kiếm học sinh..."
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          className="w-full bg-white/50 focus:bg-white transition-colors duration-200"
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Danh sách học sinh
            </Label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
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
                  className="flex items-center justify-between p-3 bg-white/50 hover:bg-white rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 bg-gray-500 text-white shadow-sm ring-2 ring-white flex justify-center items-center">
                      <span className="text-sm font-semibold">
                        {student.fullName.charAt(0).toUpperCase()}
                      </span>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">
                      {student.fullName}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="info"
                    size="sm"
                    onClick={() => handleAddStudent(student)}
                    disabled={selectedStudentIds.includes(student.id)}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Thêm
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Học sinh đã thêm
            </Label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
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
                    className="flex items-center justify-between p-3 bg-white/50 hover:bg-white rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-gray-500 text-white shadow-sm ring-2 ring-white flex justify-center items-center">
                        <span className="text-sm font-semibold">
                          {student?.fullName.charAt(0).toUpperCase()}
                        </span>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">
                          {student?.fullName || s.studentId}
                        </span>
                        <span className="text-xs text-gray-500">
                          {s.type === EStudentClassType.FULL
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
                        handleRemoveStudent({
                          id: s.studentId,
                        } as IStudent)
                      }
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
