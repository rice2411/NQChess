importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js"
);

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCi6AR18QDx80YINjPjtkdkv3iUIcwb2uo",
  authDomain: "nqchess-39213.firebaseapp.com",
  projectId: "nqchess-39213",
  storageBucket: "nqchess-39213.firebasestorage.app",
  messagingSenderId: "556437418343",
  appId: "1:556437418343:web:3ee2930036a8806ac1bfc2",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Xử lý thông báo khi PWA đang chạy nền
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icons/icon-192x192.png",
  });
});
