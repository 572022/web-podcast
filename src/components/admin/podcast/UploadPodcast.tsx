import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API = "https://podcastserver-production.up.railway.app";

interface Category {
  id: string;
  ten_danh_muc: string;
}

const voiceOptions = [
  { value: "vi-VN-Chirp3-HD-Puck", label: "Chirp3 HD - Puck" },
  { value: "vi-VN-Wavenet-A", label: "Wavenet A (Nữ)" },
  { value: "vi-VN-Neural2-A", label: "Neural2 A (Nữ)" },
  { value: "vi-VN-Standard-B", label: "Standard B (Nam)" },
];

export default function UploadPodcast() {
  const [tieuDe, setTieuDe] = useState("");
  const [moTa, setMoTa] = useState("");
  const [danhMucId, setDanhMucId] = useState("");
  const [voice, setVoice] = useState(voiceOptions[0].value);
  const [speakingRate, setSpeakingRate] = useState("1.0");
  const [textFile, setTextFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const token = localStorage.getItem("token");
  const fileTextRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/api/categories/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Lỗi lấy danh mục.");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!textFile || !imageFile) {
      alert("Vui lòng chọn file văn bản và ảnh đại diện.");
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
      setUploading(true);
      setProgress(0);
      setError(null);
      setSuccess(false);

      await axios.post(`${API}/api/admin/podcasts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / (event.total || 1));
          setProgress(percent);
        },
      });

      setSuccess(true);
      setTieuDe("");
      setMoTa("");
      setDanhMucId("");
      setVoice(voiceOptions[0].value);
      setSpeakingRate("1.0");
      setTags("");
      setTextFile(null);
      setImageFile(null);
      if (fileTextRef.current) fileTextRef.current.value = "";
      if (imageRef.current) imageRef.current.value = "";
    } catch (err: any) {
      console.error("Tải lên thất bại:", err?.response?.data?.error || err.message);
      setError(err?.response?.data?.error || "Đã xảy ra lỗi không xác định.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white border rounded-2xl shadow-md space-y-6"
    >
      <h1 className="text-2xl font-bold text-blue-800 text-center">Tải lên Podcast mới</h1>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
        <input
          type="text"
          value={tieuDe}
          onChange={(e) => setTieuDe(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
        <textarea
          value={moTa}
          onChange={(e) => setMoTa(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <select
            value={danhMucId}
            onChange={(e) => setDanhMucId(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.ten_danh_muc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giọng đọc</label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          >
            {voiceOptions.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tốc độ nói</label>
          <input
            type="number"
            step="0.1"
            value={speakingRate}
            onChange={(e) => setSpeakingRate(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tệp văn bản (.txt)</label>
        <input
          type="file"
          accept=".txt"
          ref={fileTextRef}
          onChange={(e) => setTextFile(e.target.files?.[0] || null)}
          className="w-full border px-3 py-2 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
        <input
          type="file"
          accept="image/*"
          ref={imageRef}
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full border px-3 py-2 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (phân cách bằng dấu phẩy)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="ví dụ: học tập, khoa học, công nghệ"
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-4 relative">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
          <span className="absolute inset-0 text-center text-sm text-white font-medium leading-4">
            {progress}%
          </span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm mt-2">
           Tải lên podcast thành công!{" "}
          <a href="/admin/tailieu/Qltailieu" className="underline text-blue-600 font-medium">
            Đến Quản lý tài liệu
          </a>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm mt-2">
           {error}
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg w-full"
        >
          {uploading ? "Đang tải lên..." : "Tải lên"}
        </button>
      </div>
    </form>
  );
}
