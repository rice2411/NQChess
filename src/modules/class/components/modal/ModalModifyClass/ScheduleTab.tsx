import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Input } from "@/core/components/ui/input"
import { Button } from "@/core/components/ui/button"
import { Clock } from "lucide-react"
import { Label } from "@/core/components/ui/label"

interface Schedule {
  start: string
  end: string
  day: string
}

interface ScheduleTabProps {
  schedules: Schedule[]
  handleScheduleChange: (idx: number, field: string, value: string) => void
  addSchedule: () => void
  removeSchedule: (idx: number) => void
  days: string[]
}

function getDefaultTime() {
  const now = new Date()
  const startTime = new Date(now.getTime() + 30 * 60000) // +30 phút
  const endTime = new Date(now.getTime() + 90 * 60000) // +90 phút (1h30p)

  return {
    start: startTime.toTimeString().slice(0, 5),
    end: endTime.toTimeString().slice(0, 5),
  }
}

export default function ScheduleTab({
  schedules,
  handleScheduleChange,
  addSchedule,
  removeSchedule,
  days,
}: ScheduleTabProps) {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-50/30 border-b border-primary-100/50">
        <CardTitle className="text-base text-primary-700 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-600" />
          Lịch học
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {schedules.map((sch, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3  bg-white/50 hover:bg-white rounded-lg transition-all duration-200"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center gap-2 flex-1">
                <div className="flex flex-col gap-2 flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Buổi {idx + 1}
                  </Label>
                  <div className="flex items-center gap-2 bg-gray-50/50  py-2 rounded-md">
                    <div className="flex items-center gap-2 bg-gray-50/50 px-3 py-2 rounded-md">
                      <Input
                        type="time"
                        value={sch.start}
                        onChange={(e) =>
                          handleScheduleChange(idx, "start", e.target.value)
                        }
                        className="w-28 bg-white/50 focus:bg-white transition-colors duration-200"
                        required
                      />
                    </div>
                    <Input
                      type="time"
                      value={sch.end}
                      onChange={(e) =>
                        handleScheduleChange(idx, "end", e.target.value)
                      }
                      className="w-28 bg-white/50 focus:bg-white transition-colors duration-200"
                      required
                    />
                    <select
                      value={sch.day}
                      onChange={(e) =>
                        handleScheduleChange(idx, "day", e.target.value)
                      }
                      className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white/50 focus:bg-white transition-colors duration-200"
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="dark"
                        size="icon"
                        onClick={() => removeSchedule(idx)}
                        disabled={schedules.length === 1 || idx === 0}
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                      >
                        -
                      </Button>
                      {idx === schedules.length - 1 && (
                        <Button
                          type="button"
                          variant="info"
                          size="icon"
                          onClick={addSchedule}
                          className="h-8 w-8 hover:bg-primary-50 hover:text-primary-500 transition-colors duration-200"
                        >
                          +
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
