"use client";
import { requestNotificationPermission } from "@/lib/firebase";
import TestFirestore from "./test";
import { useEffect } from "react";
export default function Home() {
  const handleGetToken = async () => {
    const token = await requestNotificationPermission();
    localStorage.setItem("token", JSON.stringify(token));
  };
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
    handleGetToken();
    // Yêu cầu quyền nhận thông báo
  }, []);
  return (
    <div>
      <TestFirestore />
    </div>
  );
}
