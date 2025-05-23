import { useEffect, useState } from "react";
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries";
import BaseModal from "@/core/components/ui/BaseModal";
import { EGender } from "@/modules/student/enum/student.enum";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Label } from "@/core/components/ui/label";
import toast from "react-hot-toast";

export default function StudentModal({ open, onClose, initialData, refetch }: { open: boolean; onClose: () => void; initialData?: any; refetch: () => void }) {
  const { createOrUpdateMutation } = useStudentQueries();
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    avatar: "",
    gender: EGender.MALE,
    classes: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || "",
        phoneNumber: initialData.phoneNumber || "",
        dateOfBirth: initialData.dateOfBirth || "",
        avatar: initialData.avatar || "",
        gender: initialData.gender || EGender.MALE,
        classes: initialData.classes ? initialData.classes.join(", ") : "",
      });
    } else {
      setForm({
        fullName: "",
        phoneNumber: "",
        dateOfBirth: "",
        avatar: "",
        gender: EGender.MALE,
        classes: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!form.fullName || !form.phoneNumber || !form.dateOfBirth) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }
    createOrUpdateMutation.mutate(
      {
        data: {
          ...form,
          id: initialData?.id,
          classes: form.classes.split(",").map((c) => c.trim()).filter(Boolean),
        },
        isBeautifyDate: true,
      },
      {
        onSuccess: () => {
          onClose();
          setForm({
            fullName: "",
            phoneNumber: "",
            dateOfBirth: "",
            avatar: "",
            gender: EGender.MALE,
            classes: "",
          });
          refetch();
          toast.success( initialData ?  "Cập nhật học sinh thành công!" : "Thêm học sinh thành công!");

        },
        onError: () => setError("Có lỗi xảy ra, vui lòng thử lại!"),
      }
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={initialData ? "Sửa học sinh" : "Thêm học sinh mới"}
      footer={
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={createOrUpdateMutation.isPending}
            className="w-full sm:w-auto px-8 py-2 rounded-lg shadow-md font-semibold text-base"
          >
            {createOrUpdateMutation.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
        autoComplete="off"
      >
        <div>
          <Label htmlFor="fullName" className="font-bold mb-1 block">
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
          <Label htmlFor="phoneNumber" className="font-bold mb-1 block">
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
          <Label htmlFor="dateOfBirth" className="font-bold mb-1 block">
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
          <Label htmlFor="avatar" className="font-bold mb-1 block">
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
          <Label htmlFor="gender" className="font-bold mb-1 block">
            Giới tính
          </Label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="rounded-lg shadow-sm border px-3 py-2 w-full focus:ring-2 focus:ring-primary-400 transition"
          >
            <option value={EGender.MALE}>Nam</option>
            <option value={EGender.FEMALE}>Nữ</option>
            <option value={EGender.OTHER}>Khác</option>
          </select>
        </div>
        <div>
          <Label htmlFor="classes" className="font-bold mb-1 block">
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
          <div className="col-span-1 sm:col-span-2 text-red-500 text-sm mt-2 text-center">
            {error}
          </div>
        )}
      </form>
    </BaseModal>
  );
}