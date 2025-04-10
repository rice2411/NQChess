import Cookies from "js-cookie"

const TOKEN_KEY = "auth_token"
const TOKEN_EXPIRY_DAYS = 7 // Token sẽ hết hạn sau 7 ngày

export const tokenUtils = {
  /**
   * Lưu token vào cookie
   * @param token - Token cần lưu
   */
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, {
      expires: TOKEN_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === "production", // Chỉ gửi cookie qua HTTPS trong môi trường production
      sameSite: "strict", // Ngăn chặn CSRF
    })
  },

  /**
   * Lấy token từ cookie
   * @returns Token nếu tồn tại, ngược lại trả về null
   */
  getToken: (): string | null => {
    return Cookies.get(TOKEN_KEY) || null
  },

  /**
   * Xóa token khỏi cookie
   */
  removeToken: () => {
    Cookies.remove(TOKEN_KEY)
  },
}
