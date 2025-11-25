import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const orderVolumeData = [
  { name: "Feb 01", value: 60 },
  { name: "Feb 02", value: 95 },
  { name: "Feb 03", value: 85 },
  { name: "Feb 04", value: 50 },
  { name: "Feb 05", value: 25 },
  { name: "Feb 06", value: 40 },
  { name: "Feb 07", value: 75 },
  { name: "Feb 08", value: 70 },
  { name: "Feb 09", value: 55 },
  { name: "Feb 10", value: 60 },
  { name: "Feb 11", value: 35 },
  { name: "Feb 12", value: 30 },
];

const orderManagementData = [
  { name: "Pending", value: 31, color: "#f97316" },
  { name: "Picked", value: 22, color: "#8b5cf6" },
  { name: "Packed", value: 80, color: "#10b981" },
  { name: "Dispatched", value: 20, color: "#06b6d4" },
];

const chartConfig = {
  value: {
    label: "Orders",
    color: "#8b5cf6",
  },
};

export function OrderCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Volume Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg-flex-row">
            <CardTitle className="text-lg font-semibold">
              Order Volume
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-transparent"
              >
                All Categories
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-transparent"
              >
                Feb 01 - Feb 12 📅
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full h-64 sm:h-72 md:h-80">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderVolumeData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Order Management Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-semibold">
              Order Management
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent"
            >
              All
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Pie Chart */}
            <div className="relative w-full sm:w-64 md:w-72  sm:h-64 md:h-72 rounded-full flex-shrink-0 lg-flex-row">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderManagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="95%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {orderManagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    153
                  </p>
                  <p className="text-sm text-gray-500">Total Orders</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 w-full lg:w-auto space-y-3">
              {orderManagementData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
