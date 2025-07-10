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
import { IClass } from '@/interfaces/class.interface';
import { ClassService } from './class.service';

const COLLECTION = 'attendance';

export class AttendanceService {
  // Tạo buổi điểm danh mới
  static async createAttendance(
    data: Omit<IAttendance, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IAttendance> {
    const now = new Date().toISOString();
    const newAttendance = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(collection(db, COLLECTION), newAttendance);
    return { id: docRef.id, ...newAttendance } as IAttendance;
  }

  // Lấy danh sách điểm danh có phân trang
  static async getAttendanceList(
    page = 1,
    pageSize = 10,
    filters?: IAttendanceFilter
  ): Promise<{ attendance: IAttendance[]; total: number; hasMore: boolean }> {
    let constraints: QueryConstraint[] = [orderBy('sessionDate', 'desc')];

    if (filters?.classId) {
      constraints.push(where('classId', '==', filters.classId));
    }

    if (filters?.startDate) {
      constraints.push(where('sessionDate', '>=', filters.startDate));
    }

    if (filters?.endDate) {
      constraints.push(where('sessionDate', '<=', filters.endDate));
    }

    const q = query(collection(db, COLLECTION), ...constraints);
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
    const docRef = doc(db, COLLECTION, id);
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
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(doc(db, COLLECTION, id), updateData);
  }

  // Xóa buổi điểm danh
  static async deleteAttendance(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }

  // Lấy danh sách điểm danh theo lớp học
  static async getAttendanceByClass(
    classId: string,
    page = 1,
    pageSize = 10
  ): Promise<{ attendance: IAttendance[]; total: number; hasMore: boolean }> {
    const q = query(
      collection(db, COLLECTION),
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

  // Lấy danh sách điểm danh theo học sinh
  static async getAttendanceByStudent(
    studentId: string,
    classId?: string,
    page = 1,
    pageSize = 10
  ): Promise<{ attendance: IAttendance[]; total: number; hasMore: boolean }> {
    let constraints: QueryConstraint[] = [orderBy('sessionDate', 'desc')];

    if (classId) {
      constraints.push(where('classId', '==', classId));
    }

    const q = query(collection(db, COLLECTION), ...constraints);
    const snapshot = await getDocs(q);
    const all = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }) as IAttendance)
      .filter(att =>
        att.attendanceRecords.some(record => record.studentId === studentId)
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

    await updateDoc(doc(db, COLLECTION, attendanceId), {
      attendanceRecords: updatedRecords,
      ...stats,
      updatedAt: new Date().toISOString(),
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
    let constraints: QueryConstraint[] = [orderBy('sessionDate', 'desc')];

    if (classId) {
      constraints.push(where('classId', '==', classId));
    }

    const q = query(collection(db, COLLECTION), ...constraints);
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
      collection(db, COLLECTION),
      where('classId', '==', classId),
      where('sessionNumber', '==', sessionNumber),
      where('sessionDate', '==', sessionDate)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }
}

export default AttendanceService;
