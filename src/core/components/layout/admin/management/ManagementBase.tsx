import StatisticsCards from "./statistics/page"
import BaseTable from "./table/BaseTable"

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
      <div className="w-full h-auto p-4 mb-6 bg-white shadow-xl dashboard-stats sm:mb-8 md:mb-10 rounded-2xl sm:p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold tracking-tight text-gray-800 sm:text-2xl md:text-3xl sm:mb-6 md:mb-8">
          Trang quản trị
        </h2>
        <StatisticsCards statistics={statistics} />
      </div>
      <BaseTable
        columns={columns}
        data={data}
        addButton={addButton}
        renderAction={renderAction}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}
