import React from 'react'
import {useState} from 'react'
import { NavLink } from "react-router-dom";

export default function Qltailieu() {
  const cellclass = "border px-4 py-2 text-sm text-gray-700";
  const [currentPage, setCurrentPage]= useState(1);
 const [selectedStatus, setSelectedStatus] = useState('');

  const PAGE_SIZE = 10;
  const data = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Tài liệu ${i + 1}`,
  creator: `Người ${i + 1}`,
  date: `2025-07-${(i % 30) + 1}`,
  status: i % 3 === 0 ? 'Đang làm' : i % 3 === 1 ? 'Commited' : 'Done',
}));
  const totalPages= Math.ceil( PAGE_SIZE);
const filteredData = data.filter(item =>
  selectedStatus === "" || item.status === selectedStatus
)
  return (
  <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <form className="w-full sm:w-[70%]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            type="search"
            className="w-full ps-9 pe-24 p-3 border border-gray-300 rounded-lg bg-gray-10 text-sm"
            placeholder="Tìm kiếm tài liệu"
            required
          />
          <button
            type="submit"
            className="absolute right-2 bottom-1.5 bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-600"
          >
            Tìm
          </button>
        </div>
      </form>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border px-3 py-3 rounded text-sm w-[30%]"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="Đang làm">Đang làm</option>
        <option value="Commited">Commited</option>
        <option value="Done">Done</option>
        <option value="Trễ">Trễ</option>
      </select>
    </div>

    <div className="overflow-x-auto mt-4 rounded-md shadow">
      <NavLink to="/admin/tailieu/Tailentailieu" className=''>
        Tải lên tài liệu

      </NavLink>
      <table className="min-w-full border text-sm text-gray-700 bg-white ">
        <thead className="bg-[#435d7d] text-white text-center p-1">
          <tr>
            <th className="border px-4 py-2 text-start">Tên tài liệu</th>
            <th className="border px-4 py-2 text-start">Người tạo</th>
            <th className="border px-4 py-2 text-start">Ngày tạo</th>
            <th className="border px-4 py-2 text-start">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">X</td>
            <td className="border px-4 py-2">X</td>
            <td className="border px-4 py-2">X</td>
            <td className="border px-4 py-2">Y</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">X</td>
            <td className="border px-4 py-2">X</td>
            <td className="border px-4 py-2">X</td>
            <td className="border px-4 py-2">Y</td>
          </tr>
        </tbody>
      </table>
    </div>
    {/* pagination tài liệu */}
    <div className="flex justify-between items-center mt-4 max-w-md mx-auto">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
      >
        ← Trước
      </button>
      <span className="text-sm">
        Trang <strong>{currentPage}</strong> / {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
      >
        Sau →
      </button>
    </div>
  </div>
)

}
