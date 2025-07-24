interface Podcast {
  id: string;
  tieu_de: string;
  mo_ta?: string;
  ngay_tao_ra: string;
  luot_xem: number;
  duong_dan_audio: string;
}

interface ActivitiesProps {
  activities: Podcast[];
}

export default function Activities({ activities }: ActivitiesProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Không xác định' : d.toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        🎧 <span>Hoạt Động Gần Đây</span>
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-orange-100 to-red-100 uppercase text-xs font-bold text-gray-600 tracking-wider">
            <tr>
              <th className="px-5 py-4 text-left">🎧 Tiêu đề</th>
              <th className="px-5 py-4 text-left">📝 Mô tả</th>
              <th className="px-5 py-4 text-left">📅 Ngày tạo</th>
              <th className="px-5 py-4 text-center">👁️ Lượt xem</th>
              <th className="px-5 py-4 text-left">🔗 Audio</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`transition-all duration-200 hover:bg-green-50 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-5 py-4 font-medium whitespace-nowrap">{item.tieu_de}</td>
                  <td className="px-5 py-4 text-gray-600">
                    {item.mo_ta || <span className="text-gray-400 italic">Không có mô tả</span>}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">{formatDate(item.ngay_tao_ra)}</td>
                  <td className="px-5 py-4 text-center">{item.luot_xem}</td>
                  <td className="px-5 py-4">
                    {item.duong_dan_audio ? (
                      <a
                        href={item.duong_dan_audio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-green-800 font-medium transition-colors"
                      >
                        ▶️ Click Ngay
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">Chưa có audio</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-500">
                  Không có podcast nào để hiển thị.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
