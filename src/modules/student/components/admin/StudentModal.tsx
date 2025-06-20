import { useEffect, useState } from "react"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/components/ui/dialog"
import { EGender } from "@/modules/student/enum/student.enum"
import { Input } from "@/core/components/ui/input"
import { Button } from "@/core/components/ui/button"
import { Label } from "@/core/components/ui/label"
import { Avatar } from "@/core/components/ui/avatar"
import { Upload, X } from "lucide-react"
import toast from "react-hot-toast"
import { StringValidator } from "@/core/validators/string.validator"

export default function StudentModal({
  open,
  onClose,
  initialData,
  onSave,
}: {
  open: boolean
  onClose: () => void
  initialData?: any
  onSave?: (newStudent: any) => void
}) {
  const { createOrUpdateMutation } = useStudentQueries()
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    avatar: "",
    gender: EGender.MALE,
  })
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || "",
        phoneNumber: initialData.phoneNumber || "",
        dateOfBirth: initialData.dateOfBirth || "",
        avatar: initialData.avatar || "",
        gender: initialData.gender || EGender.MALE,
      })
    } else {
      setForm({
        fullName: "",
        phoneNumber: "",
        dateOfBirth: "",
        avatar: "",
        gender: EGender.MALE,
      })
    }
    setFieldErrors({})
  }, [initialData, open])

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {}
    
    if (name === 'phoneNumber' && value) {
      const stringValidator = new StringValidator()
      if (!stringValidator.validatePhoneNumber(value)) {
        errors.phoneNumber = 'Số điện thoại phải có 10 chữ số'
      }
    }
    
    if (name === 'dateOfBirth' && value) {
      const selectedDate = new Date(value)
      const today = new Date()
      const minDate = new Date('1900-01-01')
      
      if (selectedDate > today) {
        errors.dateOfBirth = 'Ngày sinh không thể là ngày trong tương lai'
      } else if (selectedDate < minDate) {
        errors.dateOfBirth = 'Ngày sinh không hợp lệ'
      }
    }
    
    if (name === 'fullName' && value) {
      if (value.length < 2) {
        errors.fullName = 'Họ tên phải có ít nhất 2 ký tự'
      } else if (value.length > 50) {
        errors.fullName = 'Họ tên không được vượt quá 50 ký tự'
      }
    }
    
    return errors
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const errors = validateField(name, value)
    setFieldErrors(prev => ({ ...prev, ...errors }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh hợp lệ')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      setForm(prev => ({ ...prev, avatar: result.secure_url }))
      toast.success('Upload ảnh thành công!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload ảnh thất bại, vui lòng thử lại!')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    setForm(prev => ({ ...prev, avatar: '' }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    
    // Validate all fields
    const allErrors: Record<string, string> = {}
    
    if (!form.fullName) {
      allErrors.fullName = 'Họ tên là bắt buộc'
    } else {
      const nameErrors = validateField('fullName', form.fullName)
      Object.assign(allErrors, nameErrors)
    }
    
    if (!form.phoneNumber) {
      allErrors.phoneNumber = 'Số điện thoại là bắt buộc'
    } else {
      const phoneErrors = validateField('phoneNumber', form.phoneNumber)
      Object.assign(allErrors, phoneErrors)
    }
    
    if (!form.dateOfBirth) {
      allErrors.dateOfBirth = 'Ngày sinh là bắt buộc'
    } else {
      const dateErrors = validateField('dateOfBirth', form.dateOfBirth)
      Object.assign(allErrors, dateErrors)
    }
    
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors)
      return
    }
    
    createOrUpdateMutation.mutate(
      {
        data: {
          ...form,
          id: initialData?.id,
        },
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            if (onSave) onSave(res.data)
            else if (typeof window !== "undefined") window.location.reload()
            onClose()
            setForm({
              fullName: "",
              phoneNumber: "",
              dateOfBirth: "",
              avatar: "",
              gender: EGender.MALE,
            })
            toast.success(
              initialData
                ? "Cập nhật học sinh thành công!"
                : "Thêm học sinh thành công!"
            )
          } else {
            setError(res.message || "Có lỗi xảy ra!")
          }
        },
        onError: () => setError("Có lỗi xảy ra, vui lòng thử lại!"),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Sửa học sinh" : "Thêm học sinh mới"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
          autoComplete="off"
        >
          <div>
            <Label htmlFor="fullName" className="block mb-1 font-bold">
              Họ tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Họ tên"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400 ${
                fieldErrors.fullName ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.fullName && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.fullName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phoneNumber" className="block mb-1 font-bold">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Số điện thoại"
              value={form.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400 ${
                fieldErrors.phoneNumber ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.phoneNumber}</p>
            )}
          </div>
          <div>
            <Label htmlFor="dateOfBirth" className="block mb-1 font-bold">
              Ngày sinh <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              placeholder="Ngày sinh"
              value={form.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400 ${
                fieldErrors.dateOfBirth ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.dateOfBirth && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.dateOfBirth}</p>
            )}
          </div>
          <div>
            <Label htmlFor="gender" className="block mb-1 font-bold">
              Giới tính
            </Label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 transition border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
            >
              <option value={EGender.MALE}>Nam</option>
              <option value={EGender.FEMALE}>Nữ</option>
              <option value={EGender.OTHER}>Khác</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label className="block mb-1 font-bold">
              Ảnh đại diện
            </Label>
            <div className="flex items-center gap-4">
              {form.avatar ? (
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </Avatar>
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                    onClick={handleRemoveAvatar}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <Label
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-black rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? "Đang upload..." : "Chọn ảnh"}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Hỗ trợ: JPG, PNG, WebP. Tối đa 5MB
                </p>
              </div>
            </div>
          </div>
          {error && (
            <div className="col-span-1 mt-2 text-sm text-center text-red-500 sm:col-span-2">
              {error}
            </div>
          )}
        </form>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={createOrUpdateMutation.isPending}
            className="w-full px-8 py-2 text-base font-semibold rounded-lg shadow-md sm:w-auto"
          >
            {createOrUpdateMutation.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
