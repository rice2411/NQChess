"use client";

import { app, db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useState } from "react";

export default function TestFirestore() {
  const [data, setData] = useState<any[]>([]);

  const saveData = async () => {
    try {
      await addDoc(collection(db, "users"), {
        message: "Hello Firebase!",
        timestamp: new Date(),
      });
      console.log("Dữ liệu đã được lưu thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedData = querySnapshot.docs.map((doc) => doc.data());
      setData(fetchedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  return (
    <div>
      <button onClick={saveData} className="bg-blue-500 text-white p-2 rounded">
        Lưu dữ liệu
      </button>
      <button
        onClick={fetchData}
        className="bg-green-500 text-white p-2 rounded ml-2"
      >
        Lấy dữ liệu
      </button>
      <div>
        {data.map((item, index) => (
          <p key={index}>{item.message}</p>
        ))}
      </div>
    </div>
  );
}
