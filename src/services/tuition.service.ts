import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  ITuitionFee,
  ETuitionStatus,
  ITuitionSummary,
} from '@/interfaces/tuition.interface';
import {
  IClass,
  IStudentClass,
  EStudentClassType,
} from '@/interfaces/class.interface';
import { ClassService } from './class.service';
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  parseISO,
} from 'date-fns';

const COLLECTION = 'tuitions';

export class TuitionService {
  // Tính số buổi học trong tháng dựa trên startDate và schedules
  static calculateSessionsInMonth(
    startDate: string,
    schedules: string[],
    targetMonth: string // Format: YYYY-MM
  ): number {
    const startDateObj = parseISO(startDate);
    const targetDate = parseISO(`${targetMonth}-01`);

    // Nếu tháng target trước tháng startDate thì return 0
    if (targetDate < startOfMonth(startDateObj)) {
      return 0;
    }

    // Tính số buổi học trong tháng
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);

    let sessionCount = 0;
    const currentDate = new Date(monthStart);

    while (currentDate <= monthEnd) {
      const dayOfWeek = currentDate.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
      const weekdays = [
        'Chủ nhật',
        'Thứ 2',
        'Thứ 3',
        'Thứ 4',
        'Thứ 5',
        'Thứ 6',
        'Thứ 7',
      ];
      const currentWeekday = weekdays[dayOfWeek];

      // Kiểm tra xem có lịch học nào vào thứ này không
      const hasSchedule = schedules.some(schedule =>
        schedule.includes(currentWeekday)
      );

      // Chỉ tính buổi học nếu:
      // 1. Có lịch học vào thứ này
      // 2. Ngày hiện tại >= ngày bắt đầu lớp học
      if (hasSchedule && currentDate >= startDateObj) {
        const sessionsOnThisDay = schedules.filter(schedule =>
          schedule.includes(currentWeekday)
        ).length;
        sessionCount += sessionsOnThisDay;

        // Log chi tiết cho tháng bắt đầu
        const isStartMonth =
          targetDate.getMonth() === startDateObj.getMonth() &&
          targetDate.getFullYear() === startDateObj.getFullYear();
        if (isStartMonth) {
          console.log(
            `  - ${currentDate.toISOString().split('T')[0]} (${currentWeekday}): ${sessionsOnThisDay} buổi`
          );
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return sessionCount;
  }

  // Tính học phí cho học sinh trong tháng với logic cải tiến
  static calculateTuitionForStudent(
    classData: IClass,
    student: IStudentClass,
    month: string // Format: YYYY-MM
  ): number {
    const sessionsInMonth = this.calculateSessionsInMonth(
      classData.startDate,
      classData.schedules,
      month
    );

    if (sessionsInMonth === 0) {
      return 0;
    }

    // Tính học phí dựa trên số buổi học thực tế
    const monthDate = parseISO(`${month}-01`);
    const startDateObj = parseISO(classData.startDate);

    // Kiểm tra xem có phải tháng bắt đầu không
    const isStartMonth =
      monthDate.getMonth() === startDateObj.getMonth() &&
      monthDate.getFullYear() === startDateObj.getFullYear();

    let tuitionPerSession: number;

    if (isStartMonth) {
      // Tháng bắt đầu: tính theo số buổi học thực tế
      // Giả sử học phí chuẩn cho 8 buổi/tháng
      const standardSessionsPerMonth = 8;
      tuitionPerSession = classData.tuition / standardSessionsPerMonth;

      console.log(
        `Tháng bắt đầu ${month}: ${sessionsInMonth} buổi học, học phí/buổi: ${tuitionPerSession}`
      );
    } else {
      // Các tháng khác: tính theo học phí chuẩn
      tuitionPerSession = classData.tuition / 8;

      console.log(
        `Tháng ${month}: ${sessionsInMonth} buổi học, học phí/buổi: ${tuitionPerSession}`
      );
    }

    if (student.type === EStudentClassType.FULL) {
      const totalTuition = Math.round(tuitionPerSession * sessionsInMonth);
      console.log(`Học sinh ${student.fullName} (FULL): ${totalTuition} VNĐ`);
      return totalTuition;
    } else if (student.type === EStudentClassType.HALF) {
      // Học sinh HALF chỉ đóng 1/2 học phí
      const totalTuition = Math.round(
        (tuitionPerSession * sessionsInMonth) / 2
      );
      console.log(`Học sinh ${student.fullName} (HALF): ${totalTuition} VNĐ`);
      return totalTuition;
    }

    return 0;
  }

  // Tạo học phí cho tất cả học sinh trong lớp cho tháng cụ thể
  static async createTuitionForClass(
    classId: string,
    month: string, // Format: YYYY-MM
    createdBy?: string
  ): Promise<void> {
    const classData = await ClassService.getClassById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Kiểm tra xem đã tạo học phí cho tháng này chưa
    const existingTuition = await this.getTuitionByClassAndMonth(
      classId,
      month
    );
    if (existingTuition.length > 0) {
      console.log(`Đã tạo học phí cho lớp ${classData.name} tháng ${month}`);
      return;
    }

    const monthDate = parseISO(`${month}-01`);
    const dueDate = format(addMonths(monthDate, 1), 'yyyy-MM-dd'); // Hạn đóng: đầu tháng tiếp theo

    const tuitionFees: Omit<ITuitionFee, 'id' | 'createdAt' | 'updatedAt'>[] =
      [];

    for (const student of classData.students) {
      const amount = this.calculateTuitionForStudent(classData, student, month);

      if (amount > 0) {
        tuitionFees.push({
          classId: classData.id,
          className: classData.name,
          studentId: student.studentId,
          studentName: student.fullName || '',
          month,
          year: monthDate.getFullYear(),
          monthNumber: monthDate.getMonth() + 1,
          amount,
          paidAmount: 0,
          status: ETuitionStatus.PENDING,
          dueDate,
          createdBy: createdBy || 'system',
        });
      }
    }

    // Lưu tất cả học phí vào database
    for (const tuitionFee of tuitionFees) {
      await addDoc(collection(db, COLLECTION), {
        ...tuitionFee,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    console.log(
      `Đã tạo ${tuitionFees.length} học phí cho lớp ${classData.name} tháng ${month}`
    );
  }

  // Tạo học phí cho tất cả lớp học cho tháng hiện tại
  static async createTuitionForCurrentMonth(createdBy?: string): Promise<void> {
    const currentMonth = format(new Date(), 'yyyy-MM');

    try {
      // Lấy tất cả lớp học
      const classesResult = await ClassService.getClasses(1, 1000);

      for (const classData of classesResult.classes) {
        try {
          await this.createTuitionForClass(
            classData.id,
            currentMonth,
            createdBy
          );
        } catch (error) {
          console.error(
            `Lỗi khi tạo học phí cho lớp ${classData.name}:`,
            error
          );
        }
      }

      console.log(`Đã tạo học phí cho tháng ${currentMonth}`);
    } catch (error) {
      console.error('Lỗi khi tạo học phí cho tháng hiện tại:', error);
      throw error;
    }
  }

  // Lấy học phí theo lớp và tháng
  static async getTuitionByClassAndMonth(
    classId: string,
    month: string
  ): Promise<ITuitionFee[]> {
    const q = query(
      collection(db, COLLECTION),
      where('classId', '==', classId),
      where('month', '==', month)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as ITuitionFee
    );
  }

  // Lấy học phí theo học sinh
  static async getTuitionByStudent(studentId: string): Promise<ITuitionFee[]> {
    const q = query(
      collection(db, COLLECTION),
      where('studentId', '==', studentId),
      orderBy('month', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as ITuitionFee
    );
  }

  // Cập nhật trạng thái học phí
  static async updateTuitionStatus(
    tuitionId: string,
    status: ETuitionStatus,
    paidAmount?: number,
    paidDate?: string,
    note?: string,
    updatedBy?: string
  ): Promise<void> {
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: updatedBy || 'system',
    };

    if (paidAmount !== undefined) {
      updateData.paidAmount = paidAmount;
    }

    if (paidDate) {
      updateData.paidDate = paidDate;
    }

    if (note !== undefined) {
      updateData.note = note;
    }

    await updateDoc(doc(db, COLLECTION, tuitionId), updateData);
  }

  // Lấy tổng kết học phí theo lớp và tháng
  static async getTuitionSummary(
    classId: string,
    month: string
  ): Promise<ITuitionSummary | null> {
    const tuitionFees = await this.getTuitionByClassAndMonth(classId, month);

    if (tuitionFees.length === 0) {
      return null;
    }

    const totalStudents = tuitionFees.length;
    const totalAmount = tuitionFees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = tuitionFees.reduce(
      (sum, fee) => sum + fee.paidAmount,
      0
    );
    const pendingAmount = tuitionFees
      .filter(fee => fee.status === ETuitionStatus.PENDING)
      .reduce((sum, fee) => sum + fee.amount, 0);
    const overdueAmount = tuitionFees
      .filter(fee => fee.status === ETuitionStatus.OVERDUE)
      .reduce((sum, fee) => sum + fee.amount, 0);

    const paidCount = tuitionFees.filter(
      fee => fee.status === ETuitionStatus.PAID
    ).length;
    const pendingCount = tuitionFees.filter(
      fee => fee.status === ETuitionStatus.PENDING
    ).length;
    const overdueCount = tuitionFees.filter(
      fee => fee.status === ETuitionStatus.OVERDUE
    ).length;

    return {
      classId,
      className: tuitionFees[0]?.className || '',
      month,
      totalStudents,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      paidCount,
      pendingCount,
      overdueCount,
    };
  }

  // Xóa học phí
  static async deleteTuition(tuitionId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, tuitionId));
  }
}

export default TuitionService;
