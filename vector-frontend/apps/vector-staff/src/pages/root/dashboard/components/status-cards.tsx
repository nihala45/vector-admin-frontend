import { Card, CardContent } from "@repo/ui/components/card"

const statusData = [
  {
    title: "Pending Orders",
    value: "45",
    change: "+8 Orders added",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: "🟠",
  },
  {
    title: "Ready for Dispatch",
    value: "104",
    change: "+10 Orders added",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: "🟢",
  },
  {
    title: "Low Stock Alerts",
    value: "5",
    change: "+2 Products Stock Running Low",
    color: "text-red-600",
    bgColor: "bg-red-50",
    icon: "🔴",
  },
  {
    title: "Return to Process",
    value: "20",
    change: "+2 Returned",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: "🔵",
  },
]

export function StatusCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusData.map((item, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{item.icon}</span>
                  <h3 className="text-sm font-medium text-gray-600">{item.title}</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className={`text-xs ${item.color}`}>{item.change}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
