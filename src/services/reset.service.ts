import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/constants/collections';

export class ResetService {
  /**
   * Reset toàn bộ data từ tất cả collections
   */
  static async resetAllData(): Promise<{
    success: boolean;
    message: string;
    deletedCounts: Record<string, number>;
  }> {
    try {
      const deletedCounts: Record<string, number> = {};

      // Reset từng collection
      for (const [key, collectionName] of Object.entries(COLLECTIONS)) {
        const deletedCount = await this.resetCollection(collectionName);
        deletedCounts[key] = deletedCount;
      }

      return {
        success: true,
        message: 'Đã reset toàn bộ data thành công!',
        deletedCounts,
      };
    } catch (error) {
      console.error('Error resetting all data:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi reset data!',
        deletedCounts: {},
      };
    }
  }

  /**
   * Reset một collection cụ thể
   */
  private static async resetCollection(
    collectionName: string
  ): Promise<number> {
    try {
      const q = query(
        collection(db, collectionName),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      let deletedCount = 0;
      const deletePromises = snapshot.docs.map(async docSnapshot => {
        try {
          await deleteDoc(doc(db, collectionName, docSnapshot.id));
          deletedCount++;
        } catch (error) {
          console.error(
            `Error deleting document ${docSnapshot.id} from ${collectionName}:`,
            error
          );
        }
      });

      await Promise.all(deletePromises);
      return deletedCount;
    } catch (error) {
      console.error(`Error resetting collection ${collectionName}:`, error);
      return 0;
    }
  }

  /**
   * Lấy thống kê số lượng documents trong mỗi collection
   */
  static async getCollectionStats(): Promise<Record<string, number>> {
    try {
      const stats: Record<string, number> = {};

      for (const [key, collectionName] of Object.entries(COLLECTIONS)) {
        const q = query(collection(db, collectionName));
        const snapshot = await getDocs(q);
        stats[key] = snapshot.docs.length;
      }

      return stats;
    } catch (error) {
      console.error('Error getting collection stats:', error);
      return {};
    }
  }

  /**
   * Reset chỉ một collection cụ thể
   */
  static async resetSpecificCollection(collectionName: string): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
  }> {
    try {
      if (!Object.values(COLLECTIONS).includes(collectionName as any)) {
        return {
          success: false,
          message: `Collection "${collectionName}" không tồn tại!`,
          deletedCount: 0,
        };
      }

      const deletedCount = await this.resetCollection(collectionName);

      return {
        success: true,
        message: `Đã reset collection "${collectionName}" thành công!`,
        deletedCount,
      };
    } catch (error) {
      console.error(`Error resetting collection ${collectionName}:`, error);
      return {
        success: false,
        message: `Có lỗi xảy ra khi reset collection "${collectionName}"!`,
        deletedCount: 0,
      };
    }
  }
}
