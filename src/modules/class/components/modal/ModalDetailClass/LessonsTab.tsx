import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Input } from "@/core/components/ui/input"
import { CheckCircle2, Clock, Search } from "lucide-react"
import { IClass } from "@/modules/class/interfaces/class.interface"
import {
  addDays,
  format,
  isBefore,
  parse,
  startOfDay,
  isAfter,
  isEqual,
} from "date-fns"
import { vi } from "date-fns/locale"
import { getDayOfWeek, getFirstDayOfWeek } from "@/core/utils/date.util"

interface LessonsTabProps {
  classData: IClass
}

export default function LessonsTab({ classData }: LessonsTabProps) {
  const [searchCompletedLesson, setSearchCompletedLesson] = useState("")
  const [filteredCompletedLessons, setFilteredCompletedLessons] = useState<
    string[]
  >([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [upcomingLessons, setUpcomingLessons] = useState<string[]>([])

  useEffect(() => {
    // Tạo danh sách các buổi học từ lịch học
    const lessons: string[] = []

    // Log để debug
    console.log("Raw startDate:", classData.startDate)

    // Parse ngày bắt đầu
    const start = startOfDay(new Date(classData.startDate))
    const today = startOfDay(new Date()) // Lấy ngày hiện tại, bỏ qua giờ phút giây

    // Log để debug
    console.log("Parsed start date:", start)
    console.log("Today:", today)

    // Với mỗi lịch học, tạo các buổi học từ ngày bắt đầu đến ngày hiện tại
    for (const schedule of classData.schedules) {
      try {
        const dayOfWeek = getDayOfWeek(schedule)
        // Tìm ngày đầu tiên của buổi học sau ngày bắt đầu
        let currentDate = startOfDay(getFirstDayOfWeek(start, dayOfWeek))

        // Tạo các buổi học cho đến ngày hiện tại
        while (isBefore(currentDate, today) || isEqual(currentDate, today)) {
          const formattedDate = format(currentDate, "dd/MM/yyyy", {
            locale: vi,
          })
          lessons.push(`${schedule} - ${formattedDate}`)
          // Chuyển đến tuần tiếp theo
          currentDate = startOfDay(addDays(currentDate, 7))
        }
      } catch (error) {
        console.error(
          `Error generating lessons for schedule ${schedule}:`,
          error
        )
      }
    }

    // Sắp xếp các buổi học theo ngày
    const sortedLessons = lessons.sort((a, b) => {
      const dateA = parse(a.split(" - ")[1], "dd/MM/yyyy", new Date())
      const dateB = parse(b.split(" - ")[1], "dd/MM/yyyy", new Date())
      return dateA.getTime() - dateB.getTime()
    })

    // Lọc các buổi học đã hoàn thành (trước hoặc đúng ngày hiện tại)
    const completed = sortedLessons.filter((lesson) => {
      const lessonDate = startOfDay(
        parse(lesson.split(" - ")[1], "dd/MM/yyyy", new Date())
      )
      return isBefore(lessonDate, today) || isEqual(lessonDate, today)
    })

    // Lọc các buổi học sắp tới (sau ngày hiện tại) và chỉ lấy buổi gần nhất
    const upcoming = sortedLessons
      .filter((lesson) => {
        const lessonDate = startOfDay(
          parse(lesson.split(" - ")[1], "dd/MM/yyyy", new Date())
        )
        return isAfter(lessonDate, today)
      })
      .slice(0, 1) // Chỉ lấy buổi học sắp tới gần nhất

    console.log("All lessons:", sortedLessons)
    console.log("Completed lessons:", completed)
    console.log("Upcoming lessons:", upcoming)

    setCompletedLessons(completed)
    setUpcomingLessons(upcoming)
  }, [classData])

  useEffect(() => {
    if (completedLessons.length > 0) {
      const filtered = completedLessons.filter((lesson: string) =>
        lesson.toLowerCase().includes(searchCompletedLesson.toLowerCase())
      )
      setFilteredCompletedLessons(filtered)
    } else {
      setFilteredCompletedLessons([])
    }
  }, [searchCompletedLesson, completedLessons])

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-50/30 border-b border-green-100/50">
          <CardTitle className="text-base text-primary-700 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Buổi học đã hoàn thành
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm buổi học..."
              value={searchCompletedLesson}
              onChange={(e) => setSearchCompletedLesson(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredCompletedLessons.length > 0 ? (
              filteredCompletedLessons.map((lesson: string, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{lesson}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                Không có buổi học nào
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50/30 border-b border-blue-100/50">
          <CardTitle className="text-base text-primary-700 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Buổi học sắp tới
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {upcomingLessons.length > 0 ? (
              upcomingLessons.map((lesson: string, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-4 text-blue-600" />
                    <span className="text-sm">{lesson}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                Không có buổi học nào
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
