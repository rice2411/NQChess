"use client"

import { useEffect, useState } from "react"
import { Users, PlusCircle } from "lucide-react"
import { useClassQueries } from "@/modules/class/hooks/useClassQueries"
import { IClass } from "@/modules/class/interfaces/class.interface"
import ManagementBase from "@/core/components/layout/admin/management/ManagementBase"
import useModal from "@/core/hooks/useModal"
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
import ClassModal from "./ClassModal"
import { EClassStatus } from "../enums/class.enum"
import toast from "react-hot-toast"
import StatusBadge from "./StatusBadge"
import { formatCurrencyVND } from "@/core/utils/currency.util"
import { useQueryClient } from "@tanstack/react-query"
import { CLASS_QUERY_KEYS } from "@/modules/class/constants/classQueryKey"
import { Button } from "@/core/components/ui/button"

const columns = [
  {
    key: "STT",
    title: "STT",
    renderCell: (_: IClass, index: number) => index + 1,
  },
  { key: "name", title: "Tên lớp" },
  { key: "startDate", title: "Ngày bắt đầu" },
  { key: "endDate", title: "Ngày kết thúc" },
  {
    key: "status",
    title: "Trạng thái",
    renderCell: (row: IClass) => <StatusBadge status={row.status} />,
  },
  {
    key: "tuition",
    title: "Học phí",
    renderCell: (row: IClass) => formatCurrencyVND(row.tuition),
  },
]

export default function ClassManagement() {
  const { getAllQuery, deleteMutation } = useClassQueries()
  const queryClient = useQueryClient()
  const modal = useModal()
  const confirmModal = useModal()
  const [editClass, setEditClass] = useState<IClass | null>(null)
  const [classToDelete, setClassToDelete] = useState<IClass | null>(null)

  useEffect(() => {
    getAllQuery.refetch()
  }, [])

  const classes = getAllQuery.data?.success ? getAllQuery.data.data || [] : []
  const isLoading = getAllQuery.isLoading || getAllQuery.isFetching
  const isError = getAllQuery.isError

  const statistics = [
    {
      icon: <Users />,
      title: "Tổng số lớp",
      value: classes.length,
    },
    {
      icon: <Users />,
      title: "Số lớp đang mở",
      value: classes.filter(
        (classItem) => classItem.status !== EClassStatus.INACTIVE
      ).length,
    },
    {
      icon: <Users />,
      title: "Số lớp đã kết thúc",
      value: classes.filter(
        (classItem) => classItem.status === EClassStatus.INACTIVE
      ).length,
    },
  ]

  const handleEdit = (classItem: IClass) => {
    setEditClass(classItem)
    modal.open()
  }

  const handleDelete = (classItem: IClass) => {
    setClassToDelete(classItem)
    confirmModal.open()
  }

  const handleConfirmDelete = () => {
    if (classToDelete) {
      deleteMutation.mutate(classToDelete.id, {
        onSuccess: () => {
          queryClient.setQueryData(CLASS_QUERY_KEYS.getAll, (oldData: any) => {
            if (!oldData?.data) return oldData
            return {
              ...oldData,
              data: oldData.data.filter(
                (item: IClass) => item.id !== classToDelete.id
              ),
            }
          })
          confirmModal.close()
          setClassToDelete(null)
          toast.success("Xóa lớp học thành công")
        },
        onError: () => {
          toast.error("Xóa lớp học thất bại")
        },
      })
    }
  }

  const addButton = (
    <Button
      className="flex items-center gap-2 px-4 py-2 mt-2 ml-0 text-sm font-semibold text-white transition bg-green-500 rounded-full shadow-lg md:ml-auto sm:px-5 hover:bg-green-600 md:mt-0 sm:text-base"
      onClick={() => {
        setEditClass(null)
        modal.open()
      }}
    >
      <PlusCircle className="w-5 h-5" />
      Thêm lớp học
    </Button>
  )

  return (
    <>
      <ManagementBase
        statistics={statistics}
        isLoading={isLoading}
        isError={isError}
        data={classes}
        columns={columns}
        addButton={addButton}
        renderAction={(row: IClass) => (
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
      />
      <ClassModal
        open={modal.isOpen}
        onClose={modal.close}
        initialData={editClass}
        onSave={(newClass) => {
          if (editClass && editClass.id) {
            // Sửa
            queryClient.setQueryData(
              CLASS_QUERY_KEYS.getAll,
              (oldData: any) => {
                if (!oldData?.data) return oldData
                return {
                  ...oldData,
                  data: oldData.data.map((item: IClass) =>
                    item.id === newClass.id ? newClass : item
                  ),
                }
              }
            )
          } else {
            // Thêm
            queryClient.setQueryData(
              CLASS_QUERY_KEYS.getAll,
              (oldData: any) => {
                if (!oldData?.data) return oldData
                return {
                  ...oldData,
                  data: [newClass, ...oldData.data],
                }
              }
            )
          }
          modal.close()
          setEditClass(null)
        }}
      />
      <AlertDialog
        open={confirmModal.isOpen}
        onOpenChange={(v) => !v && confirmModal.close()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              {`Bạn có chắc muốn xóa lớp học "${classToDelete?.name}"?`}
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
