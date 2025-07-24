import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const API_URL = 'https://podcastserver-production.up.railway.app/api/admin/stats';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#0088FE'];

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExport = () => {
    if (!stats) return;
    const csv = `Loại,Giá trị\nTài liệu xử lý,${stats.documents_processing}\nTài liệu đã xong,${stats.documents_done}\nPodcast,${stats.total_podcasts}\nNgười dùng,${stats.total_users}\nLượt xem,${stats.total_views}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'analytics.csv');
    link.click();
  };

  const pieData = stats
    ? [
        { name: 'Đã xử lý', value: stats.documents_done },
        { name: 'Đang xử lý', value: stats.documents_processing },
      ]
    : [];

  const barData = stats
    ? [
        { name: 'Podcast', value: stats.total_podcasts },
        { name: 'Người dùng', value: stats.total_users },
        { name: 'Lượt xem', value: stats.total_views },
      ]
    : [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📊 Thống kê hệ thống</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={fetchStats}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔄 Làm mới
        </button>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📁 Export CSV
        </button>
      </div>

      {loading && <p className="text-gray-600">⏳ Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

    

    {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">📎 Tổng quan tài liệu</h2>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                <Pie
                    dataKey="value"
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                >
                    {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* 🔽 Chú thích màu ở đây */}
            <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }} />
                <span>Đã xử lý</span>
                </div>
                <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }} />
                <span>Đang xử lý</span>
                </div>
            </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">📈 Lượt xem, người dùng, podcast</h2>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
    )}

    </div>
  );
}
