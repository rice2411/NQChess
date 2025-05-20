import StatisticsCards from "./statistics/page"
import BaseTable from "./table/page"

interface IManagementBaseProps {
  statistics: any[]
  isLoading: boolean
  isError: boolean
  data: any[]
  columns: any[]
  addButton?: React.ReactNode
  renderAction?: (row: any) => React.ReactNode
}

export default function ManagementBase({
  statistics,
  isLoading,
  isError,
  data,
  columns,
  addButton,
  renderAction,
}: IManagementBaseProps) {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="dashboard-stats mb-6 sm:mb-8 md:mb-10 bg-white rounded-2xl h-auto w-full p-4 sm:p-6 md:p-8 shadow-xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 sm:mb-6 md:mb-8 text-gray-800 tracking-tight">
          Trang quản trị
        </h2>
        <StatisticsCards statistics={statistics} />
      </div>
      {isLoading ? (
        <div className="text-center py-6 sm:py-8 md:py-10 text-base sm:text-lg">
          Đang tải dữ liệu...
        </div>
      ) : isError ? (
        <div className="text-center py-6 sm:py-8 md:py-10 text-red-500 text-base sm:text-lg">
          Lỗi tải dữ liệu
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-6 sm:py-8 md:py-10 italic text-gray-500 text-base sm:text-lg">
          Không có dữ liệu
        </div>
      ) : (
        <BaseTable columns={columns} data={data} addButton={addButton} renderAction={renderAction} />
      )}
    </div>
  )
}
