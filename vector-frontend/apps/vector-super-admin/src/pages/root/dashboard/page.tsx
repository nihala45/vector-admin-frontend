'use client'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card'
import { Input } from '@repo/ui/components/input'
import { Button } from '@repo/ui/components/button'
import { Badge } from '@repo/ui/components/badge'

import { useGetDashboard } from '../../../apis/dashboard/Queries'

import { useGetMe } from '../../../apis/auth/Queries'

import {
	Package,
	Truck,
	AlertTriangle,
	RotateCcw,
	Search,
	ChevronUp,
	ChevronDown,
	TrendingUp,
	Clock,
	FileText,
	TrendingDown,
	Archive,
	DollarSign,
	Calendar,
	IndianRupee,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	CartesianGrid,
	PieChart,
	Pie,
	Cell,
} from 'recharts'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@repo/ui/components/chart'
import { useNavigate } from 'react-router'

const chartConfig = {
	orders: {
		label: 'Orders',
		color: '#8b5cf6',
	},
}

export default function Dashboard() {
	const navigate = useNavigate()
	const {data: me} = useGetMe()
	const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useGetDashboard()
	const { data: ordersData, isLoading: ordersLoading } = useGetDashboard()
	const { data: LowStockAlerts } = useGetDashboard()
	const { data: returnsData } = useGetDashboard();
	
	const { data: orderData } = useGetDashboard()
	console.log(orderData, 'this is the orderdataaaaaa')

	const {data: offers} = useGetDashboard()
	console.log(offers,'this is the offeereerere')

	
	const offersAddedToday = useMemo(() => {
		if (!offers || !Array.isArray(offers)) return 0;
		
		const today = new Date().toDateString();
		return offers.filter(offer => {
			if (!offer.createdAt) return false;
			const offerDate = new Date(offer.createdAt).toDateString();
			return offerDate === today;
		}).length;
	}, [offers]);

	
	const notifications = useMemo(() => {
		if (!dashboardData) return [];
		
		const notificationsList = [
			{
				id: 1,
				icon: TrendingUp,
				title: `${offersAddedToday} Offers Added Today`,
				time: 'Today',
				color: 'text-green-500',
				bgColor: 'bg-green-50',
			},
			{
				id: 2,
				icon: TrendingUp,
				title: `Best performing product category: Premium Skincare`,
				time: 'Today',
				color: 'text-green-500',
				bgColor: 'bg-green-50',
			},
			{
				id: 3,
				icon: Clock,
				title: `${dashboardData.pickingOrders || 0} Orders in Picking Stage`,
				time: 'Today',
				color: 'text-orange-500',
				bgColor: 'bg-orange-50',
			},
			{
				id: 4,
				icon: Package,
				title: `${dashboardData.packedOrders || 0} Orders Packed and Ready`,
				time: 'Today',
				color: 'text-blue-500',
				bgColor: 'bg-blue-50',
			},
			{
				id: 5,
				icon: Truck,
				title: `${dashboardData.dispatchOrders || 0} Orders Ready for Dispatch`,
				time: 'Today',
				color: 'text-purple-500',
				bgColor: 'bg-purple-50',
			},
			{
				id: 6,
				icon: FileText,
				title: `Total ${dashboardData.totalOrders || 0} Orders Processed`,
				time: 'Today',
				color: 'text-green-500',
				bgColor: 'bg-green-50',
			},
			{
				id: 7,
				icon: DollarSign,
				title: `Today's Revenue: ₹${(dashboardData.todayOrders?.finalPrice || 0).toLocaleString()}`,
				time: 'Today',
				color: 'text-green-500',
				bgColor: 'bg-green-50',
			},
			{
				id: 8,
				icon: DollarSign,
				title: `Total Revenue: ₹${(dashboardData.totalFinalPrice || 0).toLocaleString()}`,
				time: 'All Time',
				color: 'text-blue-500',
				bgColor: 'bg-blue-50',
			},
		];

		
		return notificationsList.filter(notification => 
			notification.id === 6 || 
			notification.id === 7 ||
			notification.id === 8 ||
			!notification.title.includes('0') || 
			notification.title.includes('Offers Added') 
		);
	}, [dashboardData, offersAddedToday]);

	
	const transformOrderData = (orders: any[]) => {
		if (!orders || !Array.isArray(orders)) return [];
		
		return orders.slice(0, 5).map((order, index) => {
			
			const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
			const product = firstItem?.product;
			const quantity = firstItem?.quantity || 0;
			const totalItems = order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
			
			return {
				id: order._id || index,
				orderId: order.orderId || 'N/A',
				customer: order.user?.name || 'Unknown Customer',
				orderDate: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A',
				location: order.shippingAddress ? 
					`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}` : 'N/A',
				productImage: product?.images?.[0] || '/placeholder-product.jpg',
				productName: product?.name || 'Unknown Product',
				quantity: totalItems,
				hasMultipleProducts: order.items && order.items.length > 1,
				status: order.orderStatus || 'pending',
				amount: order.finalAmount || order.totalAmount || 0
			};
		});
	};

	const ordersForTable = transformOrderData(orderData || []);

	// Generate order volume data for the last 10 days
	const orderVolumeData = useMemo(() => {
		if (!orderData || !Array.isArray(orderData)) {
			// Return empty data for last 10 days if no orders
			const emptyData = [];
			for (let i = 9; i >= 0; i--) {
				const date = new Date();
				date.setDate(date.getDate() - i);
				emptyData.push({
					date: date.toLocaleDateString('en-US', { 
						month: 'short', 
						day: 'numeric' 
					}),
					orders: 0
				});
			}
			return emptyData;
		}
		
		// Create an array for the last 10 days
		const last10Days = [];
		for (let i = 9; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			last10Days.push({
				date: date.toLocaleDateString('en-US', { 
					month: 'short', 
					day: 'numeric' 
				}),
				fullDate: date.toDateString(),
				orders: 0
			});
		}
		
		// Count orders for each day
		orderData.forEach(order => {
			if (order.createdAt) {
				const orderDate = new Date(order.createdAt).toDateString();
				const dayData = last10Days.find(day => day.fullDate === orderDate);
				if (dayData) {
					dayData.orders += 1;
				}
			}
		});
		
		// Return only the formatted data without fullDate
		return last10Days.map(day => ({
			date: day.date,
			orders: day.orders
		}));
	}, [orderData]);

	// Create total orders data from dashboard data with correct statuses including pending orders
	const totalOrdersData = useMemo(() => {
		if (!dashboardData) return [];
		
		return [
			{ name: 'Pending', value: dashboardData.pendingOrders || 0, color: '#f97316' },
			{ name: 'Picking', value: dashboardData.pickingOrders || 0, color: '#8b5cf6' },
			{ name: 'Packed', value: dashboardData.packedOrders || 0, color: '#06b6d4' },
			{ name: 'Dispatched', value: dashboardData.dispatchOrders || 0, color: '#10b981' },
		].filter(item => item.value > 0);
	}, [dashboardData]);

	const [searchTerm, setSearchTerm] = useState('')
	const [sortField, setSortField] = useState<string | null>(null)
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

	// Search and sort functionality for orders
	const filteredAndSortedOrders = useMemo(() => {
		let filtered = ordersForTable;
		
		// Filter by search term
		if (searchTerm) {
			filtered = filtered.filter(order => 
				order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.productName.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
		
		// Sort orders
		if (sortField) {
			filtered = [...filtered].sort((a, b) => {
				let aValue = a[sortField as keyof typeof a]
				let bValue = b[sortField as keyof typeof b]

				if (typeof aValue === 'string') {
					aValue = aValue.toLowerCase()
					bValue = (bValue as string).toLowerCase()
				}

				if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
				if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
				return 0
			})
		}
		
		return filtered;
	}, [ordersForTable, searchTerm, sortField, sortDirection])

	const handleSort = (field: string) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
		} else {
			setSortField(field)
			setSortDirection('asc')
		}
	}

	const SortIcon = ({ field }: { field: string }) => {
		if (sortField !== field) return null
		return sortDirection === 'asc' ? (
			<ChevronUp className='h-4 w-4 ml-1' />
		) : (
			<ChevronDown className='h-4 w-4 ml-1' />
		)
	}

	// Update metrics to use dashboard data including pending orders and revenue data
	const metrics = [
		{
			title: 'Pending Orders',
			value: dashboardData?.pendingOrders || '0',
			subtitle: `${dashboardData?.pendingOrders || 0} orders pending`,
			icon: Package,
			color: 'text-orange-600',
		},
		{
			title: 'Ready for Dispatch',
			value: dashboardData?.dispatchOrders || '0',
			subtitle: 'Orders ready for dispatch',
			icon: Truck,
			color: 'text-green-600',
		},
		{
			title: "Today's Revenue",
			value: `₹${(dashboardData?.todayOrders?.finalPrice || 0).toLocaleString()}`,
			subtitle: `${dashboardData?.todayOrders?.count || 0} orders today`,
			icon: IndianRupee,
			color: 'text-yellow-600',
		},
		{
			title: 'Total Revenue',
			value: `₹${(dashboardData?.totalFinalPrice || 0).toLocaleString()}`,
			subtitle: `${dashboardData?.totalOrders || 0} total orders`,
			icon: TrendingUp,
			color: 'text-purple-600',
		}
	]

	// Show loading state
	if (dashboardLoading || ordersLoading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Loading dashboard...</p>
				</div>
			</div>
		)
	}

	// Show error state
	if (dashboardError) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
				<div className='text-center'>
					<AlertTriangle className='h-12 w-12 text-red-500 mx-auto' />
					<p className='mt-4 text-gray-600'>Error loading dashboard data</p>
					<Button 
						onClick={() => window.location.reload()} 
						className='mt-4'
					>
						Retry
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
			<div className=' mx-auto  space-y-6 sm:space-y-8'>
					<div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
					{metrics.map((metric, index) => {
						const IconComponent = metric.icon
						return (
							<Card
								key={index}
								className='bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 ring-1 ring-gray-200 hover:ring-purple-200'
							>
								<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
									<CardTitle className='text-xs sm:text-sm font-medium text-gray-600 leading-tight'>
										{metric.title}
									</CardTitle>
									<div
										className={`p-2 rounded-full bg-gray-50 ${metric.color.replace('text-', 'bg-').replace('-600', '-100')}`}
									>
										<IconComponent
											className={`h-3 w-3 sm:h-4 sm:w-4 ${metric.color}`}
										/>
									</div>
								</CardHeader>
								<CardContent>
									<div className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900'>
										{metric.value}
									</div>
									<p className='text-xs text-gray-500 mt-1 leading-tight'>
										{metric.subtitle}
									</p>
								</CardContent>
							</Card>
						)
					})}
				</div>

				<div className='grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8'>
					<div className='xl:col-span-2 space-y-6'>
						<Card className='bg-white shadow-sm border-0 ring-1 ring-gray-200'>
							<CardHeader className='flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0'>
								<CardTitle className='text-lg font-semibold'>
									Recent Orders
								</CardTitle>
								<Button
									variant='link'
									className='text-purple-600 hover:text-purple-700 p-0 self-start sm:self-center'
									onClick={() => navigate("/orders")}
								>
									See all
								</Button>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
									<Input
										placeholder='Search orders, customers, products, or locations...'
										value={searchTerm}
										onChange={e => setSearchTerm(e.target.value)}
										className='pl-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200'
									/>
								</div>

								<div className='overflow-x-auto -mx-2 sm:mx-0'>
									<div className='inline-block min-w-full align-middle'>
										<table className='min-w-full'>
											<thead>
												<tr className='border-b border-gray-200'>
													<th
														className='text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors text-sm'
														onClick={() => handleSort('orderId')}
													>
														<div className='flex items-center'>
															Order ID
															<SortIcon field='orderId' />
														</div>
													</th>
													<th
														className='text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors text-sm'
														onClick={() => handleSort('customer')}
													>
														<div className='flex items-center'>
															Customer
															<SortIcon field='customer' />
														</div>
													</th>
													<th
														className='text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors text-sm'
														onClick={() => handleSort('orderDate')}
													>
														<div className='flex items-center'>
															Order Date
															<SortIcon field='orderDate' />
														</div>
													</th>
													<th
														className='text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors text-sm'
														onClick={() => handleSort('location')}
													>
														<div className='flex items-center'>
															Location
															<SortIcon field='location' />
														</div>
													</th>
													<th
														className='text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors text-sm'
														onClick={() => handleSort('quantity')}
													>
														<div className='flex items-center'>
															Qty
															<SortIcon field='quantity' />
														</div>
													</th>
												</tr>
											</thead>
											<tbody>
												{filteredAndSortedOrders.map(order => (
													<tr
														key={order.id}
														className='border-b border-gray-100 hover:bg-purple-50/50 transition-colors'
													>
														<td className='py-3 px-2'>
															<div className='flex items-center space-x-2'>
																<span className='font-medium text-gray-900 text-sm leading-tight'>
																	{order.orderId}
																</span>
															</div>
														</td>
														<td className='py-3 px-2'>
															<Badge
																variant='secondary'
																className='bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors'
															>
																{order.customer}
															</Badge>
														</td>
														<td className='py-3 px-2 text-gray-600 text-sm'>
															{order.orderDate}
														</td>
														<td className='py-3 px-2 text-gray-600 text-sm'>
															{order.location}
														</td>
														<td className='py-3 px-2'>
															<Badge
																variant='outline'
																className='bg-blue-50 text-blue-700 border-blue-200'
															>
																{order.quantity}
															</Badge>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>

								{filteredAndSortedOrders.length === 0 && (
									<div className='text-center py-12 text-gray-500'>
										<Search className='h-12 w-12 mx-auto text-gray-300 mb-4' />
										<p>No orders found matching your search.</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					<div className='xl:col-span-1'>
						<Card className='bg-white shadow-sm border-0 ring-1 ring-gray-200 h-fit'>
							<CardHeader>
								<CardTitle className='text-lg font-semibold'>
									Notifications
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3 max-h-96 overflow-y-auto'>
								{notifications.map(notification => {
									const IconComponent = notification.icon
									return (
										<div
											key={notification.id}
											className='flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-gray-200'
										>
											<div
												className={`p-2 rounded-full ${notification.bgColor} flex-shrink-0 group-hover:scale-110 transition-transform`}
											>
												<IconComponent
													className={`h-4 w-4 ${notification.color}`}
												/>
											</div>
											<div className='flex-1 min-w-0'>
												<p className='text-sm font-medium text-gray-900 leading-tight'>
													{notification.title}
												</p>
											</div>
										</div>
									)
								})}
							</CardContent>
						</Card>
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
					<Card className='bg-white shadow-sm border-0 ring-1 ring-gray-200'>
						<CardHeader className='flex flex-row items-center justify-between'>
							<CardTitle className='text-lg font-semibold'>
								Order Volume (Last 10 Days)
							</CardTitle>
							<div className='text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full'>
								{orderVolumeData.length} days
							</div>
						</CardHeader>
						<CardContent>
							<ChartContainer
								config={chartConfig}
								className='w-full h-[200px] sm:h-[250px] md:h-[300px]'
							>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart
										data={orderVolumeData}
										margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' />
										<XAxis
											dataKey='date'
											axisLine={false}
											tickLine={false}
											tick={{ fontSize: 12, fill: '#64748b' }}
											interval={0}
										/>
										<YAxis
											axisLine={false}
											tickLine={false}
											tick={{ fontSize: 12, fill: '#64748b' }}
											allowDecimals={false}
										/>
										<ChartTooltip 
											content={({ active, payload, label }) => {
												if (active && payload && payload.length) {
													return (
														<div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
															<p className="font-medium text-gray-900">{label}</p>
															<p className="text-sm text-purple-600">
																Orders: {payload[0].value}
															</p>
														</div>
													);
												}
												return null;
											}}
										/>
										<Bar
											dataKey='orders'
											fill='#8b5cf6'
											radius={[4, 4, 0, 0]}
											name='Orders'
											className='hover:opacity-80 transition-opacity'
										/>
									</BarChart>
								</ResponsiveContainer>
							</ChartContainer>
						</CardContent>
					</Card>

					<Card className='bg-white shadow-sm border-0 ring-1 ring-gray-200'>
						<CardHeader>
							<CardTitle className='text-lg font-semibold'>
								Order Status Distribution
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='flex items-center justify-center h-[250px] sm:h-[300px]'>
								<div className='relative'>
									<ResponsiveContainer width={200} height={200}>
										<PieChart>
											<Pie
												data={totalOrdersData}
												cx='50%'
												cy='50%'
												innerRadius={50}
												outerRadius={80}
												paddingAngle={2}
												dataKey='value'
											>
												{totalOrdersData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
														className='hover:opacity-80 transition-opacity'
													/>
												))}
											</Pie>
										</PieChart>
									</ResponsiveContainer>
									<div className='absolute inset-0 flex items-center justify-center'>
										<div className='text-center'>
											<div className='text-2xl sm:text-3xl font-bold text-gray-900'>
												{dashboardData?.totalOrders || 0}
											</div>
											<div className='text-xs text-gray-500'>Total Orders</div>
										</div>
									</div>
								</div>
							</div>
							<div className='grid grid-cols-2 gap-3 mt-4'>
								{totalOrdersData.map((item, index) => (
									<div
										key={index}
										className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors'
									>
										<div
											className='w-3 h-3 rounded-full flex-shrink-0'
											style={{ backgroundColor: item.color }}
										/>
										<span className='text-sm text-gray-600 truncate'>
											{item.name}:{' '}
											<span className='font-medium'>{item.value}</span>
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}