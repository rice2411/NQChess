// Utility functions để tính toán ngày học

export interface ScheduleInfo {
  dayOfWeek: number; // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7
  timeRange: string; // "HH:mm - HH:mm"
}

/**
 * Parse schedule string thành ScheduleInfo
 * Format: "HH:mm - HH:mm Thứ X"
 */
export function parseSchedule(schedule: string): ScheduleInfo {
  const parts = schedule.split(' ');
  const timeRange = parts[0] + ' ' + parts[1]; // "HH:mm - HH:mm"

  // Tìm thứ trong chuỗi - cải thiện logic tìm kiếm
  const dayMapping: { [key: string]: number } = {
    'Chủ nhật': 0,
    'Thứ 2': 1,
    'Thứ 3': 2,
    'Thứ 4': 3,
    'Thứ 5': 4,
    'Thứ 6': 5,
    'Thứ 7': 6,
    'thứ 2': 1,
    'thứ 3': 2,
    'thứ 4': 3,
    'thứ 5': 4,
    'thứ 6': 5,
    'thứ 7': 6,
    'chủ nhật': 0,
  };

  let dayOfWeek = 1; // Mặc định thứ 2
  let foundDay = false;

  for (const [dayStr, dayNum] of Object.entries(dayMapping)) {
    if (schedule.toLowerCase().includes(dayStr.toLowerCase())) {
      dayOfWeek = dayNum;
      foundDay = true;
      break;
    }
  }

  if (!foundDay) {
    console.warn('Không tìm thấy thứ trong schedule:', schedule);
  }

  const result = {
    dayOfWeek,
    timeRange,
  };

  return result;
}

/**
 * Tính toán các ngày học từ startDate đến ngày hiện tại
 */
export function calculateClassDates(
  startDate: string,
  schedules: string[],
  endDate?: string
): Array<{ date: string; sessionNumber: number; schedule: string }> {
  const classDates: Array<{
    date: string;
    sessionNumber: number;
    schedule: string;
  }> = [];

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  // Kiểm tra nếu startDate trong tương lai
  if (start > end) {
    return classDates;
  }

  let sessionNumber = 1;
  let currentDate = new Date(start);

  // Tìm tất cả ngày học trong khoảng thời gian
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();

    // Kiểm tra tất cả schedules cho ngày này
    for (const schedule of schedules) {
      const scheduleInfo = parseSchedule(schedule);

      if (scheduleInfo.dayOfWeek === dayOfWeek) {
        const dateStr = currentDate.toISOString().split('T')[0];
        classDates.push({
          date: dateStr,
          sessionNumber,
          schedule,
        });
        sessionNumber++;
      }
    }

    // Tăng lên 1 ngày
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return classDates;
}

/**
 * Kiểm tra xem một ngày có phải là ngày học không
 */
export function isClassDay(date: string, schedules: string[]): boolean {
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay();

  return schedules.some(schedule => {
    const scheduleInfo = parseSchedule(schedule);
    return scheduleInfo.dayOfWeek === dayOfWeek;
  });
}

/**
 * Lấy thông tin schedule cho một ngày cụ thể
 */
export function getSchedulesForDate(
  date: string,
  schedules: string[]
): string[] {
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay();

  return schedules.filter(schedule => {
    const scheduleInfo = parseSchedule(schedule);
    return scheduleInfo.dayOfWeek === dayOfWeek;
  });
}

/**
 * Format ngày thành chuỗi YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Lấy ngày hiện tại dưới dạng YYYY-MM-DD
 */
export function getCurrentDate(): string {
  return formatDate(new Date());
}
