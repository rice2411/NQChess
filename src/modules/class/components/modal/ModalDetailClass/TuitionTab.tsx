import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Users } from "lucide-react"
import { IClass } from "@/modules/class/interfaces/class.interface"
import { EStudentClassType } from "@/modules/class/enums/class.enum"
import { formatCurrencyVND } from "@/core/utils/currency.util"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"

interface TuitionTabProps {
  classData: IClass
}

export default function TuitionTab({ classData }: TuitionTabProps) {
  const { getAllQuery: getAllStudentsQuery } = useStudentQueries()
  const allStudents = getAllStudentsQuery.data?.success
    ? getAllStudentsQuery.data.data || []
    : []

  const getStudentInfo = (studentClass: any) => {
    const student = allStudents.find((s) => s.id === studentClass.studentId)
    return {
      name: student?.fullName || studentClass.studentId,
      type:
        studentClass.type === EStudentClassType.FULL
          ? "Học full"
          : "Học nửa buổi",
      tuition: formatCurrencyVND(studentClass.tuition.toString()),
    }
  }

  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-50/30 border-b border-primary-100/50">
        <CardTitle className="text-base text-primary-700 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-600" />
          Danh sách học sinh
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Học sinh học full */}
          <div>
            <h4 className="text-sm font-medium text-primary-600 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Học sinh học full
            </h4>
            <div className="space-y-3">
              {classData.students
                .filter(
                  (studentClass) => studentClass.type === EStudentClassType.FULL
                )
                .map((studentClass) => {
                  const studentInfo = getStudentInfo(studentClass)
                  return (
                    <div
                      key={studentClass.studentId}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">
                          {studentInfo.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600">
                        Học phí: {studentInfo.tuition} VNĐ
                      </p>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Học sinh học nửa buổi */}
          <div>
            <h4 className="text-sm font-medium text-primary-600 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Học sinh học nửa buổi
            </h4>
            <div className="space-y-3">
              {classData.students
                .filter(
                  (studentClass) => studentClass.type === EStudentClassType.HALF
                )
                .map((studentClass) => {
                  const studentInfo = getStudentInfo(studentClass)
                  return (
                    <div
                      key={studentClass.studentId}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">
                          {studentInfo.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600">
                        Học phí: {studentInfo.tuition} VNĐ
                      </p>
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
