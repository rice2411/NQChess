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
  where,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  IAttendance,
  IAttendanceRecord,
  IAttendanceSummary,
  IAttendanceFilter,
  EAttendanceStatus,
} from '@/interfaces/attendance.interface';
import { ClassService } from './class.service';
import { COLLECTIONS } from '@/constants/collections';

export class AttendanceService {
  // Tạo buổi điểm danh mới
  static async createAttendance(
    data: Omit<IAttendance, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IAttendance> {
    const now = (
      typeof window !== 'undefined' ? new Date() : new Date(0)
    ).toISOString();
    const newAttendance = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(
      collection(db, COLLECTIONS.ATTENDANCE),
      newAttendance
    );
    return { id: docRef.id, ...newAttendance } as IAttendance;
  }

  // Lấy danh sách điểm danh có phân trang
  static async getAttendanceList(
    page = 1,
    pageSize = 10,
    filters?: IAttendanceFilter
  ): Promise<{ attendance: IAttendance[]; total: number; hasMore: boolean }> {
    const constraints: QueryConstraint[] = [orderBy('sessionDate', 'desc')];

    if (filters?.classId) {
      constraints.push(where('classId', '==', filters.classId));
    }

    if (filters?.startDate) {
      constraints.push(where('sessionDate', '>=', filters.startDate));
    }

    if (filters?.endDate) {
      constraints.push(where('sessionDate', '<=', filters.endDate));
    }

    const q = query(collection(db, COLLECTIONS.ATTENDANCE), ...constraints);
    const snapshot = await getDocs(q);
    const all = snapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as IAttendance
    );

    const total = all.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const attendance = all.slice(start, end);

    return {
      attendance,
      total,
      hasMore: end < total,
    };
  }

