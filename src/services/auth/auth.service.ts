import { IUser } from "@/types/domain/user/user.interface";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: IUser;
  token: string;
}

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        credentials.username + "@nqchess.com",
        credentials.password
      );

      const user = userCredential.user;
      console.log(user);
      // Lấy token
      const token = await user.getIdToken();

      // Chuyển đổi Firebase User sang IUser
      const userData: IUser = {
        id: user.uid,
        email: user.email || "",
        name: user.displayName || undefined,
        role: "user",
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        updatedAt: user.metadata.lastSignInTime || new Date().toISOString(),
        isActive: true,
      };

      return {
        user: userData,
        token: token,
      };
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Đăng nhập thất bại");
    }
  },
};
