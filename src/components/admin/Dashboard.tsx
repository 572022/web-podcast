import { useEffect, useState } from 'react'
import axios from 'axios'
import Activities from '../admin/Activities'

interface Stats {
  documents_done: number
  documents_processing: number
  total_podcasts: number
  total_users: number
  total_views: number
}

interface StatCardProps {
  title: string
  value: number | string
  gradient: string
}
  
const StatCard = ({ title, value, gradient }: StatCardProps) => (
  <div className={`bg-gradient-to-r ${gradient} text-white p-6 rounded-lg shadow-md`}>
    <h3 className="text-lg font-medium">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [activities, setActivities] = useState<any[]>([])
  const API_URL = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!API_URL || !token) {
      console.warn('Thiếu API_URL hoặc token')
      return
    }

    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/podcasts/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        setStats(statsRes.data)
        setActivities(activitiesRes.data?.data || []) // ✅ Truy cập đúng mảng podcast
      } catch (error: any) {
        console.error('Lỗi khi tải dữ liệu dashboard:', error.response?.data?.error || error.message)
        setStats(null)
        setActivities([])
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="p-6 space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tài liệu đã xử lý"
          value={stats?.documents_done ?? '...'}
          gradient="from-blue-500 to-indigo-500"
        />
        <StatCard
          title="Tài liệu đang xử lý"
          value={stats?.documents_processing ?? '...'}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          title="Tổng podcast"
          value={stats?.total_podcasts ?? '...'}
          gradient="from-green-400 to-teal-500"
        />
        <StatCard
          title="Tổng người dùng"
          value={stats?.total_users ?? '...'}
          gradient="from-yellow-400 to-orange-500"
        />
        <div className="col-span-full sm:col-span-2 lg:col-span-4">
          <StatCard
            title="Tổng lượt xem"
            value={stats?.total_views ?? '...'}
            gradient="from-pink-400 to-red-500"
          />
        </div>
      </div>

      {/* Recent Activities Table */}
      <Activities activities={activities} />
    </div>
  )
}

export default Dashboard
