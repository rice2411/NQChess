import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./clientConfig";

// Create or Update
export async function createOrUpdateDocument(
  collectionName: string,
  data: object
) {
  try {
    const docRef = doc(collection(db, collectionName));
    await setDoc(docRef, data);
    console.log("Document successfully written!");
    return {
      id: docRef.id,
      ...data,
    };
  } catch (error) {
    console.error("Error writing document: ", error);
    throw error;
  }
}

// Read
export async function readDocument(collectionName: string) {
  const collectionRef = collection(db, collectionName);
  const querySnapshot = await getDocs(collectionRef);
  const documents = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("Documents data:", documents);
  return documents;
}

// Update
export async function updateDocument(
  collectionName: string,
  documentId: string,
  data: object
) {
  const docRef = doc(db, collectionName, documentId);
  try {
    await updateDoc(docRef, data);
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
}

// Delete
export async function deleteDocument(
  collectionName: string,
  documentId: string
) {
  const docRef = doc(db, collectionName, documentId);
  try {
    await deleteDoc(docRef);
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
}
