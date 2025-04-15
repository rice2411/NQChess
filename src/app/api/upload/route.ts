import { NextRequest, NextResponse } from "next/server"
import { CloudinaryService } from "@/core/service/cloudinary.service"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const result = await CloudinaryService.uploadImage(file)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in upload route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    )
  }
}
