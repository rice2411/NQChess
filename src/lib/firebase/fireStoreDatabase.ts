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
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface"
import { formatFirestoreData } from "@/helpers/timeFireStore.helper"
import { db } from "@/config/firebase/client.config"
import { IGetRequest } from "@/types/api/request.interface"

// Create or Update
export async function createOrUpdateDocument<
  T extends DocumentData & { id?: string; createdAt?: any; updatedAt?: any }
>(
  collectionName: string,
  data: T,
  isBeautifyDate: boolean = true
): Promise<ISuccessResponse<T> | IErrorResponse> {
  // Check if document exists by checking if it has an id
  const isUpdate = "id" in data && data.id

  try {
    const docData = {
      ...data,
      updatedAt: serverTimestamp(),
    }

    // Only set createdAt for new documents
    if (!isUpdate) {
      docData.createdAt = serverTimestamp()
    }

    const docRef = isUpdate
      ? doc(db, collectionName, data.id!)
      : await addDoc(collection(db, collectionName), docData)

    if (isUpdate) {
      await updateDoc(docRef, docData)
    }

    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return {
        success: false,
        errorCode: "DOCUMENT_NOT_FOUND",
        message: "Document not found after creation/update",
      }
    }

    const formattedData = formatFirestoreData(
      { ...docSnap.data(), id: docSnap.id } as unknown as T,
      isBeautifyDate
    )

    return {
      success: true,
      message: isUpdate
        ? "Document updated successfully"
        : "Document created successfully",
      data: formattedData as T,
    }
  } catch (err) {
    console.error("Error creating/updating document: ", err)
    return {
      success: false,
      errorCode: isUpdate ? "UPDATE_ERROR" : "CREATE_ERROR",
      message: isUpdate
        ? "Failed to update document"
        : "Failed to create document",
    }
  }
}

// Read single document
export async function readDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  isBeautifyDate: boolean = true
): Promise<ISuccessResponse<T> | IErrorResponse> {
  if (!id) {
    return {
      success: false,
      errorCode: "INVALID_ID",
      message: "Document ID is required",
    }
  }

  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return {
        success: false,
        errorCode: "DOCUMENT_NOT_FOUND",
        message: "Document not found",
      }
    }

    const formattedData = formatFirestoreData(
      { ...docSnap.data(), id: docSnap.id } as unknown as T,
      isBeautifyDate
    )

    return {
      success: true,
      message: "Document retrieved successfully",
      data: formattedData as T,
    }
  } catch (err) {
    console.error("Error reading document: ", err)
    return {
      success: false,
      errorCode: "READ_ERROR",
      message: "Failed to read document",
    }
  }
}

// Read multiple documents
export async function readDocuments<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  options: IGetRequest = { isBeautifyDate: true }
): Promise<ISuccessResponse<T[]> | IErrorResponse> {
  try {
    const queryConstraints = [...constraints]

    // Add sorting if specified
    if (options.sortBy) {
      queryConstraints.push(orderBy(options.sortBy, options.sortOrder || "asc"))
    }
    // Add limit if specified
    if (options.limit) {
      queryConstraints.push(limit(options.limit))
    }

    // Add pagination if last document is provided
    if (options.lastDoc) {
      queryConstraints.push(startAfter(options.lastDoc))
    }

    const q = query(collection(db, collectionName), ...queryConstraints)
    const querySnapshot = await getDocs(q)

    const documents = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as T[]
    const formattedData = formatFirestoreData(
      documents,
      options.isBeautifyDate
    ) as T[]

    return {
      success: true,
      message: "Documents retrieved successfully",
      data: formattedData,
    }
  } catch (err) {
    console.error("Error reading documents: ", err)
    return {
      success: false,
      errorCode: "READ_ERROR",
      message: "Failed to read documents",
    }
  }
}

// Update
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>,
  isBeautifyDate: boolean = true
): Promise<ISuccessResponse<T> | IErrorResponse> {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })

    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return {
        success: false,
        errorCode: "DOCUMENT_NOT_FOUND",
        message: "Document not found after update",
      }
    }

    const formattedData = formatFirestoreData(
      { ...docSnap.data(), id: docSnap.id } as unknown as T,
      isBeautifyDate
    )

    return {
      success: true,
      message: "Document updated successfully",
      data: formattedData as T,
    }
  } catch (err) {
    console.error("Error updating document: ", err)
    return {
      success: false,
      errorCode: "UPDATE_ERROR",
      message: "Failed to update document",
    }
  }
}

// Delete
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<ISuccessResponse<null> | IErrorResponse> {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)

    return {
      success: true,
      message: "Document deleted successfully",
      data: null,
    }
  } catch (err) {
    console.error("Error deleting document: ", err)
    return {
      success: false,
      errorCode: "DELETE_ERROR",
      message: "Failed to delete document",
    }
  }
}
