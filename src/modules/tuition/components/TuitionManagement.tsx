"use client"

import { useEffect, useState } from "react"
import { PlusCircle, CheckCircle, AlertCircle } from "lucide-react"
import ManagementBase from "@/core/components/layout/admin/management/ManagementBase"
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

import { useTuitionQueries } from "@/modules/tuition/hooks/useTuitionQueries"
import { useClassQueries } from "@/modules/class/hooks/useClassQueries"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import { ITuition } from "@/modules/tuition/interfaces/tuition.interface"
import { ETuitionStatus } from "@/modules/tuition/enum/tuition.enum"

export default function TuitionManagement() {
  const { getAllQuery, changeStatusMutation } = useTuitionQueries()
  const { getAllQuery: classQuery } = useClassQueries()
  const { getAllQuery: studentQuery } = useStudentQueries()

  const [confirmStatus, setConfirmStatus] = useState<{
    tuition: ITuition
    nextStatus: ETuitionStatus
  } | null>(null)

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

  function statusBadge(status: ETuitionStatus) {
    switch (status) {
      case ETuitionStatus.PAID:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
            <CheckCircle className="w-4 h-4" /> Đã nộp
          </span>
        )
      case ETuitionStatus.OVERDUE:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">
            <AlertCircle className="w-4 h-4" /> Quá hạn
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded">
            <AlertCircle className="w-4 h-4" /> Chưa nộp
          </span>
        )
    }
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
      renderCell: (row: ITuition) => statusBadge(row.status),
    },
  ]

  return (
    <>
      <ManagementBase
        statistics={statistics}
        isLoading={isLoading}
        isError={isError}
        data={tuitions}
        columns={columns}
        addButton={<></>}
        renderAction={(row: ITuition) => (
          <div className="flex gap-2">
            {row.status === ETuitionStatus.PAID ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  setConfirmStatus({
                    tuition: row,
                    nextStatus: ETuitionStatus.PENDING,
                  })
                }
                disabled={changeStatusMutation.isPending}
                title="Đánh dấu là Chưa nộp"
              >
                Đánh dấu là Chưa nộp
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={() =>
                  setConfirmStatus({
                    tuition: row,
                    nextStatus: ETuitionStatus.PAID,
                  })
                }
                disabled={changeStatusMutation.isPending}
                title="Đánh dấu là Đã nộp"
              >
                Đánh dấu là dã nộp
              </Button>
            )}
          </div>
        )}
      />

      {/* Dialog xác nhận đổi trạng thái */}
      <AlertDialog
        open={!!confirmStatus}
        onOpenChange={(v) => !v && setConfirmStatus(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xác nhận thay đổi trạng thái học phí
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmStatus?.nextStatus === ETuitionStatus.PAID
                ? `Bạn có chắc muốn đánh dấu học phí tháng ${
                    confirmStatus?.tuition.month
                  } cho học sinh ${getStudentName(
                    confirmStatus?.tuition.studentId
                  )} là Đã nộp?`
                : `Bạn có chắc muốn đánh dấu học phí tháng ${
                    confirmStatus?.tuition.month
                  } cho học sinh ${getStudentName(
                    confirmStatus?.tuition.studentId
                  )} là Chưa nộp?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmStatus) {
                  changeStatusMutation.mutate(
                    {
                      id: confirmStatus.tuition.id,
                      status: confirmStatus.nextStatus,
                    },
                    {
                      onSuccess: () => {
                        getAllQuery.refetch()
                        setConfirmStatus(null)
                      },
                    }
                  )
                }
              }}
              disabled={changeStatusMutation.isPending}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
