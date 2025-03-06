"use client";

export default function TestFirestore() {
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
        .then((data) => console.log("Response:", data))
        .catch((err) => console.error("Error:", err));
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  return (
    <div>
      <button onClick={saveData} className="bg-blue-500 text-white p-2 rounded">
        Hello
      </button>
    </div>
  );
}
