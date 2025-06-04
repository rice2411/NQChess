import React from "react"
import { EClassStatus } from "../../../enums/class.enum"

export type ClassStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "FINISHED"
  | "CANCELLED"
  | "FULL"

const STATUS_MAP: Record<
  EClassStatus,
  { label: string; bg: string; border: string; text: string }
> = {
  ACTIVE: {
    label: "Đang hoạt động",
    bg: "bg-green-100",
    border: "border-green-400",
    text: "text-green-700",
  },
  NOT_STARTED: {
    label: "Chưa khai giảng",
    bg: "bg-orange-100",
    border: "border-orange-400",
    text: "text-orange-700",
  },
  ENDED: {
    label: "Đã kết thúc",
    bg: "bg-gray-100",
    border: "border-gray-400",
    text: "text-gray-700",
  },
}

interface StatusBadgeProps {
  status: EClassStatus
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const info = STATUS_MAP[status] || STATUS_MAP.ENDED
  return (
    <span
      className={`inline-block px-4 py-1 rounded-2xl font-bold text-sm shadow-sm border ${
        info.bg
      } ${info.text} ${info.border} ${className || ""}`}
      style={{ letterSpacing: 0.5 }}
    >
      {info.label}
    </span>
  )
}

export default StatusBadge
