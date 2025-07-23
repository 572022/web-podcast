// components/admin/PodcastDetailModal.tsx
import React from 'react';

interface PodcastDetail {
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
  danhmuc?: {
    ten_danh_muc: string;
  };
  tailieu?: {
    ten_file_goc: string;
    duong_dan_file: string;
  };
}

interface Props {
  show: boolean;
  onClose: () => void;
  podcast: PodcastDetail | null;
  formatDuration: (seconds: number) => string;
}

const PodcastDetailModal: React.FC<Props> = ({ show, onClose, podcast, formatDuration }) => {
  if (!show || !podcast) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 !mt-0">
      <div className="bg-white rounded-lg shadow-md max-w-md relative p-6 max-h-[90vh] overflow-y-auto w-full">
        <button
          onClick={onClose}
          title="Đóng"
          className="absolute top-4 right-4 text-4xl text-black 
                hover:text-red-500 hover:scale-110
                transition-transform duration-200 ease-in-out
                bg-transparent border-none p-0 cursor-pointer focus:outline-none"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700 tracking-wide">
          {podcast.tieu_de}
        </h2>

        <img
          src={podcast.hinh_anh_dai_dien || '/placeholder.jpg'}
          alt="Ảnh đại diện"
          className="w-full h-48 object-cover rounded-md mb-3"
        />

        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b py-2">
            <div className='text-center'>
              <p className="text-gray-600 font-medium">Thời lượng:</p>
              <p>{formatDuration(podcast.thoi_luong_giay)}</p>
            </div>
            <div className='text-center'>
              <p className="text-gray-600 font-medium">Trạng thái:</p>
              <p className={podcast.trang_thai === 'active' ? 'text-green-600' : 'text-amber-600'}>
                {podcast.trang_thai}
              </p>
            </div>
            <div className='text-center'>
              <p className="text-gray-600 font-medium">Lượt xem:</p>
              <p>{podcast.luot_xem}</p>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="font-medium text-gray-600">Tags:</span>
              {podcast.the_tag?.split(',').map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <span className="font-medium text-gray-600 mb-1">Mô tả: </span>
          {podcast.mo_ta || 'Không có mô tả'}
        </div>

        {podcast.duong_dan_audio && (
          <audio
            className="w-full mt-3 rounded"
            controls
            src={podcast.duong_dan_audio}
          />
        )}
      </div>
    </div>
  );
};

export default PodcastDetailModal;
