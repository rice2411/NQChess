export class StringValidator {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone)
  }

  validatePassword(password: string): boolean {
    // Password phải có ít nhất 6 ký tự, 1 chữ hoa, 1 chữ thường, 1 số, cho phép ký tự đặc biệt
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/
    return passwordRegex.test(password)
  }

  validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    return usernameRegex.test(username)
  }

  validateFullName(name: string): boolean {
    return name.length >= 2 && name.length <= 50
  }

  validateMinLength(value: string, min: number): boolean {
    return value.length >= min
  }

  validateMaxLength(value: string, max: number): boolean {
    return value.length <= max
  }

  validateLength(value: string, min: number, max: number): boolean {
    return (
      this.validateMinLength(value, min) && this.validateMaxLength(value, max)
    )
  }

  validateRegex(value: string, regex: RegExp): boolean {
    return regex.test(value)
  }
}
