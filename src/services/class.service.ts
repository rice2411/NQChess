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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  IClass,
  IStudentClass,
  EStudentClassType,
} from '@/interfaces/class.interface';
import { AttendanceService } from './attendance.service';
import { TuitionService } from './tuition.service';
import { calculateClassDates } from '@/utils/dateUtils';
import { EAttendanceStatus } from '@/interfaces/attendance.interface';

const COLLECTION = 'classes';

export class ClassService {
  // Tạo lớp học mới
  static async createClass(
    data: Omit<IClass, 'id' | 'createdAt' | 'updatedAt'>,
    createdBy?: string
  ): Promise<IClass> {
    const now = new Date().toISOString();
    const newClass = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(collection(db, COLLECTION), newClass);
    const createdClass = { id: docRef.id, ...newClass } as IClass;

    // Tự động tạo buổi điểm danh cho các ngày học từ startDate đến ngày hiện tại
    try {
      await this.createAttendanceSessionsForClass(createdClass, createdBy);
    } catch (error) {
      console.error('Lỗi khi tạo buổi điểm danh:', error);
      // Không throw error để không ảnh hưởng đến việc tạo lớp học
    }

    // Tự động tạo học phí cho tháng hiện tại và các tháng tiếp theo
    try {
      await this.createTuitionForNewClass(createdClass, createdBy);
    } catch (error) {
      console.error('Lỗi khi tạo học phí:', error);
      // Không throw error để không ảnh hưởng đến việc tạo lớp học
    }

    return createdClass;
  }

