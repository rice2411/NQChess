import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase';

// Đăng nhập với email/password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { user: null, error: errMsg };
  }
};

// Đăng ký với email/password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { user: null, error: errMsg };
  }
};

// Đăng nhập với Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { user: null, error: errMsg };
  }
};

// Đăng xuất
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { error: errMsg };
  }
};

// Lắng nghe trạng thái authentication
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Lấy user hiện tại
export const getCurrentUser = () => {
  return auth.currentUser;
}; 