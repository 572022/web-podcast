import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

export default function UploadPodcast() {
  const [textFile, setTextFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tieuDe, setTieuDe] = useState("");
  const [moTa, setMoTa] = useState("");
  const [tags, setTags] = useState("");
  const [voice, setVoice] = useState("vi-VN-Chirp3-HD-Puck");
  const [speakingRate, setSpeakingRate] = useState("1.0");
  const [danhMucId, setDanhMucId] = useState("");

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleTextFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTextFile(e.target.files[0]);
      setError("");
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setError("");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setTextFile(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!textFile || !imageFile || !tieuDe || !moTa || !tags || !danhMucId) {
      setError("Vui lòng điền đầy đủ thông tin và chọn cả 2 file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", textFile);
    formData.append("hinh_anh_dai_dien", imageFile);
    formData.append("tieu_de", tieuDe);
    formData.append("mo_ta", moTa);
    formData.append("the_tag", tags);
    formData.append("voice", voice);
    formData.append("speaking_rate", speakingRate);
    formData.append("danh_muc_id", danhMucId);

    try {
      setUploading(true);
      setProgress(0);
      setError("");

      const token = localStorage.getItem("token");

      await axios.post(`${API}/api/admin/podcasts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / (e.total || 1));
          setProgress(percent);
        },
      });

      toast.success("Tạo podcast thành công!");
      setTextFile(null);
      setImageFile(null);
      setTieuDe("");
      setMoTa("");
      setTags("");
      setVoice("vi-VN-Chirp3-HD-Puck");
      setSpeakingRate("1.0");
      setDanhMucId("");
      setProgress(0);
    } catch (err: any) {
      setError(err.response?.data?.error || "Lỗi khi tạo podcast.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600"> Tải lên Podcast</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Tiêu đề podcast:</label>
        <input
          type="text"
          value={tieuDe}
          onChange={(e) => setTieuDe(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mô tả:</label>
        <textarea
          value={moTa}
          onChange={(e) => setMoTa(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={3}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Thẻ (cách nhau bằng dấu phẩy):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">ID Danh mục:</label>
          <input
            type="text"
            value={danhMucId}
            onChange={(e) => setDanhMucId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Giọng đọc:</label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="vi-VN-Chirp3-HD-Puck">vi-VN-Chirp3-HD-Puck</option>
            <option value="vi-VN-Nam">vi-VN-Nam</option>
            <option value="vi-VN-Nu">vi-VN-Nu</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Tốc độ nói:</label>
          <input
            type="number"
            value={speakingRate}
            onChange={(e) => setSpeakingRate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            step="0.1"
            min="0.5"
            max="2.0"
          />
        </div>
      </div>

      <div
        className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:border-blue-400 mb-4"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {textFile ? (
          <p className="text-gray-700">📄 Đã chọn: {textFile.name}</p>
        ) : (
          <p className="text-gray-500">Kéo thả tệp văn bản vào đây hoặc chọn từ máy</p>
        )}
        <input
          type="file"
          accept=".txt,.docx"
          onChange={handleTextFile}
          className="hidden"
          id="textFileInput"
        />
        <label htmlFor="textFileInput" className="block mt-2 text-blue-600 underline cursor-pointer">
          Chọn file văn bản
        </label>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Ảnh đại diện:</label>
        <input type="file" accept="image/*" onChange={handleImageFile} className="w-full" />
      </div>

      {progress > 0 && uploading && (
        <div className="mt-4">
          <div className="h-3 w-full bg-gray-200 rounded-full">
            <div className="h-3 bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{progress}%</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {uploading ? "Đang tải lên..." : " Tải lên podcast"}
      </button>
    </div>
  );
}
