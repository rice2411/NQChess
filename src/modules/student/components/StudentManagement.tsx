"use client"

import { useEffect, useState } from "react"
import { User, Pencil, UserRoundCheck, UserMinus, Trash } from "lucide-react"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import { IStudent } from "@/modules/student/interfaces/student.interface"
import ManagementBase from "@/core/components/layout/admin/management/ManagementBase"
import useModal from "@/core/hooks/useModal"
import StudentModal from "./StudentModal"
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

const columns = [
  {
    key: "STT",
    title: "STT",
    renderCell: (row: IStudent, index: number) => index + 1,
  },
  { key: "fullName", title: "Tên học sinh" },
  { key: "phoneNumber", title: "Số điện thoại" },
  { key: "dateOfBirth", title: "Ngày sinh" },
  {
    key: "gender",
    title: "Giới tính",
    renderCell: (row: IStudent) =>
      row.gender === "male" ? "Nam" : row.gender === "female" ? "Nữ" : "Khác",
  },
  {
    key: "classes",
    title: "Lớp",
    renderCell: (row: IStudent) => row.classes?.join(", "),
  },
]

export default function StudentManagement() {
  const { getAllQuery, deleteMutation } = useStudentQueries()
  const modal = useModal()
  const [editStudent, setEditStudent] = useState<IStudent | null>(null)
  const confirmModal = useModal()
  const [studentToDelete, setStudentToDelete] = useState<IStudent | null>(null)

  useEffect(() => {
    getAllQuery.refetch()
  }, [])

  const students = getAllQuery.data?.success ? getAllQuery.data.data || [] : []
  const isLoading = getAllQuery.isLoading || getAllQuery.isFetching
  const isError = getAllQuery.isError

  const statistics = [
    {
      icon: <User />,
      title: "Tổng học sinh",
      value: students.length,
    },
    {
      icon: <UserMinus />,
      title: "Học sinh chưa có lớp",
      value: students.filter((student) => !student.classes).length,
    },
    {
      icon: <UserRoundCheck />,
      title: "Học sinh mới trong tháng",
      value: students.filter(
        (student) =>
          new Date(student?.createdAt as string).getTime() >
          new Date().getTime() - 30 * 24 * 60 * 60 * 1000
      ).length,
    },
  ]

  const handleEdit = (student: IStudent) => {
    setEditStudent(student)
    modal.open()
  }

  const handleDelete = (student: IStudent) => {
    setStudentToDelete(student)
    confirmModal.open()
  }

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteMutation.mutate(studentToDelete.id, {
        onSuccess: () => {
          getAllQuery.refetch()
          confirmModal.close()
          setStudentToDelete(null)
        },
      })
    }
  }

  const addButton = (
    <button
      className="flex items-center gap-2 px-4 py-2 mt-2 ml-0 text-sm font-semibold text-white transition bg-green-500 rounded-full shadow-lg md:ml-auto sm:px-5 hover:bg-green-600 md:mt-0 sm:text-base"
      onClick={() => {
        setEditStudent(null)
        modal.open()
      }}
    >
      <Pencil className="w-5 h-5" />
      Thêm học sinh
    </button>
  )

  return (
    <>
      <ManagementBase
        statistics={statistics}
        isLoading={isLoading}
        isError={isError}
        data={students}
        columns={columns}
        addButton={addButton}
        renderAction={(row: IStudent) => (
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
      <StudentModal
        open={modal.isOpen}
        onClose={modal.close}
        initialData={editStudent}
        refetch={getAllQuery.refetch}
      />
      <AlertDialog
        open={confirmModal.isOpen}
        onOpenChange={(v) => !v && confirmModal.close()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              {`Bạn có chắc muốn xóa học sinh "${studentToDelete?.fullName}"?`}
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
