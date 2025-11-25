import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Search, Filter, Download } from "lucide-react"

const pickListData = [
  {
    id: 1,
    product: "Too Slick Styling Cream",
    qty: 21,
    sku: "SKU12345",
    location: "A1 - S02",
    image: "🧴",
  },
  {
    id: 2,
    product: "Blue water bottle",
    qty: 64,
    sku: "SKU12345",
    location: "B2 - S04",
    image: "🍼",
  },
  {
    id: 3,
    product: "Black long sleeves shirt",
    qty: 34,
    sku: "SKU12345",
    location: "C3 - S05",
    image: "👕",
  },
  {
    id: 4,
    product: "Moccamaster Juice Mak...",
    qty: 15,
    sku: "SKU12345",
    location: "A2 - S01",
    image: "🥤",
  },
  {
    id: 5,
    product: "Prestige non stick Pan",
    qty: 53,
    sku: "SKU12345",
    location: "B2 - S06",
    image: "🍳",
  },
  {
    id: 6,
    product: "Dell Inspiron Gaming i7...",
    qty: 21,
    sku: "SKU12345",
    location: "D1 - S07",
    image: "💻",
  },
]

export function PickListTable() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Pick List Table</CardTitle>
          <Button variant="link" className="text-red-600 hover:text-red-700 p-0 h-auto font-normal">
            See all
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search" className="pl-10 border-gray-200" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Product Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Qty. to Pick</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">SKU</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Location</th>
              </tr>
            </thead>
            <tbody>
              {pickListData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                        {item.image}
                      </div>
                      <span className="font-medium text-gray-900">{item.product}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{item.qty}</td>
                  <td className="py-3 px-4 text-gray-700">{item.sku}</td>
                  <td className="py-3 px-4 text-gray-700">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
