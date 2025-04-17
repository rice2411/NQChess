import { cn } from "@/core/utils/tailwind.util"
import Image from "next/image"

interface AvatarProps {
  src?: string
  name: string
  className?: string
}

export function Avatar({ src, name, className }: AvatarProps) {
  const getInitials = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10",
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          className="rounded-full object-cover"
        />
      ) : (
        <span className="text-lg font-medium text-white">
          {getInitials(name)}
        </span>
      )}
    </div>
  )
}
