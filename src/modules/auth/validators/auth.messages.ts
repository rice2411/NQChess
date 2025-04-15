import i18n from "@/core/config/i18n"

export const AUTH_MESSAGES = {
  // Error messages
  INVALID_CREDENTIALS: i18n.t("auth.errors.invalidCredentials"),
  USER_NOT_FOUND: i18n.t("auth.errors.userNotFound"),
  UNAUTHORIZED: i18n.t("auth.errors.unauthorized"),

  // Success messages
  LOGIN_SUCCESS: i18n.t("auth.success.loginSuccess"),
  LOGOUT_SUCCESS: i18n.t("auth.success.logoutSuccess"),
} as const
