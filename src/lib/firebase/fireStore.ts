import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./clientConfig";

interface FirestoreResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Tạo document mới trong collection
 * @param collectionName Tên collection
 * @param data Dữ liệu cần thêm
 * @returns Response chứa id của document mới
 */
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<FirestoreResponse<{ id: string }>> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return {
      success: true,
      data: { id: docRef.id },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi khi tạo document",
    };
  }
};

/**
 * Lấy một document theo ID
 * @param collectionName Tên collection
 * @param documentId ID của document
 * @returns Response chứa dữ liệu document
 */
export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string
): Promise<FirestoreResponse<T>> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        error: "Document không tồn tại",
      };
    }

    return {
      success: true,
      data: docSnap.data() as T,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi khi lấy document",
    };
  }
};

/**
 * Lấy tất cả documents từ collection
 * @param collectionName Tên collection
 * @param constraints Các điều kiện query (tùy chọn)
 * @returns Response chứa danh sách documents
 */
export const getDocuments = async <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<FirestoreResponse<T[]>> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    return {
      success: true,
      data: documents,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi khi lấy documents",
    };
  }
};

/**
 * Cập nhật document
 * @param collectionName Tên collection
 * @param documentId ID của document
 * @param data Dữ liệu cần cập nhật
 * @returns Response trạng thái cập nhật
 */
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<FirestoreResponse<void>> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Lỗi khi cập nhật document",
    };
  }
};

/**
 * Xóa document
 * @param collectionName Tên collection
 * @param documentId ID của document
 * @returns Response trạng thái xóa
 */
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<FirestoreResponse<void>> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi khi xóa document",
    };
  }
};

/**
 * Tìm kiếm documents theo điều kiện
 * @param collectionName Tên collection
 * @param field Tên trường cần tìm kiếm
 * @param operator Toán tử so sánh
 * @param value Giá trị cần so sánh
 * @returns Response chứa danh sách documents thỏa mãn điều kiện
 */
export const findDocuments = async <T extends DocumentData>(
  collectionName: string,
  field: string,
  operator: "==" | "<" | ">" | "<=" | ">=" | "!=",
  value: any
): Promise<FirestoreResponse<T[]>> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(field, operator, value));
    const querySnapshot = await getDocs(q);

    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    return {
      success: true,
      data: documents,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Lỗi khi tìm kiếm documents",
    };
  }
};
