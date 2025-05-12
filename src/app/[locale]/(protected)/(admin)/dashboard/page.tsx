const orders = [
  {
    id: "59217",
    number: "59217342",
    status: "New order",
    statusColor: "bg-blue-100 text-blue-700 border border-blue-300",
    item: 1,
    customer: "Cody Fisher",
    shipping: { type: "Standard", color: "bg-purple-400" },
    tracking: "940010010936113003113",
  },
  {
    id: "59213",
    number: "59217343",
    status: "Inproduction",
    statusColor: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    item: 2,
    customer: "Kristin Watson",
    shipping: { type: "Priority", color: "bg-cyan-400" },
    tracking: "940010010936113003113",
  },
  {
    id: "59219",
    number: "59217344",
    status: "Shipped",
    statusColor: "bg-green-100 text-green-700 border border-green-300",
    item: 12,
    customer: "Esther Howard",
    shipping: { type: "Express", color: "bg-red-400" },
    tracking: "940010010936113003113",
  },
  {
    id: "59220",
    number: "59217345",
    status: "Cancelled",
    statusColor: "bg-pink-100 text-pink-700 border border-pink-300",
    item: 22,
    customer: "Jenny Wilson",
    shipping: { type: "Express", color: "bg-red-400" },
    tracking: "940010010936113003113",
  },
  {
    id: "59223",
    number: "59217346",
    status: "Rejected",
    statusColor: "bg-red-100 text-red-700 border border-red-300",
    item: 32,
    customer: "John Smith",
    shipping: { type: "Express", color: "bg-red-400" },
    tracking: "940010010936113003113",
  },
  {
    id: "592182",
    number: "59217347",
    status: "Draft",
    statusColor: "bg-gray-100 text-gray-700 border border-gray-300",
    item: 41,
    customer: "Cameron Williamson",
    shipping: { type: "Priority", color: "bg-cyan-400" },
    tracking: "940010010936113003113",
  },
]

export default function DashboardPage() {
  return (
    <div className="bg-white rounded-xl h-auto w-auto p-6 shadow">
      <h2 className="text-2xl font-bold mb-6">Trang quản trị</h2>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white shadow">
          <div className="text-lg font-semibold">Tổng người dùng</div>
          <div className="text-2xl font-bold mt-2">1,234</div>
        </div>
        <div className="bg-gradient-to-r from-green-300 to-blue-300 rounded-lg p-4 text-white shadow">
          <div className="text-lg font-semibold">Đơn hàng hôm nay</div>
          <div className="text-2xl font-bold mt-2">56</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-lg p-4 text-white shadow">
          <div className="text-lg font-semibold">Doanh thu</div>
          <div className="text-2xl font-bold mt-2">12,000,000₫</div>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border border-gray-300 rounded px-3 py-2 mr-2 w-1/3"
        />
        <button className="bg-primary-400 text-white px-4 py-2 rounded hover:bg-primary-500 transition">
          Tìm
        </button>
        <button className="ml-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Thêm mới
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="py-3 px-4 font-semibold text-left rounded-tl-xl">
                Order ID
              </th>
              <th className="py-3 px-4 font-semibold text-left">
                Order number
              </th>
              <th className="py-3 px-4 font-semibold text-left">Status</th>
              <th className="py-3 px-4 font-semibold text-left">Item</th>
              <th className="py-3 px-4 font-semibold text-left">
                Customer name
              </th>
              <th className="py-3 px-4 font-semibold text-left">
                Shipping service
              </th>
              <th className="py-3 px-4 font-semibold text-left">
                Tracking code
              </th>
              <th className="py-3 px-4 font-semibold text-left rounded-tr-xl">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <tr
                key={o.id}
                className="border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">{o.id}</td>
                <td className="py-3 px-4">{o.number}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${o.statusColor}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="py-3 px-4">{o.item}</td>
                <td className="py-3 px-4">{o.customer}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full inline-block ${o.shipping.color}`}
                  ></span>
                  <span>{o.shipping.type}</span>
                </td>
                <td className="py-3 px-4 font-mono text-xs">{o.tracking}</td>
                <td className="py-3 px-4">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    title="Sửa"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-500"
                    >
                      <path d="M15.232 5.232l-2.464-2.464a2 2 0 00-2.828 0l-6.364 6.364a2 2 0 000 2.828l2.464 2.464a2 2 0 002.828 0l6.364-6.364a2 2 0 000-2.828z"></path>
                      <path d="M13.5 6.5L11.5 4.5"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
