"use client"

import { useEffect, useState } from "react"
import { User, Pencil, UserRoundCheck, UserMinus } from "lucide-react"
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
import { useQueryClient } from "@tanstack/react-query"
import { STUDENT_QUERY_KEYS } from "@/modules/student/constants/studentQueryKey"
import { Button } from "@/core/components/ui/button"
import { Avatar } from "@/core/components/ui/avatar"
import Image from "next/image"

export default function StudentManagement() {
  const { getAllQuery, deleteMutation } = useStudentQueries()
  const { refetch } = getAllQuery
  const queryClient = useQueryClient()
  const modal = useModal()
  const [editStudent, setEditStudent] = useState<IStudent | null>(null)
  const confirmModal = useModal()
  const [studentToDelete, setStudentToDelete] = useState<IStudent | null>(null)

  useEffect(() => {
    refetch()
  }, [refetch])

  const students = getAllQuery.data?.success ? getAllQuery.data.data || [] : []
  const isLoading = getAllQuery.isLoading || getAllQuery.isFetching
  const isError = getAllQuery.isError

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
          queryClient.setQueryData(
            STUDENT_QUERY_KEYS.getAll,
            (oldData: any) => {
              if (!oldData?.data) return oldData
              return {
                ...oldData,
                data: oldData.data.filter(
                  (item: IStudent) => item.id !== studentToDelete.id
                ),
              }
            }
          )
          confirmModal.close()
          setStudentToDelete(null)
        },
      })
    }
  }

  const handleSaveStudent = (newStudent: IStudent) => {
    if (editStudent && editStudent.id) {
      // Sửa
      queryClient.setQueryData(STUDENT_QUERY_KEYS.getAll, (oldData: any) => {
        if (!oldData?.data) return oldData
        return {
          ...oldData,
          data: oldData.data.map((item: IStudent) =>
            item.id === newStudent.id ? newStudent : item
          ),
        }
      })
    } else {
      // Thêm
      queryClient.setQueryData(STUDENT_QUERY_KEYS.getAll, (oldData: any) => {
        if (!oldData?.data) return oldData
        return {
          ...oldData,
          data: [newStudent, ...oldData.data],
        }
      })
    }
    modal.close()
    setEditStudent(null)
  }

  return (
    <>
      <ManagementBase
        title="Quản lý học sinh"
        statistics={[
          {
            icon: <User />,
            title: "Tổng học sinh",
            value: students.length,
          },
          {
            icon: <UserMinus />,
            title: "Học sinh chưa có lớp",
            value: students.length,
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
        ]}
        isLoading={isLoading}
        isError={isError}
        data={students}
        columns={[
          {
            key: "STT",
            title: "STT",
            renderCell: (_row: IStudent, index: number) => index + 1,
          },
          {
            key: "avatar",
            title: "Ảnh đại diện",
            renderCell: (row: IStudent) => (
              <Avatar className="w-10 h-10">
                {row.avatar ? (
                  <Image
                    src={row.avatar}
                    alt={row.fullName}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-white bg-gray-500 flex items-center justify-center w-full h-full">
                    {row.fullName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </Avatar>
            ),
          },
          { key: "fullName", title: "Tên học sinh" },
          { key: "phoneNumber", title: "Số điện thoại" },
          { key: "dateOfBirth", title: "Ngày sinh" },
          {
            key: "gender",
            title: "Giới tính",
            renderCell: (row: IStudent) =>
              row.gender === "male"
                ? "Nam"
                : row.gender === "female"
                ? "Nữ"
                : "Khác",
          },
        ]}
        addButton={
          <Button
            variant="primary"
            size="lg"
            className="ml-auto"
            onClick={() => {
              setEditStudent(null)
              modal.open()
            }}
          >
            <Pencil className="w-5 h-5" />
            Thêm học sinh
          </Button>
        }
        renderAction={(row: IStudent) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="p-2"
              title="Sửa"
              onClick={() => handleEdit(row)}
            >
              Chỉnh sửa
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="p-2"
              title="Xóa"
              onClick={() => handleDelete(row)}
            >
              Xóa
            </Button>
          </div>
        )}
        itemsPerPage={20}
        searchPlaceholder="Tìm kiếm theo tên và số điện thoại"
        searchKeys={["fullName", "phoneNumber"]}
      />
      <StudentModal
        open={modal.isOpen}
        onClose={modal.close}
        initialData={editStudent}
        onSave={handleSaveStudent}
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
