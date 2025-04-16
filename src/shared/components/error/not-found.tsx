"use client"

import { Button } from "@/shared/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-6">
          Không tìm thấy trang
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push(`/`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </Button>
          <Link href="/">
            <Button variant="secondary" size="lg">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
