import { requestNotificationPermission } from "@/lib/firebase/FCM";
import { useEffect } from "react";

export const useNotification = () => {
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
  }, []);
};
