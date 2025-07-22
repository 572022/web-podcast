import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditPodcastForm from './EditPodcastForm';

interface Podcast {
  id: string;
  tieu_de: string;
  mo_ta: string;
  duong_dan_audio: string;
  thoi_luong_giay: number;
  hinh_anh_dai_dien: string;
  trang_thai: string;
  the_tag: string;
  ngay_tao_ra: string;
  luot_xem: number;
  danhmuc: {
    ten_danh_muc: string;
  };
}

interface PodcastDetail extends Podcast {
  tailieu: {
    ten_file_goc: string;
    duong_dan_file: string;
  };
}

interface Category {
  id: string;
  ten_danh_muc: string;
}

export default function QlPodcast() {
  const token = localStorage.getItem('token') || '';
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

const fetchData = async () => {
    try {
      setLoading(true);
      let url = '';

      if (searchQuery.trim()) {
url = `https://podcastserver-production.up.railway.app/api/podcasts/search?q=${encodeURIComponent(
  searchQuery
)}&page=${page}&limit=10`;

      } else {
        url = `https://podcastserver-production.up.railway.app/api/podcasts/?page=${page}&limit=10&sort_by=date${
          selectedCategory ? `&category=${selectedCategory}` : ''
        }`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPodcasts(res.data.data || []);
      setTotalPages(res.data.pagination?.total_pages || 1);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải danh sách podcast');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://podcastserver-production.up.railway.app/api/categories/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh mục', error);
    }
  };

  const fetchPodcastDetail = async (id: string) => {
    try {
      const res = await axios.get(
        `https://podcastserver-production.up.railway.app/api/podcasts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedPodcast(res.data.data);
      setShowDetail(true);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải chi tiết podcast');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

return (
  <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
    <h1 className="text-2xl font-bold text-gray-800">Quản lý Podcast</h1>

    {/* Bộ lọc và tìm kiếm */}
    <div className="flex flex-col md:flex-row items-center gap-4">
      {/* Dropdown danh mục */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Lọc danh mục:</label>
        <select
          className="border rounded-md px-3 py-2 text-sm shadow-sm"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.ten_danh_muc}
            </option>
          ))}
        </select>
      </div>

      {/* Tìm kiếm */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="🔍 Tìm theo tiêu đề, mô tả hoặc tag..."
          className="w-full border px-4 py-2 rounded-md shadow-sm text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPage(1);
              fetchData();
            }
          }}
        />
      </div>
    </div>

    {/* Danh sách podcast */}
{loading ? (
  <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
    {podcasts.length === 0 ? (
      <p className="text-gray-400 col-span-full text-center">Không có podcast nào.</p>
    ) : (
      podcasts.map((podcast) => (
        <div
          key={podcast.id}
          className="bg-white p-3 rounded-lg shadow-sm flex gap-3 hover:ring-2 ring-blue-200 transition"
        >
          <img
            src={podcast.hinh_anh_dai_dien || '/placeholder.jpg'}
            alt="Ảnh đại diện"
            className="w-24 h-24 object-cover rounded-md shadow-sm"
          />
          <div className="flex-1 space-y-1">
            <h2
              className="text-base font-semibold text-blue-700 hover:underline cursor-pointer truncate"
              onClick={() => fetchPodcastDetail(podcast.id)}
              title={podcast.tieu_de}
            >
              {podcast.tieu_de}
            </h2>
            <p className="text-sm text-gray-600 line-clamp-2">{podcast.mo_ta}</p>
            <div className="text-xs text-gray-500 space-y-0.5">
              <p> Thời lượng{formatDuration(podcast.thoi_luong_giay)}</p>
              <p>Danh mục {podcast.danhmuc?.ten_danh_muc || 'Không có'}</p>
              <p>Thẻ tag {podcast.the_tag}</p>
              <p
                className={
                  podcast.trang_thai === 'Tắt'
                    ? 'text-red-500 font-semibold'
                    : 'text-green-600 font-semibold'
                }
              >
                {podcast.trang_thai}
              </p>
            </div>
            <div className="pt-1">
              <button
                onClick={() => setEditId(podcast.id)}
                className="text-sm text-indigo-600 hover:underline"
              >
                ✏️ Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
)}


    {/* Modal chi tiết */}
    {showDetail && selectedPodcast && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-xl relative">
          <button
            onClick={() => setShowDetail(false)}
            className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-3">{selectedPodcast.tieu_de}</h2>
          <img
            src={selectedPodcast.hinh_anh_dai_dien || '/placeholder.jpg'}
            className="w-full h-48 object-cover rounded-lg mb-4"
            alt="Ảnh đại diện"
          />
          <div className="space-y-2 text-sm">
            <p><strong>Mô tả:</strong> {selectedPodcast.mo_ta}</p>
            <p><strong>Thời lượng:</strong> {formatDuration(selectedPodcast.thoi_luong_giay)}</p>
            <p><strong>Trạng thái:</strong> {selectedPodcast.trang_thai}</p>
            <p><strong>Tags:</strong> {selectedPodcast.the_tag}</p>
            <p><strong>Lượt xem:</strong> {selectedPodcast.luot_xem}</p>
            <p><strong>Danh mục:</strong> {selectedPodcast.danhmuc?.ten_danh_muc}</p>
          </div>
          {selectedPodcast.duong_dan_audio && (
            <audio className="w-full mt-4" controls src={selectedPodcast.duong_dan_audio} />
          )}
        </div>
      </div>
    )}

    {/* Modal chỉnh sửa */}
    {editId && (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-auto">
  <div className="bg-white p-4 md:p-6 rounded-xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
    <button
      onClick={() => setEditId(null)}
      className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
    >
      ✕
    </button>
    <h2 className="text-lg md:text-xl font-semibold mb-4">Chỉnh sửa Podcast</h2>
    <EditPodcastForm
      id={editId}
      onSuccess={() => {
        setEditId(null);
        fetchData();
      }}
    />
  </div>
</div>

    )}

    {/* Pagination */}
    <div className="flex justify-center items-center gap-4 pt-6">
      <button
        disabled={page === 1}
        onClick={() => setPage((prev) => prev - 1)}
        className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        ← Trang trước
      </button>
      <span className="text-sm text-gray-700">Trang {page}</span>
      <button
        disabled={page >= totalPages}
        onClick={() => setPage((prev) => prev + 1)}
        className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        Trang sau →
      </button>
    </div>

    <ToastContainer />
  </div>
);

}
