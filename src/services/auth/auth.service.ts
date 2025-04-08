import { IUser } from "@/types/domain/user/user.interface";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface";

export interface LoginCredentials {
  username: string;
  password: string;
}

export const AuthService = {
  async login(
    credentials: LoginCredentials
  ): Promise<ISuccessResponse<IUser> | IErrorResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.username + "@nqchess.com",
        credentials.password
      );

      return {
        success: true,
        message: "Login successful",
        data: {
          id: userCredential.user.uid,
          email: userCredential.user.email || "",
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        errorCode: "LOGIN_ERROR",
        message: "Invalid username or password",
      };
    }
  },

  async logout(): Promise<ISuccessResponse<null> | IErrorResponse> {
    try {
      await signOut(auth);
      return {
        success: true,
        message: "Logout successful",
        data: null,
      };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        errorCode: "LOGOUT_ERROR",
        message: "Failed to logout",
      };
    }
  },
};
