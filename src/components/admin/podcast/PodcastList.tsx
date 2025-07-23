import React from 'react';

interface Podcast {
  id: string;
  tieu_de: string;
  mo_ta: string;
  the_tag: string;
  trang_thai: string;
  hinh_anh_dai_dien: string;
  thoi_luong_giay: number;
  danh_muc_id: string;
}

interface PodcastListProps {
  loading: boolean;
  podcasts: Podcast[];
  fetchPodcastDetail: (id: string) => void;
  setEditId: (id: string | null) => void;
  getTenDanhMucById: (id: string) => string;
  formatDuration: (seconds: number) => string;
}

const PodcastList: React.FC<PodcastListProps> = ({
  loading,
  podcasts,
  fetchPodcastDetail,
  setEditId,
  getTenDanhMucById,
  formatDuration,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
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
    );
  }

  return (
    <div className="p-4">
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
    </div>
  );
};

export default PodcastList;
