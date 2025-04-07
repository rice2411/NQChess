import { IUser } from "@/types/domain/user/user.interface";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface LoginCredentials {
  username: string;
  password: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<IUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.username + "@nqchess.com",
        credentials.password
      );

      return {
        id: userCredential.user.uid,
        email: userCredential.user.email || "",
      };
    } catch (error) {
      console.log(credentials);

      console.error("Login error:", error);
      throw error;
    }
  }
}
