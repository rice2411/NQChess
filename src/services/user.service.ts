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
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import {
  IUser,
  CreateUserRequest,
  UpdateUserRequest,
  EUserRole,
} from '@/interfaces/user.interface';
import { COLLECTIONS } from '@/constants/collections';

export class UserService {
  /**
   * Lấy tất cả users
   */
  static async getAllUsers(): Promise<IUser[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as IUser);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Không thể lấy danh sách tài khoản');
    }
  }

  /**
   * Lấy user theo ID
   */
  static async getUserById(id: string): Promise<IUser | null> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as IUser;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Không thể lấy thông tin tài khoản');
    }
  }

  /**
   * Tạo user mới với Firebase Auth và Firestore
   */
  static async createUser(userData: CreateUserRequest): Promise<IUser> {
    try {
      // Tạo email từ username
      const email = `${userData.username}@nqchess.com`;

      // Tạo user trong Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        userData.password
      );

      // Cập nhật display name
      await updateProfile(userCredential.user, {
        displayName: userData.username,
      });

      // Tạo document trong Firestore
      const now = new Date().toISOString();
      const newUser = {
        username: userData.username,
        role: userData.role,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.USERS), newUser);

      return { id: docRef.id, ...newUser } as IUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Không thể tạo tài khoản');
    }
  }

  /**
   * Cập nhật user
   */
  static async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, id);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Không thể cập nhật tài khoản');
    }
  }

  /**
   * Xóa user
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      // Lấy thông tin user trước khi xóa
      const user = await this.getUserById(id);
      if (!user) {
        throw new Error('Không tìm thấy tài khoản');
      }

      // Kiểm tra không cho phép xóa admin
      if (user.role === EUserRole.ADMIN) {
        throw new Error('Không thể xóa tài khoản admin');
      }

      // Xóa document trong Firestore
      await deleteDoc(doc(db, COLLECTIONS.USERS, id));

      // TODO: Xóa user trong Firebase Auth (cần admin SDK)
      // Hiện tại chỉ xóa document, user vẫn tồn tại trong Auth
      console.warn('User document deleted but Firebase Auth user still exists');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Không thể xóa tài khoản');
    }
  }

  /**
   * Kiểm tra username đã tồn tại chưa
   */
  static async checkUsernameExists(
    username: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where('username', '==', username)
      );

      const snapshot = await getDocs(q);
      const existingUser = snapshot.docs.find(doc => doc.id !== excludeId);

      return !!existingUser;
    } catch (error) {
      console.error('Error checking username existence:', error);
      return false;
    }
  }

  /**
   * Lấy thống kê users
   */
  static async getUserStats(): Promise<{
    total: number;
    admin: number;
    teacher: number;
  }> {
    try {
      const allUsers = await this.getAllUsers();

      return {
        total: allUsers.length,
        admin: allUsers.filter(user => user.role === EUserRole.ADMIN).length,
        teacher: allUsers.filter(user => user.role === EUserRole.TEACHER)
          .length,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new Error('Không thể lấy thống kê tài khoản');
    }
  }
}

export default UserService;
