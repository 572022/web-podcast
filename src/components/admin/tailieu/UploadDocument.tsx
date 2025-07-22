import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Vui lòng chọn một tệp tài liệu.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (fileType) {
      formData.append("fileType", fileType);
    }

    try {
      setUploading(true);
      setProgress(0);
      setError("");

      const token = localStorage.getItem("token");

      await axios.post(`${API}/api/admin/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percent);
        },
      });

      // ✅ Thông báo toast
      toast.success("Tải lên thành công. Bạn có thể theo dõi tiến trình ở Quản lý Tài liệu");

      // Reset form
      setFile(null);
      setFileType("");
      setProgress(0);
    } catch (err: any) {
      setError(err.response?.data?.error || "Lỗi khi tải lên tài liệu.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Tải lên tài liệu</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Chọn loại file (tùy chọn):</label>
        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">-- Không chọn --</option>
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="txt">TXT</option>
          <option value="xlsx">XLSX</option>
        </select>
      </div>

      <div
        className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:border-blue-400"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {file ? (
          <p className="text-gray-700">Đã chọn: {file.name}</p>
        ) : (
          <p className="text-gray-500">Kéo và thả tệp vào đây hoặc chọn từ máy</p>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="block mt-2 text-blue-600 underline cursor-pointer"
        >
          Chọn tệp từ máy tính
        </label>
      </div>

      {progress > 0 && uploading && (
        <div className="mt-4">
          <div className="h-3 w-full bg-gray-200 rounded-full">
            <div
              className="h-3 bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
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
        {uploading ? "Đang tải lên..." : "Tải lên tài liệu"}
      </button>
    </div>
  );
}
