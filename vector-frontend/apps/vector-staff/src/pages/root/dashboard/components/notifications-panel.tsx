import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card"
import { ChevronDown, TrendingUp, Clock, FileText, Timer } from "lucide-react"

const notifications = [
  {
    id: 1,
    icon: (
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <TrendingUp className="h-4 w-4 text-blue-600" />
      </div>
    ),
    title: "3 Stock Mismatches in last week",
    time: "Today",
    expandable: true,
  },
  {
    id: 2,
    icon: (
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <TrendingUp className="h-4 w-4 text-green-600" />
      </div>
    ),
    title: "Best preforming product category: Kitchen storage",
    description: "SKU 214, SKU 321, SKU 653 are the best selling products this week",
    expandable: true,
  },
  {
    id: 3,
    icon: (
      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
        <Clock className="h-4 w-4 text-orange-600" />
      </div>
    ),
    title: "2 products aging greater than 90 days",
    time: "Thursday",
    expandable: true,
  },
  {
    id: 4,
    icon: (
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <FileText className="h-4 w-4 text-gray-600" />
      </div>
    ),
    title: "1 Audit missed last month",
    time: "11 Apr",
    expandable: true,
  },
  {
    id: 5,
    icon: (
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <Timer className="h-4 w-4 text-blue-600" />
      </div>
    ),
    title: "Dispatch time decreased by 10% this week",
    time: "11 Apr",
    expandable: true,
  },
  {
    id: 6,
    icon: (
      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
        <Clock className="h-4 w-4 text-orange-600" />
      </div>
    ),
    title: "2 products aging greater",
    expandable: true,
  },
]

export function NotificationsPanel() {
  return (
    <Card className="border-0 shadow-sm h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {notification.icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-tight">{notification.title}</p>
              {notification.description && <p className="text-xs text-gray-600 mt-1">{notification.description}</p>}
              {notification.time && <p className="text-xs text-gray-500 mt-1">{notification.time}</p>}
            </div>
            {notification.expandable && <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
