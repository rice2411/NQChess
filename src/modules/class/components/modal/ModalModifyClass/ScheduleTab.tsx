import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/core/components/ui/select"

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

export default function ScheduleTab({
  schedules,
  handleScheduleChange,
  addSchedule,
  removeSchedule,
  days,
}: ScheduleTabProps) {
  return (
    <form className="flex flex-col gap-5 w-full">
      {schedules.map((sch, idx) => (
        <div key={idx} className="flex flex-col gap-2 w-full ">
          <label className="text-sm font-medium text-gray-700">
            Buổi {idx + 1}
          </label>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Input
              type="time"
              value={sch.start}
              onChange={(e) =>
                handleScheduleChange(idx, "start", e.target.value)
              }
              required
            />
            <span className="text-gray-400 self-center">-</span>
            <Input
              type="time"
              value={sch.end}
              onChange={(e) => handleScheduleChange(idx, "end", e.target.value)}
              required
            />
            <Select
              value={sch.day}
              onValueChange={(value) => handleScheduleChange(idx, "day", value)}
            >
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Chọn ngày" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant="dark"
              onClick={() => removeSchedule(idx)}
              disabled={schedules.length === 1 || idx === 0}
              aria-label="Xóa buổi học"
              className={`${idx === 0 ? "hidden" : ""}`}
            >
              Xóa
            </Button>
            {idx === schedules.length - 1 && (
              <Button
                variant="info"
                type="button"
                onClick={addSchedule}
                aria-label="Thêm buổi học"
                disabled={schedules.length === 2}
                className={`${idx === 1 ? "hidden" : ""}`}
              >
                Thêm
              </Button>
            )}
          </div>
        </div>
      ))}
    </form>
  )
}
