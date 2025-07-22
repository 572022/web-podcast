import  { useEffect, useState } from 'react';
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

  const getTenDanhMucById = (id: string) => {
    const cat = categories.find((c: any) => c.id === id);
    return cat?.ten_danh_muc || 'Không rõ';
  };

const fetchData = async () => {
  try {
    setLoading(true);
    let url = '';

    if (searchQuery.trim()) {
      url = `https://podcastserver-production.up.railway.app/api/podcasts/search?q=${encodeURIComponent(
        searchQuery
      )}&page=${page}&limit=100`; 
    } else {
      url = `https://podcastserver-production.up.railway.app/api/podcasts/?page=${page}&limit=100&sort_by=date`;
    }

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let data = res.data.data || [];

    if (selectedCategory) {
      data = data.filter((item: Podcast) => item.danh_muc_id === selectedCategory);
    }

    setPodcasts(data);
    setTotalPages(1); // Tạm tắt phân trang khi lọc client
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
  }, [page, selectedCategory, searchQuery]);

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
      <div className="flex-1 p-3">
        <input
          type="text"
          placeholder=" Tìm theo tiêu đề, tag..."
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
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
  </div>
) : (
  <div className="p-3">
    {podcasts.length === 0 ? (
      <div className="text-center py-10">
        <svg
          className="mx-auto h-9 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có podcast nào</h3>
        <p className="mt-1 text-sm text-gray-500">Hãy thêm podcast mới để bắt đầu</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
  {podcasts.map((podcast) => (
    <div
      key={podcast.id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col"
    >
      <div
        className="relative cursor-pointer group"
        onClick={() => fetchPodcastDetail(podcast.id)}
      >
        <img
          src={podcast.hinh_anh_dai_dien || '/placeholder.jpg'}
          alt="Ảnh đại diện"
          className="w-full h-48 object-cover transition-transform duration-300 transform group-hover:scale-105 rounded-t-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(podcast.thoi_luong_giay)}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-gray-800 line-clamp-2" title={podcast.tieu_de}>
            {podcast.tieu_de}
          </h2>
          <span className={`px-2 py-1 text-xs rounded-full ${
            podcast.trang_thai === 'Tắt' 
              ? 'bg-red-100 text-red-900' 
              : 'bg-green-100 text-green-900'
          }`}>
            {podcast.trang_thai}
          </span>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          Danh mục: {getTenDanhMucById(podcast.danh_muc_id)}
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {podcast.the_tag && podcast.the_tag.split(',').map((tag, index) => (
            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {tag.trim()}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditId(podcast.id);
            }}
           className="w-full bg-gray-600 hover:bg-gray-900 text-white rounded-sm transition-colors"

          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
    )}
  </div>
)}

  {/* Modal chi tiết */}
  {showDetail && selectedPodcast && (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 !mt-0">
      <div className="bg-white rounded-lg shadow-md  max-w-md relative p-6 max-h-[90vh] overflow-y-auto w-[100%]">
        {/* Nút đóng */}
  <button
    onClick={() => setShowDetail(false)}
    title="Đóng"
    className="absolute top-4 right-4 text-4xl text-black 
              hover:text-red-500 hover:scale-110
              transition-transform duration-200 ease-in-out
              bg-transparent border-none p-0 cursor-pointer focus:outline-none"
  >
    &times;
  </button>

        {/* Tiêu đề */}
<h2 className="text-2xl font-bold mb-4 text-center text-gray-700 tracking-wide">
  {selectedPodcast.tieu_de}
</h2>

        {/* Ảnh đại diện */}
        <img
          src={selectedPodcast.hinh_anh_dai_dien || '/placeholder.jpg'}
          alt="Ảnh đại diện"
          className="w-full h-48 object-cover rounded-md mb-3"
        />

        {/* Thông tin chi tiết */}
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b py-2">
            <div className='text-center'>
              <p className=" text-gray-600 font-medium">Thời lượng:</p>
              <p>{formatDuration(selectedPodcast.thoi_luong_giay)}</p>
            </div>
            <div className='text-center'>
              <p className=" text-gray-600 font-medium">Trạng thái:</p>
              <p className={selectedPodcast.trang_thai === 'active' ? 'text-green-600' : 'text-amber-600'}>
                {selectedPodcast.trang_thai}
              </p>
            </div>
            <div className='text-center'>
              <p className=" text-gray-600 font-medium">Lượt xem:</p>
              <p>{selectedPodcast.luot_xem}</p>
            </div>
          </div>

          {/* Danh mục
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium text-gray-600">Danh mục:</span>
            <span>{selectedPodcast.danhmuc.ten_danh_muc}</span>

          </div> */}

          {/* Tags */}
          <div className="pt-2">
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="font-medium text-gray-600">Tags:</span>

              {selectedPodcast.the_tag?.split(',').map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Mô tả */}
        <div className="mb-4">
          <span className="font-medium text-gray-600 mb-1">Mô tả: </span>
            {selectedPodcast.mo_ta || 'Không có mô tả'}
        </div>

        {/* Audio player */}
        {selectedPodcast.duong_dan_audio && (
          <audio
            className="w-full mt-3 rounded"
            controls
            src={selectedPodcast.duong_dan_audio}
          />
        )}
      </div>
    </div>
  )}



    {/* Modal chỉnh sửa */}
    {editId && (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-auto !mt-0">

  <div className="bg-white p-4 md:p-6 rounded-xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
      <button
    onClick={() => setEditId(null)}
    title="Đóng"
    className="absolute top-4 right-7 text-4xl text-black 
              hover:text-red-500 hover:scale-110
              transition-transform duration-200 ease-in-out
              bg-transparent border-none p-0 cursor-pointer focus:outline-none"
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
