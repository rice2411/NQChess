import admin from "@/lib/firebase/adminConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, title, body } = await req.json(); // Nhận dữ liệu từ request

    if (!token) {
      return NextResponse.json(
        { error: "Missing device token" },
        { status: 400 }
      );
    }

    const message = {
      notification: {
        title: title || "🔔 PWA Push Notification",
        body: body || "Bạn có một thông báo mới!",
      },
      token, // FCM Token của client
    };

    // Gửi thông báo đến FCM
    const response = await admin.messaging().send(message);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
