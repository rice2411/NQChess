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
import { EClassStatus } from "../enums/class.enum"
import toast from "react-hot-toast"
import { formatCurrencyVND } from "@/core/utils/currency.util"
import { useQueryClient } from "@tanstack/react-query"
import { CLASS_QUERY_KEYS } from "@/modules/class/constants/classQueryKey"
import { Button } from "@/core/components/ui/button"
import ModalDetailClass from "./modal/ModalDetailClass"
import { Badge } from "@/core/components/ui/badge"

const columns = [
  {
    key: "STT",
    title: "STT",
    renderCell: (_: IClass, index: number) => index + 1,
  },
  { key: "name", title: "Tên lớp" },
  { key: "startDate", title: "Ngày bắt đầu" },
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

const StatusBadge = ({ status }: { status: EClassStatus }) => {
  const statusMap: Record<EClassStatus, { label: string; color: string }> = {
    [EClassStatus.NOT_STARTED]: {
      label: "Chưa mở",
      color: "bg-gray-200 text-gray-700",
    },
    [EClassStatus.ACTIVE]: {
      label: "Đang hoạt động",
      color: "bg-green-200 text-green-700",
    },
    [EClassStatus.ENDED]: {
      label: "Đã kết thúc",
      color: "bg-red-200 text-red-700",
    },
  }
  return (
    <Badge className={statusMap[status].color}>{statusMap[status].label}</Badge>
  )
}

// Tạo dữ liệu mẫu cho lớp học mới
const createNewClassData = (): IClass => ({
  id: "",
  name: "",
  startDate: new Date().toISOString().split('T')[0], // Ngày hôm nay
  status: EClassStatus.NOT_STARTED,
  tuition: 0,
  schedules: [],
  students: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export default function ClassManagement() {
  const { getAllQuery, deleteMutation } = useClassQueries()
  const queryClient = useQueryClient()
  const confirmModal = useModal()
  const detailModal = useModal()
  const [classToDelete, setClassToDelete] = useState<IClass | null>(null)
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

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
        (classItem) => classItem.status !== EClassStatus.NOT_STARTED
      ).length,
    },
    {
      icon: <Users />,
      title: "Số lớp đã kết thúc",
      value: classes.filter(
        (classItem) => classItem.status === EClassStatus.ENDED
      ).length,
    },
  ]

  const handleDelete = (classItem: IClass) => {
    setClassToDelete(classItem)
    confirmModal.open()
  }

  const handleViewDetail = (classItem: IClass) => {
    setSelectedClass(classItem)
    setIsAddingNew(false)
    detailModal.open()
  }

  const handleAddNew = () => {
    setSelectedClass(createNewClassData())
    setIsAddingNew(true)
    detailModal.open()
  }

  const handleSaveSuccess = (updatedClass: IClass) => {
    if (isAddingNew) {
      // Thêm lớp mới vào danh sách
      queryClient.setQueryData(
        CLASS_QUERY_KEYS.getAll,
        (oldData: any) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: [...oldData.data, updatedClass],
          }
        }
      )
      toast.success("Thêm lớp học thành công!")
    } else {
      // Cập nhật lớp hiện có
      queryClient.setQueryData(
        CLASS_QUERY_KEYS.getAll,
        (oldData: any) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: oldData.data.map((item: IClass) =>
              item.id === updatedClass.id ? updatedClass : item
            ),
          }
        }
      )
      toast.success("Cập nhật lớp học thành công!")
    }
    
    // Reset state
    setIsAddingNew(false)
    setSelectedClass(null)
  }

  const handleModalClose = () => {
    setIsAddingNew(false)
    setSelectedClass(null)
    detailModal.close()
  }

 const addButton = (
    <Button
      variant="primary"
      className="ml-auto"
      onClick={handleAddNew}
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
              variant="info"
              className="p-2"
              title="Xem chi tiết"
              onClick={() => handleViewDetail(row)}
            >
              Chi tiết
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
      {selectedClass && (
        <ModalDetailClass
          open={detailModal.isOpen}
          onClose={handleModalClose}
          classData={selectedClass}
          onSaveSuccess={handleSaveSuccess}
          isAddingNew={isAddingNew}
        />
      )}
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
              onClick={() => {
                if (classToDelete) {
                  deleteMutation.mutate(classToDelete.id, {
                    onSuccess: () => {
                      queryClient.setQueryData(
                        CLASS_QUERY_KEYS.getAll,
                        (oldData: any) => {
                          if (!oldData?.data) return oldData
                          return {
                            ...oldData,
                            data: oldData.data.filter(
                              (item: IClass) => item.id !== classToDelete.id
                            ),
                          }
                        }
                      )
                      toast.success("Xóa lớp học thành công!")
                      confirmModal.close()
                      setClassToDelete(null)
                    },
                    onError: () => {
                      toast.error("Có lỗi xảy ra khi xóa lớp học!")
                    },
                  })
                }
              }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
