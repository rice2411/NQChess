import React from "react"

interface BaseBadgeProps {
  text: string
  className?: string
}

export function BaseBadge({ text, className = "" }: BaseBadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {text}
    </span>
  )
}
