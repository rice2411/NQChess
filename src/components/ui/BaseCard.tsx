import React from "react"

interface BaseCardProps {
  title: string
  value: React.ReactNode
  className?: string
}

export function BaseCard({ title, value, className = "" }: BaseCardProps) {
  return (
    <div className={`rounded-lg p-4 text-white shadow ${className}`}>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  )
}
