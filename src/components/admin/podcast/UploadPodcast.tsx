import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = "https://podcastserver-production.up.railway.app";

export default function UploadPodcast() {
  const [tieuDe, setTieuDe] = useState("");
  const [moTa, setMoTa] = useState("");
  const [danhMucId, setDanhMucId] = useState("");
  const [voice, setVoice] = useState("vi-VN-Chirp3-HD-Puck");
  const [speakingRate, setSpeakingRate] = useState("1.0");
  const [textFile, setTextFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/api/categories/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data.data || []);
      } catch (err) {
        toast.error("Lỗi lấy danh mục.");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!textFile || !imageFile) {
      toast.error("Vui lòng chọn file văn bản và ảnh đại diện.");
      return;
    }

    const formData = new FormData();
    formData.append("file", textFile);
    formData.append("voice", voice);
    formData.append("speaking_rate", speakingRate);
    formData.append("tieu_de", tieuDe);
    formData.append("mo_ta", moTa);
    formData.append("danh_muc_id", danhMucId);
    formData.append("hinh_anh_dai_dien", imageFile);
    formData.append("the_tag", tags);

    try {
      const res = await axios.post(`${API}/api/admin/podcasts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Tải lên podcast thành công");
      console.log(res.data);
    } catch (err: any) {
      toast.error("Tải lên thất bại: " + err?.response?.data?.error || err.message);
    }
  };

return (
  <form
    onSubmit={handleSubmit}
    className="max-w-3xl mx-auto p-6 bg-white border rounded-2xl shadow-md space-y-6"
  >
    <h1 className="text-2xl font-bold text-gray-800">Tải lên Podcast mới</h1>

    {/* Tiêu đề */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
      <input
        type="text"
        value={tieuDe}
        onChange={(e) => setTieuDe(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    {/* Mô tả */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
      <textarea
        value={moTa}
        onChange={(e) => setMoTa(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Danh mục, giọng đọc, tốc độ */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
        <select
          value={danhMucId}
          onChange={(e) => setDanhMucId(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.ten_danh_muc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Giọng đọc</label>
        <input
          type="text"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tốc độ nói</label>
        <input
          type="text"
          value={speakingRate}
          onChange={(e) => setSpeakingRate(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg"
        />
      </div>
    </div>

    {/* Tệp văn bản */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tệp văn bản (.txt)</label>
      <input
        type="file"
        accept=".txt"
        onChange={(e) => setTextFile(e.target.files?.[0] || null)}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg"
        required
      />
    </div>

    {/* Ảnh đại diện */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg"
        required
      />
    </div>

    {/* Tags */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tags (phân cách bằng dấu phẩy)</label>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="ví dụ: học tập, khoa học, công nghệ"
        className="w-full border border-gray-300 px-3 py-2 rounded-lg"
      />
    </div>

    {/* Nút tải lên */}
    <div className="pt-4">
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
      >
        Tải lên
      </button>
    </div>
  </form>
);

}
