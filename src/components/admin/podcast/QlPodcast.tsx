import { useState, useMemo } from 'react'
import { NavLink } from "react-router-dom";
// Dữ liệu giả lập
const podcasts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Podcast ${i + 1}`,
  author: `Tác giả ${i + 1}`,
  date: `2025-07-${(i % 30) + 1}`,
  status: ['Công khai', 'Bản nháp', 'Đã ẩn'][i % 3],
}))

const PAGE_SIZE = 10

export default function PodcastTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    return podcasts
      .filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(p => selectedStatus === '' || p.status === selectedStatus)
      .sort((a, b) =>
        sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      )
  }, [searchTerm, selectedStatus, sortAsc])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Tìm kiếm + Lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm podcast..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full sm:w-1/2"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full sm:w-1/3"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Công khai">Công khai</option>
          <option value="Bản nháp">Bản nháp</option>
          <option value="Đã ẩn">Đã ẩn</option>
        </select>
      </div>
        <NavLink to="/admin/podcast/UploadPodcast" className=''>
        Tải lên Podcast
      </NavLink>
      {/* Bảng */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-[#435d7d] text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left cursor-pointer" onClick={() => setSortAsc(!sortAsc)}>
                Tên Podcast {sortAsc ? '▲' : '▼'}
              </th>
              <th className="p-3 text-left">Tác giả</th>
              <th className="p-3 text-left">Ngày</th>
              <th className="p-3 text-left">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((podcast) => (
              <tr key={podcast.id} className="border-t">
                <td className="p-3">{podcast.id}</td>
                <td className="p-3">{podcast.title}</td>
                <td className="p-3">{podcast.author}</td>
                <td className="p-3">{podcast.date}</td>
                <td className="p-3">{podcast.status}</td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-3 text-red-500">
                  Không tìm thấy kết quả
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="flex justify-between items-center mt-4 w-full sm:w-1/2 mx-auto">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ← Trước
        </button>
        <span className="text-sm">
          Trang <strong>{currentPage}</strong> / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Sau →
        </button>
      </div>
    </div>
  )
}
