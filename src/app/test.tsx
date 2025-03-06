"use client";

import { useState } from "react";

export default function TestFirestore() {
  const [error, setError] = useState("");
  const saveData = async () => {
    try {
      fetch("https://nq-chess.vercel.app/api/sendNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: JSON.parse(localStorage.getItem("token") as string),
          title: "🚀 Thông báo từ Next.js",
          body: "Bạn vừa nhận được một thông báo từ server!",
        }),
      })
        .then((res) => res.json())
        .then((data) => setError(JSON.stringify(data)))
        .catch((err) => setError(JSON.stringify(err)));
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      setError(JSON.stringify(error));
    }
  };

  return (
    <div>
      <button onClick={saveData} className="bg-blue-500 text-white p-2 rounded">
        Hello
      </button>
      {error}
    </div>
  );
}
