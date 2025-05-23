"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash, PlusCircle } from "lucide-react"
import ManagementBase from "@/core/components/layout/admin/management/ManagementBase"
import useModal from "@/core/hooks/useModal"
import { Button } from "@/core/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/core/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/components/ui/dialog"
import { useTuitionQueries } from "@/modules/tuition/hooks/useTuitionQueries"
import { useClassQueries } from "@/modules/class/hooks/useClassQueries"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import { ITuition } from "@/modules/tuition/interfaces/tuition.interface"
import { ETuitionStatus } from "@/modules/tuition/enum/tuition.enum"

export default function TuitionManagement() {
  const { getAllQuery, deleteMutation } = useTuitionQueries()
  const { getAllQuery: classQuery } = useClassQueries()
  const { getAllQuery: studentQuery } = useStudentQueries()
  const [search, setSearch] = useState("")
  const [editTuition, setEditTuition] = useState<ITuition | null>(null)
  const [tuitionToDelete, setTuitionToDelete] = useState<ITuition | null>(null)
  const modal = useModal()
  const confirmModal = useModal()

  useEffect(() => {
    getAllQuery.refetch()
    classQuery.refetch()
    studentQuery.refetch()
  }, [])

  const tuitions: ITuition[] = getAllQuery.data?.success
    ? getAllQuery.data.data || []
    : []
  const isLoading = getAllQuery.isLoading || getAllQuery.isFetching
  const isError = getAllQuery.isError

  const classes = classQuery.data?.success ? classQuery.data.data || [] : []
  const students = studentQuery.data?.success
    ? studentQuery.data.data || []
    : []

  const getClassName = (id?: string) =>
    classes.find((c) => c.id === id)?.name || id || ""
  const getStudentName = (id?: string) =>
    students.find((s) => s.id === id)?.fullName || id || ""

  const filteredTuitions = tuitions.filter(
    (t) =>
      t.month?.toLowerCase().includes(search.toLowerCase()) ||
      t.classId?.toLowerCase().includes(search.toLowerCase()) ||
      t.studentId?.toLowerCase().includes(search.toLowerCase())
  )

  // Tính toán statistics
  const totalAmount = tuitions.reduce((sum, t) => sum + (t.amount || 0), 0)
  const paidAmount = tuitions
    .filter((t) => t.status === ETuitionStatus.PAID)
    .reduce((sum, t) => sum + (t.amount || 0), 0)
  const unpaidAmount = tuitions
    .filter((t) => t.status !== ETuitionStatus.PAID)
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const statistics = [
    {
      title: "Tổng học phí",
      value: totalAmount.toLocaleString() + "₫",
      icon: <PlusCircle className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Đã thu",
      value: paidAmount.toLocaleString() + "₫",
      icon: <PlusCircle className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Chưa thu",
      value: unpaidAmount.toLocaleString() + "₫",
      icon: <PlusCircle className="w-6 h-6 text-yellow-500" />,
    },
  ]

  const handleEdit = (tuition: ITuition) => {
    setEditTuition(tuition)
    modal.open()
  }

  const handleDelete = (tuition: ITuition) => {
    setTuitionToDelete(tuition)
    confirmModal.open()
  }

  const handleConfirmDelete = () => {
    if (tuitionToDelete) {
      deleteMutation.mutate(tuitionToDelete.id, {
        onSuccess: () => {
          getAllQuery.refetch()
          confirmModal.close()
          setTuitionToDelete(null)
        },
      })
    }
  }

  const handleSave = (tuition: ITuition) => {
    // TODO: Gọi mutation tạo/cập nhật học phí ở đây
    modal.close()
    setEditTuition(null)
    getAllQuery.refetch()
  }

  const columns = [
    { key: "month", title: "Tháng" },
    {
      key: "classId",
      title: "Lớp",
      renderCell: (row: ITuition) => getClassName(row.classId),
    },
    {
      key: "studentId",
      title: "Học sinh",
      renderCell: (row: ITuition) => getStudentName(row.studentId),
    },
    {
      key: "amount",
      title: "Số tiền",
      renderCell: (row: ITuition) => row.amount.toLocaleString() + "₫",
    },
    {
      key: "status",
      title: "Trạng thái",
      renderCell: (row: ITuition) => statusLabel(row.status),
    },
  ]

  const addButton = (
    <Button
      className="flex items-center gap-2 px-4 py-2 mt-2 ml-0 text-sm font-semibold text-white transition bg-green-500 rounded-full shadow-lg md:ml-auto sm:px-5 hover:bg-green-600 md:mt-0 sm:text-base"
      onClick={() => {
        setEditTuition(null)
        modal.open()
      }}
    >
      <PlusCircle className="w-5 h-5" />
      Thêm học phí
    </Button>
  )

  return (
    <>
      <ManagementBase
        statistics={statistics}
        isLoading={isLoading}
        isError={isError}
        data={filteredTuitions}
        columns={columns}
        addButton={addButton}
        renderAction={(row: ITuition) => (
          <div className="flex gap-2">
            <button
              className="p-2 transition rounded hover:bg-primary-100 text-primary-600"
              title="Sửa"
              onClick={() => handleEdit(row)}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-red-600 transition rounded hover:bg-red-100"
              title="Xóa"
              onClick={() => handleDelete(row)}
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        )}
      />
      {/* Modal thêm/sửa học phí */}
      {modal.isOpen && (
        <TuitionModal
          open={modal.isOpen}
          onClose={() => {
            modal.close()
            setEditTuition(null)
          }}
          initialData={editTuition}
          onSave={handleSave}
        />
      )}
      {/* Modal xác nhận xóa */}
      <AlertDialog
        open={confirmModal.isOpen}
        onOpenChange={(v) => !v && confirmModal.close()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              {`Bạn có chắc muốn xóa học phí tháng ${tuitionToDelete?.month} cho học sinh ${tuitionToDelete?.studentId}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Đang xóa..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function statusLabel(status?: ETuitionStatus) {
  switch (status) {
    case ETuitionStatus.PAID:
      return <span className="font-semibold text-green-600">Đã đóng</span>
    case ETuitionStatus.OVERDUE:
      return <span className="font-semibold text-red-500">Quá hạn</span>
    default:
      return <span className="font-semibold text-yellow-600">Chờ đóng</span>
  }
}

// Modal thêm/sửa học phí
function TuitionModal({
  open,
  onClose,
  initialData,
  onSave,
}: {
  open: boolean
  onClose: () => void
  initialData: ITuition | null
  onSave: (tuition: ITuition) => void
}) {
  const [form, setForm] = useState<ITuition>({
    id: initialData?.id || "",
    classId: initialData?.classId || "",
    studentId: initialData?.studentId || "",
    amount: initialData?.amount || 0,
    month: initialData?.month || "",
    status: initialData?.status || ETuitionStatus.PENDING,
    createdAt: initialData?.createdAt,
    updatedAt: initialData?.updatedAt,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setForm({
      id: initialData?.id || "",
      classId: initialData?.classId || "",
      studentId: initialData?.studentId || "",
      amount: initialData?.amount || 0,
      month: initialData?.month || "",
      status: initialData?.status || ETuitionStatus.PENDING,
      createdAt: initialData?.createdAt,
      updatedAt: initialData?.updatedAt,
    })
  }, [initialData, open])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }))
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    if (!form.classId || !form.studentId || !form.amount || !form.month) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.")
      return
    }
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Sửa học phí" : "Thêm học phí mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block mb-1 font-bold">
              Mã lớp <span className="text-red-500">*</span>
            </label>
            <input
              name="classId"
              value={form.classId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-bold">
              Mã học sinh <span className="text-red-500">*</span>
            </label>
            <input
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-bold">
              Tháng <span className="text-red-500">*</span>
            </label>
            <input
              name="month"
              value={form.month}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-bold">
              Số tiền <span className="text-red-500">*</span>
            </label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400"
              required
              min={0}
            />
          </div>
          {error && (
            <div className="text-sm text-center text-red-500">{error}</div>
          )}
        </form>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="w-full px-8 py-2 text-base font-semibold rounded-lg shadow-md sm:w-auto"
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