  // Lấy chi tiết buổi điểm danh
  static async getAttendanceById(id: string): Promise<IAttendance | null> {
    const docRef = doc(db, COLLECTIONS.ATTENDANCE, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as IAttendance;
  }

  // Cập nhật buổi điểm danh
  static async updateAttendance(
    id: string,
    data: Partial<Omit<IAttendance, 'id' | 'createdAt'>>
  ): Promise<void> {
    const updateData = {
      ...data,
      updatedAt: (typeof window !== 'undefined'
        ? new Date()
        : new Date(0)
      ).toISOString(),
    };
    await updateDoc(doc(db, COLLECTIONS.ATTENDANCE, id), updateData);
  }

  // Xóa buổi điểm danh
  static async deleteAttendance(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.ATTENDANCE, id));
  }

  // Tạo buổi điểm danh cho tháng mới
  static async createAttendanceForMonth(
    classId: string,
    month: string, // Format: YYYY-MM
    createdBy?: string
  ): Promise<void> {
    const classData = await ClassService.getClassById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Kiểm tra xem đã tạo buổi điểm danh cho tháng này chưa
    const existingAttendance = await this.getAttendanceByClass(
      classId,
      1,
      1000
    );
    const monthAttendance = existingAttendance.attendance.filter(att => {
      const attendanceMonth = att.sessionDate.substring(0, 7); // Lấy YYYY-MM
      return attendanceMonth === month;
    });

    if (monthAttendance.length > 0) {
      console.log(
        `Đã tạo buổi điểm danh cho lớp ${classData.name} tháng ${month}`
      );
      return;
    }

    // Tính toán các ngày học trong tháng
    const monthStart =
      typeof window !== 'undefined' ? new Date(`${month}-01`) : new Date(0);
    const monthEnd =
      typeof window !== 'undefined'
        ? new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
        : new Date(0);
    const startDate =
      typeof window !== 'undefined'
        ? new Date(classData.startDate)
        : new Date(0);

    // Chỉ tạo buổi điểm danh nếu tháng này >= tháng bắt đầu lớp học
    if (
      monthStart < new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    ) {
      console.log(`Lớp ${classData.name} chưa bắt đầu trong tháng ${month}`);
      return;
    }

    // Tạo buổi điểm danh cho từng ngày học trong tháng
    const currentDate =
      typeof window !== 'undefined' ? new Date(monthStart) : new Date(0);
    let sessionNumber = 1;

    while (currentDate <= monthEnd) {
      const dayOfWeek = currentDate.getDay();
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
      const hasSchedule = classData.schedules.some(schedule =>
        schedule.includes(currentWeekday)
      );

      // Chỉ tạo buổi điểm danh nếu:
      // 1. Có lịch học vào thứ này
      // 2. Ngày hiện tại >= ngày bắt đầu lớp học
      if (hasSchedule && currentDate >= startDate) {
        const sessionDate = currentDate.toISOString().split('T')[0];

        // Tạo buổi điểm danh cho từng lịch học trong ngày
        for (const schedule of classData.schedules) {
          if (schedule.includes(currentWeekday)) {
            try {
              // Kiểm tra xem buổi điểm danh đã tồn tại chưa
              const exists = await this.checkAttendanceExists(
                classId,
                sessionNumber,
                sessionDate
              );

              if (!exists) {
                await this.createAttendanceSession(
                  classId,
                  sessionNumber,
                  sessionDate,
                  schedule,
                  createdBy
                );
                console.log(
                  `✅ Đã tạo buổi điểm danh số ${sessionNumber} cho ${sessionDate} (${schedule})`
                );
              } else {
                console.log(
                  `⏭️ Buổi điểm danh số ${sessionNumber} cho ${sessionDate} đã tồn tại`
                );
              }

              sessionNumber++;
            } catch (error) {
              console.error(
                `❌ Lỗi khi tạo buổi điểm danh số ${sessionNumber}:`,
                error
              );
            }
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(
      `Đã tạo ${sessionNumber - 1} buổi điểm danh cho lớp ${classData.name} tháng ${month}`
    );
  }

  // Lấy danh sách điểm danh theo lớp học
  static async getAttendanceByClass(
    classId: string,
    page = 1,
    pageSize = 10
  ): Promise<{ attendance: IAttendance[]; total: number; hasMore: boolean }> {
    const q = query(
      collection(db, COLLECTIONS.ATTENDANCE),
      where('classId', '==', classId),
      orderBy('sessionDate', 'desc')
    );
    const snapshot = await getDocs(q);
    const all = snapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as IAttendance
    );

    const total = all.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const attendance = all.slice(start, end);

    return {
      attendance,
      total,
      hasMore: end < total,
    };
  }

  // Lấy điểm danh theo học sinh
  static async getAttendanceByStudent(
    studentId: string,
    classId?: string,
    page = 1,
    pageSize = 10
  ): Promise<{ attendance: IAttendance[]; total: number; hasMore: boolean }> {
    try {
      const constraints: QueryConstraint[] = [orderBy('sessionDate', 'desc')];

      if (classId) {
        constraints.push(where('classId', '==', classId));
      }

      const q = query(collection(db, COLLECTIONS.ATTENDANCE), ...constraints);
      const snapshot = await getDocs(q);
      const all = snapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() }) as IAttendance
      );

      // Filter theo studentId (vì attendance records chứa thông tin của tất cả học sinh)
      const filteredAttendance = all.filter(attendance =>
        attendance.attendanceRecords?.some(
          record => record.studentId === studentId
        )
      );

      const total = filteredAttendance.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const attendance = filteredAttendance.slice(start, end);

      return {
        attendance,
        total,
        hasMore: end < total,
      };
    } catch (error) {
      console.error('Error fetching attendance by student:', error);
      throw new Error('Không thể lấy thông tin điểm danh của học sinh');
    }
  }

  // Lấy điểm danh của một học sinh trong một lớp cụ thể với phân trang
  static async getAttendancesByStudentAndClass(
    studentId: string,
    classId: string,
    page = 1,
    pageSize = 10
  ): Promise<{ attendances: IAttendance[]; total: number; hasMore: boolean }> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ATTENDANCE),
        where('classId', '==', classId),
        orderBy('sessionDate', 'desc')
      );
      const snapshot = await getDocs(q);
      const all = snapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() }) as IAttendance
      );

      // Filter theo studentId và chỉ lấy các buổi có điểm danh của học sinh này
      const filteredAttendance = all.filter(attendance =>
        attendance.attendanceRecords?.some(
          record => record.studentId === studentId
        )
      );

      const total = filteredAttendance.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const attendances = filteredAttendance.slice(start, end);

      return {
        attendances,
        total,
        hasMore: end < total,
      };
    } catch (error) {
      console.error('Error fetching attendances by student and class:', error);
      throw new Error(
        'Không thể lấy thông tin điểm danh của học sinh trong lớp'
      );
    }
  }

  // Cập nhật trạng thái điểm danh của học sinh
  static async updateStudentAttendance(
    attendanceId: string,
    studentId: string,
    status: EAttendanceStatus,
    note?: string
  ): Promise<void> {
    const attendance = await this.getAttendanceById(attendanceId);
    if (!attendance) throw new Error('Attendance session not found');

    const updatedRecords = attendance.attendanceRecords.map(record => {
      if (record.studentId === studentId) {
        return {
          ...record,
          status,
          note: note || record.note,
        };
      }
      return record;
    });

    // Tính toán lại thống kê
    const stats = this.calculateAttendanceStats(updatedRecords);

    await updateDoc(doc(db, COLLECTIONS.ATTENDANCE, attendanceId), {
      attendanceRecords: updatedRecords,
      ...stats,
      updatedAt: (typeof window !== 'undefined'
        ? new Date()
        : new Date(0)
      ).toISOString(),
    });
  }

  // Tạo buổi điểm danh mới cho lớp học
  static async createAttendanceSession(
    classId: string,
    sessionNumber: number,
    sessionDate: string,
    sessionTime: string,
    createdBy?: string
  ): Promise<IAttendance> {
    const classDoc = await ClassService.getClassById(classId);
    if (!classDoc) throw new Error('Class not found');

    // Filter học sinh dựa trên loại học phí và session
    const eligibleStudents = classDoc.students.filter(student => {
      // Học sinh FULL được tham gia tất cả buổi học
      if (student.type === 'FULL') {
        return true;
      }

      // Học sinh HALF chỉ tham gia buổi học cụ thể
      if (student.type === 'HALF' && student.session) {
        // Chỉ thêm học sinh nếu studentSession khớp với sessionTime
        return student.session === sessionTime;
      }

      // Học sinh HALF không có session cụ thể không được tham gia
      return false;
    });

    // Tạo danh sách điểm danh chỉ cho học sinh phù hợp
    const attendanceRecords: IAttendanceRecord[] = eligibleStudents.map(
      student => ({
        studentId: student.studentId,
        studentName: student.fullName || '',
        status: EAttendanceStatus.ABSENT, // Mặc định vắng mặt
        sessionNumber,
        studentSession: student.session, // Thêm thông tin buổi học của học sinh
        note: '',
      })
    );

    const stats = this.calculateAttendanceStats(attendanceRecords);

    const attendanceData: Omit<IAttendance, 'id' | 'createdAt' | 'updatedAt'> =
      {
        classId,
        className: classDoc.name,
        sessionNumber,
        sessionDate,
        sessionTime,
        attendanceRecords,
        ...stats, // stats đã bao gồm totalStudents
        createdBy: createdBy || 'system', // Đảm bảo có giá trị mặc định
      };

    // Loại bỏ các trường undefined khỏi attendanceRecords
    const cleanAttendanceRecords = attendanceRecords.map(record => {
      const cleanRecord: any = { ...record };
      if (cleanRecord.note === undefined) delete cleanRecord.note;
      if (cleanRecord.studentSession === undefined)
        delete cleanRecord.studentSession;
      return cleanRecord;
    });

    const cleanAttendanceData = {
      ...attendanceData,
      attendanceRecords: cleanAttendanceRecords,
    };

    return await this.createAttendance(cleanAttendanceData);
  }

  // Tính toán thống kê điểm danh
  static calculateAttendanceStats(records: IAttendanceRecord[]) {
    const presentCount = records.filter(
      r => r.status === EAttendanceStatus.PRESENT
    ).length;
    const absentCount = records.filter(
      r => r.status === EAttendanceStatus.ABSENT
    ).length;
    const lateCount = records.filter(
      r => r.status === EAttendanceStatus.LATE
    ).length;
    const excusedCount = records.filter(
      r => r.status === EAttendanceStatus.EXCUSED
    ).length;

    return {
      totalStudents: records.length,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
    };
  }

  // Lấy thống kê điểm danh của học sinh
  static async getStudentAttendanceSummary(
    studentId: string,
    classId?: string
  ): Promise<IAttendanceSummary> {
    const constraints: QueryConstraint[] = [orderBy('sessionDate', 'desc')];

    if (classId) {
      constraints.push(where('classId', '==', classId));
    }

    const q = query(collection(db, COLLECTIONS.ATTENDANCE), ...constraints);
    const snapshot = await getDocs(q);
    const allAttendance = snapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as IAttendance
    );

    let totalSessions = 0;
    let presentSessions = 0;
    let absentSessions = 0;
    let lateSessions = 0;
    let excusedSessions = 0;
    let className = '';
    let studentName = '';

    allAttendance.forEach(att => {
      const studentRecord = att.attendanceRecords.find(
        r => r.studentId === studentId
      );
      if (studentRecord) {
        totalSessions++;
        className = att.className || '';
        studentName = studentRecord.studentName || '';

        switch (studentRecord.status) {
          case EAttendanceStatus.PRESENT:
            presentSessions++;
            break;
          case EAttendanceStatus.ABSENT:
            absentSessions++;
            break;
          case EAttendanceStatus.LATE:
            lateSessions++;
            break;
          case EAttendanceStatus.EXCUSED:
            excusedSessions++;
            break;
        }
      }
    });

    const attendanceRate =
      totalSessions > 0
        ? Math.round((presentSessions / totalSessions) * 100)
        : 0;

    return {
      classId: classId || '',
      className,
      studentId,
      studentName,
      totalSessions,
      presentSessions,
      absentSessions,
      lateSessions,
      excusedSessions,
      attendanceRate,
    };
  }

  // Lấy thống kê điểm danh của lớp học
  static async getClassAttendanceSummary(classId: string): Promise<{
    totalSessions: number;
    averageAttendanceRate: number;
    studentSummaries: IAttendanceSummary[];
  }> {
    const classDoc = await ClassService.getClassById(classId);
    if (!classDoc) throw new Error('Class not found');

    const attendanceList = await this.getAttendanceByClass(classId, 1, 1000);
    const totalSessions = attendanceList.total;

    const studentSummaries: IAttendanceSummary[] = [];
    let totalAttendanceRate = 0;

    for (const student of classDoc.students) {
      const summary = await this.getStudentAttendanceSummary(
        student.studentId,
        classId
      );
      studentSummaries.push(summary);
      totalAttendanceRate += summary.attendanceRate;
    }

    const averageAttendanceRate =
      classDoc.students.length > 0
        ? Math.round(totalAttendanceRate / classDoc.students.length)
        : 0;

    return {
      totalSessions,
      averageAttendanceRate,
      studentSummaries,
    };
  }

  // Kiểm tra xem buổi điểm danh đã tồn tại chưa
  static async checkAttendanceExists(
    classId: string,
    sessionNumber: number,
    sessionDate: string
  ): Promise<boolean> {
    const q = query(
      collection(db, COLLECTIONS.ATTENDANCE),
      where('classId', '==', classId),
      where('sessionNumber', '==', sessionNumber),
      where('sessionDate', '==', sessionDate)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }
}

export default AttendanceService;
