import { useEffect, useState } from "react";
import BaseModal from "@/core/components/ui/BaseModal";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Label } from "@/core/components/ui/label";
import { EClassStatus } from "@/modules/class/enums/class.enum";
import { useClassQueries } from "@/modules/class/hooks/useClassQueries";

export default function ClassModal({
  open,
  onClose,
  initialData,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  refetch: () => void;
}) {
  const { createOrUpdateMutation } = useClassQueries();
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    status: EClassStatus.ACTIVE,
    tuition: 0,
    students: [],
    schedules: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        status: initialData.status || EClassStatus.ACTIVE,
        tuition: initialData.tuition || 0,
        students: initialData.students || [],
        schedules: initialData.schedules || [],
      });
    } else {
      setForm({
        name: "",
        startDate: "",
        endDate: "",
        status: EClassStatus.ACTIVE,
        tuition: 0,
        students: [],
        schedules: [],
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
    if (!form.name || !form.startDate || !form.endDate) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }
    let newClass = {
      ...form,
      id: initialData?.id,
      tuition: Number(form.tuition),
    };
    if (!initialData && Object.prototype.hasOwnProperty.call(newClass, "id")) {
      delete newClass.id;
    }
    createOrUpdateMutation.mutate(
      {
        data: newClass,
        isBeautifyDate: true,
      },
      {
        onSuccess: () => {
          onClose();
          setForm({
            name: "",
            startDate: "",
            endDate: "",
            status: EClassStatus.ACTIVE,
            tuition: 0,
            students: [],
            schedules: [],
          });
          refetch();
        },
        onError: () => setError("Có lỗi xảy ra, vui lòng thử lại!"),
      }
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={initialData ? "Sửa lớp học" : "Thêm lớp học mới"}
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
          <Label htmlFor="name" className="font-bold mb-1 block">
            Tên lớp <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Tên lớp"
            value={form.name}
            onChange={handleChange}
            required
            className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <div>
          <Label htmlFor="startDate" className="font-bold mb-1 block">
            Ngày bắt đầu <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            required
            className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <div>
          <Label htmlFor="endDate" className="font-bold mb-1 block">
            Ngày kết thúc <span className="text-red-500">*</span>
          </Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            required
            className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <div>
          <Label htmlFor="status" className="font-bold mb-1 block">
            Trạng thái
          </Label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-lg shadow-sm border px-3 py-2 w-full focus:ring-2 focus:ring-primary-400 transition"
          >
            <option value={EClassStatus.ACTIVE}>Đang hoạt động</option>
            <option value={EClassStatus.INACTIVE}>Ngừng hoạt động</option>
            <option value={EClassStatus.FULL}>Đã đầy</option>
            <option value={EClassStatus.CANCELLED}>Đã hủy</option>
          </select>
        </div>
        <div>
          <Label htmlFor="tuition" className="font-bold mb-1 block">
            Học phí (VNĐ)
          </Label>
          <Input
            id="tuition"
            name="tuition"
            type="number"
            value={form.tuition}
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