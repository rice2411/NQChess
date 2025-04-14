import { NextRequest, NextResponse } from "next/server"
import { S3Service } from "@/core/services/s3.service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/core/config/next-auth.config"

export async function GET(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const folder = searchParams.get("folder") || "uploads"

    const files = await S3Service.listFiles("")
    return NextResponse.json(files)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) {
      return NextResponse.json({ error: "No key provided" }, { status: 400 })
    }

    await S3Service.deleteFile(key)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    )
  }
}
