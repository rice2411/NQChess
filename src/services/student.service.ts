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
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EGender, IStudent } from '@/interfaces/student.interface';
import { CloudinaryService } from '@/services/cloudinary.service';
import { COLLECTIONS } from '@/constants/collections';

export class StudentService {
  // ===== STUDENT MANAGEMENT =====

  /**
   * Lấy tất cả học sinh
   */
  static async getAllStudents(): Promise<IStudent[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.STUDENTS),
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
        orderBy('fullName')
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
   * Lọc học sinh theo giới tính
   */
  static async getStudentsByGender(gender: EGender): Promise<IStudent[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.STUDENTS),
        where('gender', '==', gender),
        orderBy('fullName')
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
   * Cập nhật thông tin học sinh
   */
  static async updateStudent(
    id: string,
    studentData: Partial<Omit<IStudent, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      // Lấy thông tin học sinh hiện tại
      const currentStudent = await this.getStudentById(id);
      if (!currentStudent) {
        throw new Error('Không tìm thấy học sinh');
      }

      // Xử lý avatar nếu có thay đổi
      await this.handleAvatarUpdate(currentStudent, studentData);

      const updateData = {
        ...studentData,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, COLLECTIONS.STUDENTS, id), updateData);
    } catch (error) {
      console.error('Error updating student:', error);
      throw new Error('Không thể cập nhật thông tin học sinh');
    }
  }

  /**
   * Xử lý cập nhật avatar - xóa avatar cũ nếu có avatar mới
   */
  private static async handleAvatarUpdate(
    currentStudent: IStudent,
    newStudentData: Partial<Omit<IStudent, 'id' | 'createdAt'>>
  ): Promise<void> {
    // Normalize URLs để so sánh chính xác
    const currentAvatar = this.normalizeUrl(currentStudent.avatar);
    const newAvatar = this.normalizeUrl(newStudentData.avatar);
    const areDifferent = currentAvatar !== newAvatar;

    // Chỉ xóa avatar cũ nếu có avatar mới và khác với avatar hiện tại
    if (newStudentData.avatar && currentStudent.avatar && areDifferent) {
      await this.deleteStudentAvatar(currentStudent.avatar);
    }
  }

  /**
   * Normalize URL để so sánh chính xác
   */
  private static normalizeUrl(url: string | undefined): string {
    if (!url) return '';

    try {
      // Loại bỏ protocol và trailing slash
      return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    } catch (error) {
      console.warn('Error normalizing URL:', url, error);
      return url;
    }
  }

  /**
   * Xóa avatar của học sinh từ Cloudinary
   */
  static async deleteStudentAvatar(avatarUrl: string): Promise<boolean> {
    if (!avatarUrl) {
      return false;
    }

    try {
      const deleteResult = await CloudinaryService.deleteImage(avatarUrl);

      if (deleteResult.success) {
        return true;
      } else {
        console.warn('Failed to delete avatar:', deleteResult.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      return false;
    }
  }

  /**
   * Xóa học sinh
   */
  static async deleteStudent(id: string): Promise<void> {
    try {
      const student = await this.getStudentById(id);
      if (student && student.avatar) {
        await this.deleteStudentAvatar(student.avatar);
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
        const q = query(
          collection(db, COLLECTIONS.STUDENTS),
          orderBy('fullName')
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
          orderBy('fullName')
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
      throw new Error('Không thể lấy học sinh gần đây');
    }
  }
}

export default StudentService;
