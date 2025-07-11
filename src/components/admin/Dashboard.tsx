import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [activities, setActivities] = useState([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dashboard/recent-files`
        )
        setActivities(res.data)
      } catch (error) {
        console.error('Lỗi khi tải hoạt động gần đây:', error)
      }
    }
    fetchActivities()
  }, [])

  return (
    <div className="p-6 space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium">Tổng tài liệu</h3>
          <p className="text-3xl font-bold mt-2">124</p>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium">Tổng podcast</h3>
          <p className="text-3xl font-bold mt-2">45</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium">Tổng người dùng</h3>
          <p className="text-3xl font-bold mt-2">320</p>
        </div>

        <div className="bg-gradient-to-r from-pink-400 to-rose-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium">Tổng lượt xem</h3>
          <p className="text-3xl font-bold mt-2">2,540</p>
        </div>
      </div>

      {/* Recent Activities Table */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hoạt động gần đây</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Người dùng</th>
                <th className="px-4 py-3 text-left">Tên file gốc</th>
                <th className="px-4 py-3 text-left">Đường dẫn</th>
                <th className="px-4 py-3 text-left">Tiêu đề</th>
                <th className="px-4 py-3 text-left">Lượt xem</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((item: any, idx: number) => (
                <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{item?.nguoi_dung?.ho_ten || 'Ẩn danh'}</td>
                  <td className="px-4 py-3">{item?.ten_file_goc}</td>
                  <td className="px-4 py-3">
                    <a
                      href={item?.duong_dan_file}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Tải về
                    </a>
                  </td>
                  <td className="px-4 py-3">{item?.tieu_de}</td>
                  <td className="px-4 py-3">{item?.luot_xem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
