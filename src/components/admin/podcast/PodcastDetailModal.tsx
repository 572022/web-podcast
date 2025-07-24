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
  <div className="bg-white rounded-xl shadow-2xl max-w-2xl relative p-5 max-h-[90vh] overflow-y-auto w-[90vh] ">
    <button 
      onClick={onClose}
      title="Đóng"
      className="absolute top-5 right-5 text-4xl text-gray-600 
            hover:text-red-500 hover:scale-110
            transition-transform duration-200 ease-in-out
            bg-transparent border-none p-0 cursor-pointer focus:outline-none"
    >
      &times;
    </button>
<div className="text-center mb-3 pb-1  ">
  <h2 className="text-3xl font-bold text-[#31434f] tracking-wide inline-block border-b-2 border-[#31434f]">
    {podcast.tieu_de}
  </h2>
</div>
    <img
      src={podcast.hinh_anh_dai_dien || '/placeholder.jpg'}
      alt="Ảnh đại diện"
      className="w-full h-56 object-cover rounded-lg mb-4 border border-gray-200"
    />

    <div className="space-y-3 text-sm text-gray-700 mb-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-200 pb-4">
        <div className='text-center'>
          <p className="text-gray-600 font-medium">Thời lượng:</p>
          <p className="text-gray-800 font-semibold">{formatDuration(podcast.thoi_luong_giay)}</p>
        </div>
        <div className='text-center'>
          <p className="text-gray-600 font-medium">Trạng thái:</p>
          <p className={`font-semibold ${podcast.trang_thai === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
            {podcast.trang_thai}
          </p>
        </div>
        <div className='text-center'>
          <p className="text-gray-600 font-medium">Lượt xem:</p>
          <p className="text-gray-800 font-semibold">{podcast.luot_xem}</p>
        </div>
      </div>

      <div className="pt-2 pl-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-gray-600">Tags:</span>
          {podcast.the_tag?.split(',').map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
              {tag.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="mb-2 pl-4">
      <span className="font-medium text-gray-600 mb-2">Mô tả: </span>
      <span className="text-gray-700">
       {podcast.mo_ta || 'Không có mô tả'}
      </span>
    </div>

    {podcast.duong_dan_audio && (
      <audio
        className="w-full mt-4 rounded-lg"
        controls
        src={podcast.duong_dan_audio}
      />
    )}
  </div>
</div>
  );
};

export default PodcastDetailModal;
