export class TimeValidator {
  validateTime(time: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(time)
  }

  validateTimeRange(startTime: string, endTime: string): boolean {
    if (!this.validateTime(startTime) || !this.validateTime(endTime)) {
      return false
    }

    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    const start = startHour * 60 + startMinute
    const end = endHour * 60 + endMinute

    return end > start
  }
}