  // Lấy danh sách lớp học có phân trang
  static async getClasses(
    page = 1,
    pageSize = 10
  ): Promise<{ classes: IClass[]; total: number; hasMore: boolean }> {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const all = snapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as IClass
    );
    const total = all.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const classes = all.slice(start, end);
    return {
      classes,
      total,
      hasMore: end < total,
    };
  }

  // Lấy chi tiết lớp học
  static async getClassById(id: string): Promise<IClass | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as IClass;
  }

  // Cập nhật lớp học
  static async updateClass(
    id: string,
    data: Partial<Omit<IClass, 'id' | 'createdAt'>>,
    updatedBy?: string
  ): Promise<void> {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(doc(db, COLLECTION, id), updateData);

    // Nếu cập nhật schedule, tạo buổi điểm danh cho các ngày học mới
    if (data.schedules) {
      try {
        await this.createAttendanceSessionsForUpdatedClass(id, updatedBy);
      } catch (error) {
        console.error('Lỗi khi tạo buổi điểm danh cho schedule mới:', error);
      }
    }
  }

  // Tạo buổi điểm danh cho lớp học đã cập nhật schedule
  private static async createAttendanceSessionsForUpdatedClass(
    classId: string,
    updatedBy?: string
  ): Promise<void> {
    const classDoc = await this.getClassById(classId);
    if (!classDoc || !classDoc.schedules || classDoc.schedules.length === 0) {
      return;
    }

    // Tính toán các ngày học từ ngày hiện tại trở đi
    const currentDate = new Date();
    const classDates = calculateClassDates(
      classDoc.startDate,
      classDoc.schedules,
      currentDate.toISOString().split('T')[0]
    );

    // Lọc ra các ngày học từ ngày hiện tại trở đi
    const futureDates = classDates.filter(date => {
      const dateObj = new Date(date.date);
      return dateObj >= currentDate;
    });

    // Tạo buổi điểm danh cho các ngày học mới
    for (const classDate of futureDates) {
      try {
        const exists = await AttendanceService.checkAttendanceExists(
          classId,
          classDate.sessionNumber,
          classDate.date
        );

        if (!exists) {
          await AttendanceService.createAttendanceSession(
            classId,
            classDate.sessionNumber,
            classDate.date,
            classDate.schedule,
            updatedBy
          );
        }
      } catch (error) {
        console.error(
          `Lỗi khi tạo buổi điểm danh số ${classDate.sessionNumber}:`,
          error
        );
      }
    }
  }

  // Xóa lớp học
  static async deleteClass(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }

  // Thêm nhiều học sinh vào lớp
  static async addStudentsToClass(
    classId: string,
    students: IStudentClass[],
    updatedBy?: string
  ): Promise<void> {
    const classDoc = await this.getClassById(classId);
    if (!classDoc) throw new Error('Class not found');
    // Gộp danh sách học sinh cũ và mới, tránh trùng studentId
    const existing = classDoc.students || [];
    const merged = [
      ...existing.filter(
        s => !students.some(ns => ns.studentId === s.studentId)
      ),
      ...students,
    ];
    await updateDoc(doc(db, COLLECTION, classId), {
      students: merged,
      updatedAt: new Date().toISOString(),
    });

    // Cập nhật danh sách học sinh trong các buổi điểm danh hiện có
    await this.updateAttendanceRecordsForNewStudents(classId, students);

    // Tạo học phí cho học sinh mới
    try {
      await this.createTuitionForNewStudents(classId, students, updatedBy);
    } catch (error) {
      console.error('Lỗi khi tạo học phí cho học sinh mới:', error);
    }
  }

  // Xóa học sinh khỏi lớp
  static async removeStudentFromClass(
    classId: string,
    studentId: string
  ): Promise<void> {
    const classDoc = await this.getClassById(classId);
    if (!classDoc) throw new Error('Class not found');
    const filtered = (classDoc.students || []).filter(
      s => s.studentId !== studentId
    );
    await updateDoc(doc(db, COLLECTION, classId), {
      students: filtered,
      updatedAt: new Date().toISOString(),
    });
  }

  // Tính học phí cần đóng cho 1 học sinh trong tháng
  static calculateTuition(classDoc: IClass, student: IStudentClass): number {
    // 8 buổi = 1 tháng
    // Nếu học full: đóng toàn bộ học phí
    // Nếu học nửa buổi: đóng 1/2 học phí
    if (student.type === EStudentClassType.FULL) return classDoc.tuition;
    return Math.round(classDoc.tuition / 2);
  }

  // Tạo danh sách tháng cần tạo học phí
  private static generateMonthsToCreate(
    startDate: string,
    includeNextMonth = true
  ): string[] {
    const start = new Date(startDate);
    const current = new Date();

    // Tạo danh sách từ tháng bắt đầu đến tháng hiện tại
    const startMonth = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(current.getFullYear(), current.getMonth(), 1);

    const months: string[] = [];
    const currentMonth = new Date(startMonth);

    while (currentMonth <= endMonth) {
      const monthStr =
        currentMonth.getFullYear() +
        '-' +
        String(currentMonth.getMonth() + 1).padStart(2, '0');
      months.push(monthStr);
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    // Thêm tháng tiếp theo nếu cần
    if (includeNextMonth) {
      const nextMonth = new Date(current);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthStr =
        nextMonth.getFullYear() +
        '-' +
        String(nextMonth.getMonth() + 1).padStart(2, '0');
      months.push(nextMonthStr);
    }

    return months;
  }

  // Tạo học phí cho lớp học mới
  private static async createTuitionForNewClass(
    classData: IClass,
    createdBy?: string
  ): Promise<void> {
    if (!classData.students || classData.students.length === 0) {
      return;
    }

    // Tạo danh sách tháng cần tạo học phí
    const monthsToCreate = this.generateMonthsToCreate(
      classData.startDate,
      true
    );

    console.log(
      `Tạo học phí cho lớp ${classData.name} từ tháng ${classData.startDate} đến tháng hiện tại`
    );
    console.log('Các tháng cần tạo:', monthsToCreate);

    // Tạo học phí cho từng tháng
    for (const monthStr of monthsToCreate) {
      try {
        await TuitionService.createTuitionForClass(
          classData.id,
          monthStr,
          createdBy
        );
        console.log(`✅ Đã tạo học phí cho tháng ${monthStr}`);
      } catch (error) {
        console.error(`❌ Lỗi khi tạo học phí cho tháng ${monthStr}:`, error);
      }
    }
  }

  // Tạo học phí cho học sinh mới thêm vào lớp
  private static async createTuitionForNewStudents(
    classId: string,
    newStudents: IStudentClass[],
    createdBy?: string
  ): Promise<void> {
    const classDoc = await this.getClassById(classId);
    if (!classDoc) return;

    // Tạo danh sách tháng cần tạo học phí (từ tháng hiện tại đến tháng tiếp theo)
    const currentDate = new Date();

    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const monthsToCreate = [
      currentDate.getFullYear() +
        '-' +
        String(currentDate.getMonth() + 1).padStart(2, '0'),
      nextMonth.getFullYear() +
        '-' +
        String(nextMonth.getMonth() + 1).padStart(2, '0'),
    ];

    console.log(`Tạo học phí cho học sinh mới trong lớp ${classDoc.name}`);
    console.log('Các tháng cần tạo:', monthsToCreate);

    // Tạo học phí cho từng tháng
    for (const monthStr of monthsToCreate) {
      try {
        await TuitionService.createTuitionForClass(
          classId,
          monthStr,
          createdBy
        );
        console.log(`✅ Đã tạo học phí cho học sinh mới tháng ${monthStr}`);
      } catch (error) {
        console.error(
          `❌ Lỗi khi tạo học phí cho học sinh mới tháng ${monthStr}:`,
          error
        );
      }
    }
  }

  // Tạo buổi điểm danh cho lớp học từ startDate đến ngày hiện tại
  private static async createAttendanceSessionsForClass(
    classData: IClass,
    createdBy?: string
  ): Promise<void> {
    // Đảm bảo createdBy có giá trị mặc định
    const creator = createdBy || 'system';
    if (!classData.schedules || classData.schedules.length === 0) {
      return;
    }

    // Tính toán các ngày học từ startDate đến ngày hiện tại
    const classDates = calculateClassDates(
      classData.startDate,
      classData.schedules
    );

    // Tạo buổi điểm danh cho từng ngày học
    for (const classDate of classDates) {
      try {
        // Kiểm tra xem buổi điểm danh đã tồn tại chưa
        const exists = await AttendanceService.checkAttendanceExists(
          classData.id,
          classDate.sessionNumber,
          classDate.date
        );

        if (!exists) {
          await AttendanceService.createAttendanceSession(
            classData.id,
            classDate.sessionNumber,
            classDate.date,
            classDate.schedule,
            creator
          );
        } else {
        }
      } catch (error) {
        console.error(
          `Lỗi khi tạo buổi điểm danh số ${classDate.sessionNumber}:`,
          error
        );
        // Tiếp tục tạo các buổi khác nếu có lỗi
      }
    }
  }

  // Cập nhật danh sách học sinh trong các buổi điểm danh hiện có
  private static async updateAttendanceRecordsForNewStudents(
    classId: string,
    newStudents: IStudentClass[]
  ): Promise<void> {
    try {
      // Lấy tất cả buổi điểm danh của lớp
      const attendanceList = await AttendanceService.getAttendanceByClass(
        classId,
        1,
        1000
      );

      for (const attendance of attendanceList.attendance) {
        const updatedRecords = [...attendance.attendanceRecords];

        // Thêm học sinh mới vào danh sách điểm danh
        for (const student of newStudents) {
          const existingRecord = updatedRecords.find(
            r => r.studentId === student.studentId
          );
          if (!existingRecord) {
            // Chỉ thêm học sinh nếu phù hợp với buổi học này
            let shouldAdd = false;

            // Học sinh FULL được tham gia tất cả buổi học
            if (student.type === EStudentClassType.FULL) {
              shouldAdd = true;
            }

            // Học sinh HALF chỉ tham gia buổi học cụ thể
            if (student.type === EStudentClassType.HALF && student.session) {
              shouldAdd = student.session === attendance.sessionTime;
            }

            if (shouldAdd) {
              updatedRecords.push({
                studentId: student.studentId,
                studentName: student.fullName,
                status: EAttendanceStatus.ABSENT, // Mặc định vắng mặt
                sessionNumber: attendance.sessionNumber,
                studentSession: student.session, // Thêm thông tin buổi học của học sinh
                note: '',
              });
            }
          }
        }

        // Cập nhật buổi điểm danh với danh sách học sinh mới
        if (updatedRecords.length !== attendance.attendanceRecords.length) {
          const stats =
            AttendanceService.calculateAttendanceStats(updatedRecords);
          await AttendanceService.updateAttendance(attendance.id, {
            attendanceRecords: updatedRecords,
            ...stats,
          });
        }
      }
    } catch (error) {
      console.error(
        'Lỗi khi cập nhật danh sách học sinh trong buổi điểm danh:',
        error
      );
    }
  }
}

export default ClassService;
