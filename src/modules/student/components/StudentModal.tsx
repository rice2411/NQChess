import { useEffect, useState } from "react"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/core/components/ui/dialog"
import { EGender } from "@/modules/student/enum/student.enum"
import { Input } from "@/core/components/ui/input"
import { Button } from "@/core/components/ui/button"
import { Label } from "@/core/components/ui/label"
import toast from "react-hot-toast"

export default function StudentModal({
  open,
  onClose,
  initialData,
  refetch,
}: {
  open: boolean
  onClose: () => void
  initialData?: any
  refetch: () => void
}) {
  const { createOrUpdateMutation } = useStudentQueries()
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    avatar: "",
    gender: EGender.MALE,
    classes: "",
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || "",
        phoneNumber: initialData.phoneNumber || "",
        dateOfBirth: initialData.dateOfBirth || "",
        avatar: initialData.avatar || "",
        gender: initialData.gender || EGender.MALE,
        classes: initialData.classes ? initialData.classes.join(", ") : "",
      })
    } else {
      setForm({
        fullName: "",
        phoneNumber: "",
        dateOfBirth: "",
        avatar: "",
        gender: EGender.MALE,
        classes: "",
      })
    }
  }, [initialData, open])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    if (!form.fullName || !form.phoneNumber || !form.dateOfBirth) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.")
      return
    }
    createOrUpdateMutation.mutate(
      {
        data: {
          ...form,
          id: initialData?.id,
          classes: form.classes
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
        },
        isBeautifyDate: true,
      },
      {
        onSuccess: () => {
          onClose()
          setForm({
            fullName: "",
            phoneNumber: "",
            dateOfBirth: "",
            avatar: "",
            gender: EGender.MALE,
            classes: "",
          })
          refetch()
          toast.success(
            initialData
              ? "Cập nhật học sinh thành công!"
              : "Thêm học sinh thành công!"
          )
        },
        onError: () => setError("Có lỗi xảy ra, vui lòng thử lại!"),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
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
              required
              className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
            />
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
              required
              className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
            />
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
              required
              className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div>
            <Label htmlFor="avatar" className="block mb-1 font-bold">
              Link ảnh đại diện
            </Label>
            <Input
              id="avatar"
              name="avatar"
              placeholder="Link ảnh đại diện"
              value={form.avatar}
              onChange={handleChange}
              className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
            />
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
          <div>
            <Label htmlFor="classes" className="block mb-1 font-bold">
              Lớp (cách nhau bởi dấu phẩy)
            </Label>
            <Input
              id="classes"
              name="classes"
              placeholder="VD: 10A1, 10A2"
              value={form.classes}
              onChange={handleChange}
              className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
            />
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
