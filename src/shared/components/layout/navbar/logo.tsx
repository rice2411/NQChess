import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  locale: string
}

export function Logo({ locale }: LogoProps) {
  return (
    <div className="flex-shrink-0">
      <Link href={`/${locale}`}>
        <Image
          src="/logo/android-chrome-512x512.png"
          alt="NQ Chess"
          width={60}
          height={60}
          className="rounded-full"
        />
      </Link>
    </div>
  )
}
