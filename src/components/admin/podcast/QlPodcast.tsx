import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PodcastList from './PodcastList';
import EditPodcastForm from './EditPodcastForm';
import PodcastDetailModal from './PodcastDetailModal';

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
  danh_muc_id: string;
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
  const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const getTenDanhMucById = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat?.ten_danh_muc || 'Không rõ';
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        'https://podcastserver-production.up.railway.app/api/podcasts/',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: 1,
            limit: 1000,
            sort_by: 'date',
          },
        }
      );

      setAllPodcasts(res.data.data || []);
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
      toast.error('Lỗi khi tải danh mục');
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
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = allPodcasts;
    if (selectedCategory) {
      filtered = filtered.filter(p => p.danh_muc_id === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.tieu_de.toLowerCase().includes(q) || p.the_tag.toLowerCase().includes(q)
      );
    }
    setFilteredPodcasts(filtered);
    setPage(1);
  }, [allPodcasts, selectedCategory, searchQuery]);

  const paginated = filteredPodcasts.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredPodcasts.length / itemsPerPage);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý Podcast</h1>

      <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Lọc danh mục:</label>
          <select
            className="border rounded-md px-3 py-2 text-sm shadow-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tất cả</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, tag..."
            className="w-full border px-4 py-2 rounded-md shadow-sm text-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="text-green-800 rounded-lg">
        <a href="/admin/podcast/UploadPodcast" className="text-blue-600 font-medium underline">
          Tải lên podcast
        </a>
      </div>

      <PodcastList
        loading={loading}
        podcasts={paginated}
        fetchPodcastDetail={fetchPodcastDetail}
        setEditId={setEditId}
        getTenDanhMucById={getTenDanhMucById}
        formatDuration={formatDuration}
      />

      <PodcastDetailModal
        show={showDetail}
        onClose={() => setShowDetail(false)}
        podcast={selectedPodcast}
        formatDuration={formatDuration}
      />

      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-auto !mt-0">
          <div className="bg-white p-4 md:p-6 rounded-xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditId(null)}
              className="absolute top-4 right-7 text-4xl text-black hover:text-red-500 hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-700 tracking-wide">Chỉnh sửa Podcast</h2>
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

      <div className="flex justify-center items-center gap-4 pt-6 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
          className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          ← Trang trước
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-md border ${
                p === page ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(prev => prev + 1)}
          className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Trang sau →
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}
