import {
  User,
  ShoppingBag,
  DollarSign,
  Plus,
  Search,
  Pencil,
} from "lucide-react"

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
    <div className="p-8  ">
      <div className="dashboard-stats mb-10 bg-white rounded-2xl h-auto w-auto p-8 shadow-xl">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">
          Trang quản trị
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white shadow-lg flex items-center gap-4">
            <User className="h-10 w-10 opacity-80" />
            <div>
              <div className="text-lg font-semibold">Tổng người dùng</div>
              <div className="text-3xl font-extrabold mt-1">1,234</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg flex items-center gap-4">
            <ShoppingBag className="h-10 w-10 opacity-80" />
            <div>
              <div className="text-lg font-semibold">Đơn hàng hôm nay</div>
              <div className="text-3xl font-extrabold mt-1">56</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg flex items-center gap-4">
            <DollarSign className="h-10 w-10 opacity-80" />
            <div>
              <div className="text-lg font-semibold">Doanh thu</div>
              <div className="text-3xl font-extrabold mt-1">12,000,000₫</div>
            </div>
          </div>
        </div>
      </div>

      {/* Block table đơn hàng */}
      <div className="dashboard-orders bg-white rounded-2xl h-auto w-auto p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center mb-6 gap-3">
          <div className="relative w-full md:w-1/3">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="border border-gray-300 rounded-full pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition outline-none shadow-sm"
            />
          </div>
          <button className="bg-primary-500 text-white px-5 py-2 rounded-full hover:bg-primary-600 shadow transition flex items-center gap-2 mt-2 md:mt-0">
            <Search className="h-5 w-5" />
            Tìm
          </button>
          <button className="ml-0 md:ml-auto bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 shadow-lg transition flex items-center gap-2 mt-2 md:mt-0 font-semibold">
            <Plus className="h-5 w-5" />
            Thêm mới
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl shadow bg-white border border-gray-100">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
                <th className="py-4 px-5 font-bold text-left rounded-tl-2xl">
                  Order ID
                </th>
                <th className="py-4 px-5 font-bold text-left">Order number</th>
                <th className="py-4 px-5 font-bold text-left">Status</th>
                <th className="py-4 px-5 font-bold text-left">Item</th>
                <th className="py-4 px-5 font-bold text-left">Customer name</th>
                <th className="py-4 px-5 font-bold text-left">
                  Shipping service
                </th>
                <th className="py-4 px-5 font-bold text-left">Tracking code</th>
                <th className="py-4 px-5 font-bold text-left rounded-tr-2xl">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b last:border-b-0 hover:bg-primary-50/60 transition group"
                >
                  <td className="py-4 px-5">{o.id}</td>
                  <td className="py-4 px-5">{o.number}</td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${o.statusColor}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-4 px-5">{o.item}</td>
                  <td className="py-4 px-5">{o.customer}</td>
                  <td className="py-4 px-5 flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full inline-block ${o.shipping.color}`}
                    ></span>
                    <span>{o.shipping.type}</span>
                  </td>
                  <td className="py-4 px-5 font-mono text-xs">{o.tracking}</td>
                  <td className="py-4 px-5">
                    <button
                      className="p-2 rounded-full hover:bg-primary-100 transition group/edit relative"
                      title="Sửa"
                    >
                      <Pencil className="h-5 w-5 text-primary-500 group-hover/edit:text-primary-700" />
                      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover/edit:opacity-100 transition pointer-events-none whitespace-nowrap">
                        Sửa đơn
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
