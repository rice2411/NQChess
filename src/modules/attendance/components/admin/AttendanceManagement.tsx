"use client"

import { useState, useEffect } from "react"
import { Button } from "@/core/components/ui/button"
import ManagementBase from "@/core/components/layout/admin/management/ManagementBase"
import { useQueryClient } from "@tanstack/react-query"
import { useAttendanceQueries } from "@/modules/attendance/hooks/useAttendanceQueries"
import { ATTENDANCE_QUERY_KEYS } from "@/modules/attendance/constants/attendanceQueryKey"
import { IAttendance } from "@/modules/attendance/interfaces/attendance.interface"
import AttendanceModal from "./AttendanceModal"
import { useLessonQueries } from "@/modules/lesson/hooks/useLessonQueries"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import { EAttendanceStatus } from "../../enum/attendance.enum"
import { Loader2 } from "lucide-react"

export default function AttendanceManagement() {
  const { getAllQuery, changeStatusMutation } = useAttendanceQueries()
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editAttendance, setEditAttendance] = useState<IAttendance | null>(null)
  const { getAllQuery: lessonQuery } = useLessonQueries()
  const { getAllQuery: studentQuery } = useStudentQueries()

  useEffect(() => {
    getAllQuery.refetch()
    lessonQuery.refetch()
    studentQuery.refetch()
  }, [])

  const attendances: IAttendance[] = getAllQuery.data?.success
    ? getAllQuery.data.data || []
    : []
  const isLoading = getAllQuery.isLoading || getAllQuery.isFetching
  const isError = getAllQuery.isError

  const lessons = lessonQuery.data?.success ? lessonQuery.data.data || [] : []
  const students = studentQuery.data?.success
    ? studentQuery.data.data || []
    : []

  function statusBadge(status: EAttendanceStatus) {
    switch (status) {
      case EAttendanceStatus.PRESENT:
        return <span className="font-semibold text-green-600">Có mặt</span>
      case EAttendanceStatus.ABSENT:
        return <span className="font-semibold text-red-500">Vắng</span>
      case EAttendanceStatus.NOT_YET:
        return (
          <span className="font-semibold text-gray-500">Chưa điểm danh</span>
        )
      default:
        return status
    }
  }

  const getLessonTitle = (id?: string) =>
    lessons.find((l) => l.id === id)?.title || id || ""
  const getStudentName = (id?: string) =>
    students.find((s) => s.id === id)?.fullName || id || ""

  const handleChangeStatus = (row: IAttendance, newStatus: any) => {
    changeStatusMutation.mutate(
      { id: row.id, status: newStatus },
      {
        onSuccess: () => {
          queryClient.setQueryData(
            ATTENDANCE_QUERY_KEYS.getAll,
            (oldData: any) => {
              if (!oldData?.data) return oldData
              return {
                ...oldData,
                data: oldData.data.map((item: IAttendance) =>
                  item.id === row.id ? { ...item, status: newStatus } : item
                ),
              }
            }
          )
        },
      }
    )
  }

  const handleSaveAttendance = (newAttendance: IAttendance) => {
    queryClient.setQueryData(ATTENDANCE_QUERY_KEYS.getAll, (oldData: any) => {
      if (!oldData?.data) return oldData
      return {
        ...oldData,
        data: oldData.data.map((item: IAttendance) =>
          item.id === newAttendance.id ? { ...item, ...newAttendance } : item
        ),
      }
    })
    setModalOpen(false)
  }

  return (
    <>
      <ManagementBase
        statistics={[]}
        isLoading={isLoading}
        isError={isError}
        data={attendances}
        columns={[
          {
            key: "lessonId",
            title: "Buổi học",
            renderCell: (row: IAttendance) => getLessonTitle(row.lessonId),
          },
          {
            key: "studentId",
            title: "Học sinh",
            renderCell: (row: IAttendance) => getStudentName(row.studentId),
          },
          {
            key: "status",
            title: "Trạng thái",
            renderCell: (row: IAttendance) => statusBadge(row.status),
          },
          {
            key: "note",
            title: "Ghi chú",
            renderCell: (row: IAttendance) =>
              row.note && row.note.trim() ? (
                <span className="text-gray-800 whitespace-pre-line">
                  {row.note}
                </span>
              ) : (
                <span className="italic text-gray-400">Chưa có đánh giá</span>
              ),
          },
        ]}
        addButton={
          <Button
            className="flex items-center gap-2 px-4 py-2 mt-2 ml-0 text-sm font-semibold text-white transition bg-green-500 rounded-full shadow-lg md:ml-auto sm:px-5 hover:bg-green-600 md:mt-0 sm:text-base"
            onClick={() => {
              setEditAttendance(null)
              setModalOpen(true)
            }}
          >
            Thêm điểm danh
          </Button>
        }
        renderAction={(row: IAttendance) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={
                row.status === EAttendanceStatus.PRESENT ? "danger" : "success"
              }
              className="flex items-center gap-2 min-w-[130px]"
              disabled={isLoading}
              onClick={() => {
                const newStatus =
                  row.status === EAttendanceStatus.PRESENT
                    ? EAttendanceStatus.ABSENT
                    : EAttendanceStatus.PRESENT
                handleChangeStatus(row, newStatus)
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : row.status === EAttendanceStatus.PRESENT ? (
                <span>Đánh dấu Vắng</span>
              ) : (
                <span>Đánh dấu Có mặt</span>
              )}
            </Button>
            <Button
              size="sm"
              variant="dark"
              onClick={() => {
                setEditAttendance(row)
                setModalOpen(true)
              }}
            >
              Đánh giá
            </Button>
          </div>
        )}
        filters={[
          {
            key: "lessonId",
            label: "Buổi học",
            type: "select",
            options: [],
          },
          {
            key: "studentId",
            label: "Học sinh",
            type: "select",
            options: [],
          },
          {
            key: "status",
            label: "Trạng thái",
            type: "select",
            options: [],
          },
          {
            key: "note",
            label: "Ghi chú",
            type: "text",
          },
        ]}
      />
      <AttendanceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editAttendance}
        onSave={handleSaveAttendance}
      />
    </>
  )
}
