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
  Users,
  BookOpen,
  PlayCircle,
  TrendingUp,
  Clock,
  Search,
  ChevronUp,
  ChevronDown,
  DollarSign,
  Calendar,
  IndianRupee,
  GraduationCap,
  Award,
  FileText,
  AlertCircle,
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
} from '@repo/ui/components/chart'
import { useNavigate } from 'react-router'

const chartConfig = {
  enrollments: {
    label: 'Enrollments',
    color: '#8b5cf6',
  },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: me } = useGetMe()
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useGetDashboard()

  // Assuming your backend returns these fields for a learning app
  const {
    totalStudents = 0,
    totalCourses = 0,
    activeEnrollments = 0,
    pendingReviews = 0,
    todayEnrollments = 0,
    todayRevenue = 0,
    totalRevenue = 0,
    recentEnrollments = [],
    courseCompletions = 0,
    enrollmentTrend = [], // last 10 days
    enrollmentStatusData = [], // for pie chart
  } = dashboardData || {}

  // Notifications relevant to learning platform
  const notifications = useMemo(() => {
    return [
      {
        id: 1,
        icon: TrendingUp,
        title: `${todayEnrollments} New Enrollments Today`,
        time: 'Today',
        color: 'text-green-500',
        bgColor: 'bg-green-50',
      },
      {
        id: 2,
        icon: GraduationCap,
        title: `${courseCompletions} Students Completed Courses Today`,
        time: 'Today',
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
      },
      {
        id: 3,
        icon: Clock,
        title: `${pendingReviews} Course Reviews Awaiting Approval`,
        time: 'Today',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
      },
      {
        id: 4,
        icon: Award,
        title: `Top Performing Course: "Advanced React & TypeScript"`,
        time: 'This Week',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
      },
      {
        id: 5,
        icon: DollarSign,
        title: `Today's Revenue: ₹${todayRevenue.toLocaleString()}`,
        time: 'Today',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      {
        id: 6,
        icon: IndianRupee,
        title: `Total Revenue: ₹${totalRevenue.toLocaleString()}`,
        time: 'All Time',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
      },
    ]
  }, [todayEnrollments, courseCompletions, pendingReviews, todayRevenue, totalRevenue])

  // Recent Enrollments Table
  const recentEnrollmentsList = useMemo(() => {
    if (!recentEnrollments || !Array.isArray(recentEnrollments)) return []
    return recentEnrollments.slice(0, 5).map((enrollment: any) => ({
      id: enrollment._id,
      enrollmentId: enrollment.enrollmentId || 'N/A',
      studentName: enrollment.student?.name || 'Anonymous Learner',
      courseTitle: enrollment.course?.title || 'Untitled Course',
      enrollmentDate: new Date(enrollment.createdAt).toLocaleDateString(),
      progress: enrollment.progress || 0,
      status: enrollment.status || 'active',
      amount: enrollment.finalAmount || 0,
    }))
  }, [recentEnrollments])

  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredAndSortedEnrollments = useMemo(() => {
    let filtered = recentEnrollmentsList

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

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
    return filtered
  }, [recentEnrollmentsList, searchTerm, sortField, sortDirection])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <ChevronUp className='h-4 w-4 ml-1' /> : <ChevronDown className='h-4 w-4 ml-1' />
  }

  // Key Metrics
  const metrics = [
    {
      title: 'Total Students',
      value: totalStudents.toLocaleString(),
      subtitle: 'Active learners',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Courses',
      value: totalCourses,
      subtitle: 'Published courses',
      icon: BookOpen,
      color: 'text-purple-600',
    },
    {
      title: 'Active Enrollments',
      value: activeEnrollments.toLocaleString(),
      subtitle: 'Currently learning',
      icon: PlayCircle,
      color: 'text-green-600',
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      subtitle: 'All-time earnings',
      icon: IndianRupee,
      color: 'text-yellow-600',
    },
  ]

  // Loading & Error States
  if (dashboardLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (dashboardError) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto' />
          <p className='mt-4 text-gray-600'>Error loading dashboard data</p>
          <Button onClick={() => window.location.reload()} className='mt-4'>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8'>
        {/* Metrics Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card
                key={index}
                className='bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 ring-1 ring-gray-200 hover:ring-purple-200'
              >
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-xs sm:text-sm font-medium text-gray-600'>
                    {metric.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full bg-gray-50 ${metric.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl sm:text-3xl font-bold text-gray-900'>{metric.value}</div>
                  <p className='text-xs text-gray-500 mt-1'>{metric.subtitle}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8'>
          {/* Recent Enrollments */}
          <div className='xl:col-span-2'>
            <Card className='bg-white shadow-sm border-0 ring-1 ring-gray-200'>
              <CardHeader className='flex flex-col sm:flex-row sm:items-center justify-between'>
                <CardTitle className='text-lg font-semibold'>Recent Enrollments</CardTitle>
                <Button variant='link' className='text-purple-600 p-0' onClick={() => navigate('/enrollments')}>
                  See all
                </Button>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <Input
                    placeholder='Search by student, course, or enrollment ID...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10'
                  />
                </div>

                <div className='overflow-x-auto'>
                  <table className='min-w-full'>
                    <thead>
                      <tr className='border-b border-gray-200 text-left text-xs font-medium text-gray-600'>
                        <th className='py-3 px-2 cursor-pointer hover:text-gray-900' onClick={() => handleSort('enrollmentId')}>
                          <div className='flex items-center'>ID <SortIcon field='enrollmentId' /></div>
                        </th>
                        <th className='py-3 px-2 cursor-pointer hover:text-gray-900' onClick={() => handleSort('studentName')}>
                          <div className='flex items-center'>Student <SortIcon field='studentName' /></div>
                        </th>
                        <th className='py-3 px-2 cursor-pointer hover:text-gray-900' onClick={() => handleSort('courseTitle')}>
                          <div className='flex items-center'>Course <SortIcon field='courseTitle' /></div>
                        </th>
                        <th className='py-3 px-2'>Date</th>
                        <th className='py-3 px-2'>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedEnrollments.map((e) => (
                        <tr key={e.id} className='border-b border-gray-100 hover:bg-purple-50/50'>
                          <td className='py-3 px-2 text-sm font-medium'>{e.enrollmentId}</td>
                          <td className='py-3 px-2'>
                            <Badge variant='secondary' className='bg-purple-100 text-purple-800'>
                              {e.studentName}
                            </Badge>
                          </td>
                          <td className='py-3 px-2 text-sm text-gray-700 truncate max-w-xs'>{e.courseTitle}</td>
                          <td className='py-3 px-2 text-sm text-gray-600'>{e.enrollmentDate}</td>
                          <td className='py-3 px-2'>
                            <div className='flex items-center space-x-2'>
                              <div className='w-16 bg-gray-200 rounded-full h-2'>
                                <div
                                  className='bg-purple-600 h-2 rounded-full transition-all'
                                  style={{ width: `${e.progress}%` }}
                                />
                              </div>
                              <span className='text-xs text-gray-600'>{e.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredAndSortedEnrollments.length === 0 && (
                    <div className='text-center py-12 text-gray-500'>
                      <Search className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <p>No enrollments found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div>
            <Card className='bg-white shadow-sm border-0 ring-1 ring-gray-200 h-fit'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Notifications</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 max-h-96 overflow-y-auto'>
                {notifications.map((n) => {
                  const Icon = n.icon
                  return (
                    <div
                      key={n.id}
                      className='flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-gray-200'
                    >
                      <div className={`p-2 rounded-full ${n.bgColor} group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-4 w-4 ${n.color}`} />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-900'>{n.title}</p>
                        <p className='text-xs text-gray-500'>{n.time}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
          {/* Enrollment Trend */}
          <Card className='bg-white shadow-sm border-0 ring-1 ring-gray-200'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-lg font-semibold'>Enrollments (Last 10 Days)</CardTitle>
              <div className='text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full'>10 days</div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={enrollmentTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' />
                    <XAxis dataKey='date' tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-sm'>
                              <p className='font-medium'>{label}</p>
                              <p className='text-purple-600'>Enrollments: {payload[0].value}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey='enrollments' fill='#8b5cf6' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Enrollment Status Pie */}
          <Card className='bg-white shadow-sm border-0 ring-1 ring-gray-200'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>Enrollment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-center h-[300px]'>
                <ResponsiveContainer width={220} height={220}>
                  <PieChart>
                    <Pie
                      data={enrollmentStatusData}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey='value'
                    >
                      {enrollmentStatusData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className='absolute text-center'>
                  <div className='text-3xl font-bold text-gray-900'>{activeEnrollments}</div>
                  <div className='text-xs text-gray-500'>Active</div>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-3 mt-6'>
                {enrollmentStatusData.map((item: any) => (
                  <div key={item.name} className='flex items-center space-x-2'>
                    <div className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
                    <span className='text-sm text-gray-600'>
                      {item.name}: <strong>{item.value}</strong>
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