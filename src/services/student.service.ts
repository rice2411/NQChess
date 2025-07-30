import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EGender, IStudent } from '@/interfaces/student.interface';
import { COLLECTIONS } from '@/constants/collections';
import { getAvatarUrl } from '@/constants/avatar';

export class StudentService {
  // ===== STUDENT MANAGEMENT =====

  /**
   * Lấy tất cả học sinh
   */
  static async getAllStudents(): Promise<IStudent[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.STUDENTS),
        orderBy('fullName'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() }) as IStudent
      );
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new Error('Không thể lấy danh sách học sinh');
    }
  }

  /**
   * Lấy học sinh theo ID
   */
  static async getStudentById(id: string): Promise<IStudent | null> {
    try {
      const docRef = doc(db, COLLECTIONS.STUDENTS, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as IStudent;
      }
      return null;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw new Error('Không thể lấy thông tin học sinh');
    }
  }

  /**
   * Tìm kiếm học sinh theo tên
   */
  static async searchStudentsByName(searchText: string): Promise<IStudent[]> {
    try {
      if (!searchText.trim()) {
        return this.getAllStudents();
      }

      const q = query(
        collection(db, COLLECTIONS.STUDENTS),
        where('fullName', '>=', searchText),
        where('fullName', '<=', searchText + '\uf8ff'),
        orderBy('fullName')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() }) as IStudent
      );
    } catch (error) {
      console.error('Error searching students:', error);
      throw new Error('Không thể tìm kiếm học sinh');
    }
  }

  /**
   * Tìm kiếm học sinh theo tên và số điện thoại
   */
  static async searchStudentsByNameAndPhone(
    searchText: string
  ): Promise<IStudent[]> {
    try {
      if (!searchText.trim()) {
        return this.getAllStudents();
      }

      const searchLower = searchText.toLowerCase().trim();

      // Lấy tất cả học sinh và filter ở client side
      const q = query(
        collection(db, COLLECTIONS.STUDENTS),
        orderBy('fullName'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      const allStudents = snapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() }) as IStudent
      );

      // Filter theo tên hoặc số điện thoại
      return allStudents.filter(student => {
        const fullName = student.fullName?.toLowerCase() || '';
        const phoneNumber = student.phoneNumber?.toLowerCase() || '';

        return (
          fullName.includes(searchLower) || phoneNumber.includes(searchLower)
        );
      });
    } catch (error) {
      console.error('Error searching students:', error);
      throw new Error('Không thể tìm kiếm học sinh');
    }
  }

  /**
   * Tìm kiếm học sinh theo đầy đủ thông tin (fullName, phoneNumber, dateOfBirth)
   * Sử dụng cho form tìm kiếm của phụ huynh
   */
  static async searchStudentByFullInfo(
    fullName: string,
    phoneNumber: string,
    dateOfBirth: string
  ): Promise<IStudent | null> {
    try {
      // Validate input
      if (!fullName.trim() || !phoneNumber.trim() || !dateOfBirth.trim()) {
        throw new Error('Vui lòng nhập đầy đủ thông tin tìm kiếm');
      }

      // Chuẩn hóa dữ liệu
      const normalizedFullName = fullName.trim().toLowerCase();
      const normalizedPhoneNumber = phoneNumber.trim();

      // Query theo số điện thoại trước (vì số điện thoại thường unique hơn)
      const phoneQuery = query(
        collection(db, COLLECTIONS.STUDENTS),
        where('phoneNumber', '==', normalizedPhoneNumber)
      );
      const phoneSnapshot = await getDocs(phoneQuery);

      if (phoneSnapshot.empty) {
        return null;
      }

      // Filter kết quả theo tên và ngày sinh
      const matchingStudents = phoneSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }) as IStudent)
        .filter(student => {
          const studentFullName = student.fullName?.toLowerCase() || '';
          const studentDateOfBirth = student.dateOfBirth || '';

          // Kiểm tra tên (cho phép tìm kiếm một phần tên)
          const nameMatch =
            studentFullName.includes(normalizedFullName) ||
            normalizedFullName.includes(studentFullName);

          // Kiểm tra ngày sinh (chính xác)
          const dateMatch = studentDateOfBirth === dateOfBirth;

          return nameMatch && dateMatch;
        });

      // Trả về học sinh đầu tiên nếu tìm thấy
      return matchingStudents.length > 0 ? matchingStudents[0] : null;
    } catch (error) {
      console.error('Error searching student by full info:', error);
      throw new Error('Không thể tìm kiếm học sinh');
    }
  }

  /**
   * Lọc học sinh theo giới tính
   */
  static async getStudentsByGender(gender: EGender): Promise<IStudent[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.STUDENTS),
        where('gender', '==', gender),
        orderBy('fullName'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() }) as IStudent
      );
    } catch (error) {
      console.error('Error filtering students by gender:', error);
      throw new Error('Không thể lọc học sinh theo giới tính');
    }
  }

  /**
   * Thêm học sinh mới
   */
  static async createStudent(
    studentData: Omit<IStudent, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IStudent> {
    try {
      const now = new Date().toISOString();
      const newStudent = {
        ...studentData,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(
        collection(db, COLLECTIONS.STUDENTS),
        newStudent
      );
      return { id: docRef.id, ...newStudent } as IStudent;
    } catch (error) {
      console.error('Error creating student:', error);
      throw new Error('Không thể thêm học sinh');
    }
  }

  /**
   * Cập nhật học sinh
   */
  static async updateStudent(
    id: string,
    studentData: Partial<Omit<IStudent, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.STUDENTS, id);
      await updateDoc(docRef, {
        ...studentData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating student:', error);
      throw new Error('Không thể cập nhật học sinh');
    }
  }

  /**
   * Xóa học sinh
   */
  static async deleteStudent(id: string): Promise<void> {
    try {
      const student = await this.getStudentById(id);
      if (student && student.avatar) {
        // Assuming CloudinaryService.deleteImage is removed,
        // we'll just return true as there's no external service to call.
        console.warn('Avatar deletion logic is not fully implemented yet.');
      }
      await deleteDoc(doc(db, COLLECTIONS.STUDENTS, id));
    } catch (error) {
      console.error('Error deleting student:', error);
      throw new Error('Không thể xóa học sinh');
    }
  }

  /**
   * Lấy danh sách học sinh có phân trang với traditional pagination
   */
  static async getStudentsWithPagination(
    page: number = 1,
    pageSize: number = 10,
    searchText?: string,
    gender?: EGender
  ): Promise<{
    students: IStudent[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      let allStudents: IStudent[] = [];

      // Nếu có search text, sử dụng function search mới
      if (searchText?.trim()) {
        allStudents = await this.searchStudentsByNameAndPhone(searchText);
      } else {
        // Lấy tất cả học sinh nếu không có search
        // Sử dụng orderBy với createdAt để đảm bảo thứ tự ổn định
        const q = query(
          collection(db, COLLECTIONS.STUDENTS),
          orderBy('fullName'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        allStudents = snapshot.docs.map(
          doc => ({ id: doc.id, ...doc.data() }) as IStudent
        );
      }

      // Filter theo giới tính nếu có
      if (gender) {
        allStudents = allStudents.filter(student => student.gender === gender);
      }

      const total = allStudents.length;

      // Tính offset cho traditional pagination
      const offset = (page - 1) * pageSize;

      // Slice để lấy trang hiện tại
      const startIndex = offset;
      const endIndex = startIndex + pageSize;
      const students = allStudents.slice(startIndex, endIndex);

      const hasMore = endIndex < total;

      return {
        students,
        total,
        hasMore,
      };
    } catch (error) {
      console.error('Error fetching students with pagination:', error);
      throw new Error('Không thể lấy danh sách học sinh');
    }
  }

  /**
   * Lấy tổng số học sinh (để hiển thị pagination info)
   */
  static async getTotalStudents(
    searchText?: string,
    gender?: EGender
  ): Promise<number> {
    try {
      let allStudents: IStudent[] = [];

      // Nếu có search text, sử dụng function search mới
      if (searchText?.trim()) {
        allStudents = await this.searchStudentsByNameAndPhone(searchText);
      } else {
        // Lấy tất cả học sinh nếu không có search
        const q = query(
          collection(db, COLLECTIONS.STUDENTS),
          orderBy('fullName'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        allStudents = snapshot.docs.map(
          doc => ({ id: doc.id, ...doc.data() }) as IStudent
        );
      }

      // Filter theo giới tính nếu có
      if (gender) {
        allStudents = allStudents.filter(student => student.gender === gender);
      }

      return allStudents.length;
    } catch (error) {
      console.error('Error getting total students:', error);
      return 0;
    }
  }

  // ===== UTILITY FUNCTIONS =====

  /**
   * Kiểm tra email đã tồn tại chưa
   */
  static async checkEmailExists(
    email: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, COLLECTIONS.STUDENTS),
        where('email', '==', email)
      );

      const snapshot = await getDocs(q);
      const existingStudent = snapshot.docs.find(doc => doc.id !== excludeId);

      return !!existingStudent;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  }

  /**
   * Kiểm tra số điện thoại đã tồn tại chưa
   */
  static async checkPhoneExists(
    phoneNumber: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, COLLECTIONS.STUDENTS),
        where('phoneNumber', '==', phoneNumber)
      );

      const snapshot = await getDocs(q);
      const existingStudent = snapshot.docs.find(doc => doc.id !== excludeId);

      return !!existingStudent;
    } catch (error) {
      console.error('Error checking phone existence:', error);
      return false;
    }
  }

  /**
   * Lấy thống kê học sinh
   */
  static async getStudentStats(): Promise<{
    total: number;
    male: number;
    female: number;
    recentAdded: number;
  }> {
    try {
      const [allStudents, maleStudents, femaleStudents, recentStudents] =
        await Promise.all([
          this.getAllStudents(),
          this.getStudentsByGender(EGender.MALE),
          this.getStudentsByGender(EGender.FEMALE),
          this.getRecentStudents(7), // 7 ngày gần đây
        ]);

      return {
        total: allStudents.length,
        male: maleStudents.length,
        female: femaleStudents.length,
        recentAdded: recentStudents.length,
      };
    } catch (error) {
      console.error('Error getting student stats:', error);
      throw new Error('Không thể lấy thống kê học sinh');
    }
  }

  /**
   * Lấy học sinh mới thêm trong khoảng thời gian
   */
  static async getRecentStudents(days: number): Promise<IStudent[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const q = query(
        collection(db, COLLECTIONS.STUDENTS),
        where('createdAt', '>=', cutoffDate.toISOString()),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() }) as IStudent
      );
    } catch (error) {
      console.error('Error fetching recent students:', error);
      throw new Error('Không thể lấy danh sách học sinh gần đây');
    }
  }

  /**
   * Tạo 100 học sinh mẫu
   */
  static async createSampleStudents(count: number = 100): Promise<{
    success: boolean;
    message: string;
    createdCount: number;
  }> {
    try {
      const sampleStudents: Omit<IStudent, 'id' | 'createdAt' | 'updatedAt'>[] =
        [];

      // Danh sách tên mẫu
      const firstNames = [
        'Nguyễn',
        'Trần',
        'Lê',
        'Phạm',
        'Hoàng',
        'Huỳnh',
        'Phan',
        'Vũ',
        'Võ',
        'Đặng',
        'Bùi',
        'Đỗ',
        'Hồ',
        'Ngô',
        'Dương',
        'Lý',
        'Đinh',
        'Tô',
        'Tạ',
        'Trịnh',
      ];

      const middleNames = [
        'Văn',
        'Thị',
        'Hoàng',
        'Minh',
        'Đức',
        'Thành',
        'Công',
        'Huy',
        'Tuấn',
        'Duy',
        'Anh',
        'Hùng',
        'Nam',
        'Phương',
        'Linh',
        'Hương',
        'Thảo',
        'Nga',
        'Hà',
        'Thu',
      ];

      const lastNames = [
        'An',
        'Bình',
        'Cường',
        'Dũng',
        'Em',
        'Phúc',
        'Giang',
        'Hoa',
        'Inh',
        'Khang',
        'Linh',
        'Minh',
        'Nga',
        'Oanh',
        'Phương',
        'Quân',
        'Rồng',
        'Sơn',
        'Thảo',
        'Uyên',
        'Vân',
        'Xuân',
        'Yến',
        'Zương',
        'Ánh',
        'Ân',
        'Ấn',
        'Ẩn',
        'Ận',
        'Ắn',
      ];

      // Danh sách số điện thoại mẫu
      const phonePrefixes = [
        '090',
        '091',
        '092',
        '093',
        '094',
        '095',
        '096',
        '097',
        '098',
        '099',
      ];

      // Danh sách ngày sinh mẫu (từ 2010-2015)
      const birthYears = [2010, 2011, 2012, 2013, 2014, 2015];
      const birthMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const birthDays = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28,
      ];

      for (let i = 0; i < count; i++) {
        // Tạo tên ngẫu nhiên
        const firstName =
          firstNames[Math.floor(Math.random() * firstNames.length)];
        const middleName =
          middleNames[Math.floor(Math.random() * middleNames.length)];
        const lastName =
          lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${middleName} ${lastName}`;

        // Tạo số điện thoại ngẫu nhiên
        const prefix =
          phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
        const suffix = Math.floor(Math.random() * 10000000)
          .toString()
          .padStart(7, '0');
        const phoneNumber = `${prefix}${suffix}`;

        // Tạo ngày sinh ngẫu nhiên
        const year = birthYears[Math.floor(Math.random() * birthYears.length)];
        const month =
          birthMonths[Math.floor(Math.random() * birthMonths.length)];
        const day = birthDays[Math.floor(Math.random() * birthDays.length)];
        const dateOfBirth = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

        // Tạo giới tính ngẫu nhiên
        const gender = Math.random() > 0.5 ? EGender.MALE : EGender.FEMALE;

        // Tạo avatar mẫu dựa trên giới tính
        const avatar = getAvatarUrl(gender, fullName.replace(/\s+/g, ''));

        sampleStudents.push({
          fullName,
          phoneNumber,
          dateOfBirth,
          avatar,
          gender,
        });
      }

      // Tạo tất cả học sinh trong batch
      const batch = [];
      for (const student of sampleStudents) {
        const now = new Date().toISOString();
        const newStudent = {
          ...student,
          createdAt: now,
          updatedAt: now,
        };
        batch.push(addDoc(collection(db, COLLECTIONS.STUDENTS), newStudent));
      }

      await Promise.all(batch);

      return {
        success: true,
        message: `Đã tạo thành công ${count} học sinh mẫu!`,
        createdCount: count,
      };
    } catch (error) {
      console.error('Error creating sample students:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi tạo học sinh mẫu!',
        createdCount: 0,
      };
    }
  }
}

export default StudentService;
