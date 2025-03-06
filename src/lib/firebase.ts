import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getMessaging,
  getToken,
  MessagePayload,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted" && messaging) {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      fetch("https://nq-chess.vercel.app/api/sendNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          title: "🚀 Thông báo từ Next.js",
          body: "Bạn vừa nhận được một thông báo từ server!",
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Response:", data))
        .catch((err) => console.error("Error:", err));
      return token;
    } else {
      console.error("Permission not granted");
      return null;
    }
  } catch (error) {
    console.error("Error getting permission:", error);
  }
};

// Lắng nghe tin nhắn FCM khi ứng dụng đang mở
if (messaging) {
  onMessage(messaging, (payload: MessagePayload) => {
    if (payload.notification) {
      new Notification(payload.notification.title ?? "", {
        body: payload.notification.body ?? "",
        icon: "/icons/icon-192x192.png",
      });
    } else {
      console.error("Received message without notification payload");
    }
  });
}
