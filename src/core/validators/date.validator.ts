export class DateValidator {
  validateDateOfBirth(dob: string): boolean {
    // Kiểm tra định dạng dd/mm/yyyy
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    if (!dateRegex.test(dob)) {
      return false
    }

    // Chuyển đổi thành Date object
    const [day, month, year] = dob.split("/").map(Number)
    const date = new Date(year, month - 1, day)

    // Kiểm tra tính hợp lệ của ngày
    const isValidDate =
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year

    // Kiểm tra ngày phải trong quá khứ
    const now = new Date()
    return isValidDate && date < now
  }

  validateMonth(month: string): boolean {
    const monthRegex = /^(0[1-9]|1[0-2])\/\d{4}$/
    return monthRegex.test(month)
  }

  validateDateRange(startDate: string, endDate: string): boolean {
    if (
      !this.validateDateOfBirth(startDate) ||
      !this.validateDateOfBirth(endDate)
    ) {
      return false
    }

    const [startDay, startMonth, startYear] = startDate.split("/").map(Number)
    const [endDay, endMonth, endYear] = endDate.split("/").map(Number)

    const start = new Date(startYear, startMonth - 1, startDay)
    const end = new Date(endYear, endMonth - 1, endDay)
    const now = new Date()

    return start >= now && end > start
  }
}
