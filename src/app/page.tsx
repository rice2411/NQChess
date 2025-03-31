import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách API Pages</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/api/students" className="text-blue-500">
            Quản lý học sinh
          </Link>
        </li>
        <li>
          <Link href="/api/anotherPage" className="text-blue-500">
            Trang khác
          </Link>
        </li>
        <li>
          <Link href="/api/someOtherPage" className="text-blue-500">
            Trang khác nữa
          </Link>
        </li>
        {/* Thêm các URL khác ở đây */}
      </ul>
    </div>
  );
}
