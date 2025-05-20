import React, { ReactElement } from "react"
import { Card,  CardContent } from "@/core/components/ui/card"

interface StatisticsCardProps {
  icon: ReactElement<SVGElement>
  title: string
  value: string
}

interface StatisticsCardsProps {
  statistics: StatisticsCardProps[]
  gradients?: string[]
}

// Hàm sinh nhiều màu gradient hơn dựa trên số lượng item
function generateGradients(count: number) {
  const palette = [
    ["from-purple-600", "to-pink-500"],
    ["from-green-400", "to-blue-500"],
    ["from-yellow-400", "to-orange-500"],
    ["from-cyan-400", "to-blue-600"],
    ["from-pink-400", "to-red-500"],
    ["from-indigo-400", "to-purple-600"],
    ["from-emerald-400", "to-lime-500"],
    ["from-fuchsia-500", "to-pink-400"],
    ["from-orange-400", "to-yellow-500"],
    ["from-blue-400", "to-indigo-500"],
  ]
  return Array.from(
    { length: count },
    (_, i) =>
      `bg-gradient-to-r ${palette[i % palette.length][0]} ${
        palette[i % palette.length][1]
      }`
  )
}

export default function StatisticsCards({
  statistics,
  gradients,
}: StatisticsCardsProps) {
  const iconClass = "h-10 w-10 opacity-80"
  const usedGradients = gradients || generateGradients(statistics.length)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {statistics.map((item, idx) => (
        <div
          key={item.title}
          className={`${usedGradients[idx % usedGradients.length]} rounded-2xl`}
        >
          <Card className="p-4 sm:p-6 gap-3 sm:gap-4 m-0 flex text-white">
            <div>
              <CardContent className="p-0 flex items-center gap-2">
                {React.cloneElement(item.icon, { className: iconClass })}

                <div>
                  {item.title}
                  <span className="text-2xl sm:text-3xl font-extrabold mt-1 block">
                    {item.value}
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
