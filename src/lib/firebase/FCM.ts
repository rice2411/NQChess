import {
  getMessaging,
  getToken,
  MessagePayload,
  onMessage,
} from "firebase/messaging";
import { app } from "@/lib/firebase/clientConfig";

export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted" && messaging) {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      return token;
    } else {
      console.error("Permission not granted");
      return null;
    }
  } catch (error) {
    console.error("Error getting permission:", error);
  }
};

if (messaging) {
  onMessage(messaging, (payload: MessagePayload) => {
    if (payload.notification) {
      new Notification(payload.notification.title ?? "", {
        body: payload.notification.body ?? "",
        icon: "vercel.svg",
      });
    } else {
      console.error("Received message without notification payload");
    }
  });
}
