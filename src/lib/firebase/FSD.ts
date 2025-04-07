import {
  deleteDoc,
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
  query,
  addDoc,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./clientConfig";
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface";
import { formatFirestoreData } from "@/helpers/date.helper";

// Create or Update
export async function createOrUpdateDocument<T extends DocumentData>(
  collectionName: string,
  data: T,
  isBeutifyDate: boolean = true
): Promise<ISuccessResponse<T> | IErrorResponse> {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return {
        success: false,
        errorCode: "DOCUMENT_NOT_FOUND",
        message: "Document not found after creation",
      };
    }

    const formattedData = formatFirestoreData(
      { ...docSnap.data(), id: docSnap.id } as unknown as T,
      isBeutifyDate
    );

    return {
      success: true,
      message: "Document created successfully",
      data: formattedData as T,
    };
  } catch (err) {
    console.error("Error creating document: ", err);
    return {
      success: false,
      errorCode: "CREATE_ERROR",
      message: "Failed to create document",
    };
  }
}

// Read single document
export async function readDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  isBeutifyDate: boolean = true
): Promise<ISuccessResponse<T> | IErrorResponse> {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        errorCode: "DOCUMENT_NOT_FOUND",
        message: "Document not found",
      };
    }

    const formattedData = formatFirestoreData(
      { ...docSnap.data(), id: docSnap.id } as unknown as T,
      isBeutifyDate
    );

    return {
      success: true,
      message: "Document retrieved successfully",
      data: formattedData as T,
    };
  } catch (err) {
    console.error("Error reading document: ", err);
    return {
      success: false,
      errorCode: "READ_ERROR",
      message: "Failed to read document",
    };
  }
}

// Read multiple documents
export async function readDocuments<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  isBeutifyDate: boolean = true
): Promise<ISuccessResponse<T[]> | IErrorResponse> {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    const documents = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as T[];

    const formattedData = formatFirestoreData(documents, isBeutifyDate) as T[];

    return {
      success: true,
      message: "Documents retrieved successfully",
      data: formattedData,
    };
  } catch (err) {
    console.error("Error reading documents: ", err);
    return {
      success: false,
      errorCode: "READ_ERROR",
      message: "Failed to read documents",
    };
  }
}

// Update
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>,
  isBeutifyDate: boolean = true
): Promise<ISuccessResponse<T> | IErrorResponse> {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return {
        success: false,
        errorCode: "DOCUMENT_NOT_FOUND",
        message: "Document not found after update",
      };
    }

    const formattedData = formatFirestoreData(
      { ...docSnap.data(), id: docSnap.id } as unknown as T,
      isBeutifyDate
    );

    return {
      success: true,
      message: "Document updated successfully",
      data: formattedData as T,
    };
  } catch (err) {
    console.error("Error updating document: ", err);
    return {
      success: false,
      errorCode: "UPDATE_ERROR",
      message: "Failed to update document",
    };
  }
}

// Delete
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<ISuccessResponse<null> | IErrorResponse> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);

    return {
      success: true,
      message: "Document deleted successfully",
      data: null,
    };
  } catch (err) {
    console.error("Error deleting document: ", err);
    return {
      success: false,
      errorCode: "DELETE_ERROR",
      message: "Failed to delete document",
    };
  }
}
