import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

interface UploadedFile {
  ID: string;
  TenFileGoc: string;
  DuongDanFile: string;
  LoaiFile: string;
}

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [search, setSearch] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setSuccess(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
      setSuccess(false);
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
      setSuccess(false);

      const token = localStorage.getItem("token");

      await axios.post(`${API}/api/admin/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percent);
        },
      });

      setSuccess(true);
      setFile(null);
      fetchUploadedFiles();
    } catch (err: any) {
      setError(err.response?.data?.error || "Lỗi khi tải lên tài liệu.");
    } finally {
      setUploading(false);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/admin/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUploadedFiles(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tài liệu đã tải:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/admin/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUploadedFiles();
    } catch (err) {
      console.error("Lỗi khi xóa tài liệu:", err);
    }
  };
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

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
        <label htmlFor="fileInput" className="block mt-2 text-blue-600 underline cursor-pointer">
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
      {success && <p className="text-green-600 mt-2 text-sm">Tải lên thành công!</p>}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {uploading ? "Đang tải lên..." : "Tải lên tài liệu"}
      </button>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">Danh sách tài liệu đã tải lên</h3>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm theo tên tệp..."
        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Tên tệp</th>
              <th className="p-2 border">Loại</th>
              <th className="p-2 border">Link</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(uploadedFiles) &&
              uploadedFiles
                .filter((f) =>
                  f.TenFileGoc.toLowerCase().includes(search.toLowerCase())
                )
                .map((f) => (
                  <tr key={f.ID} className="hover:bg-gray-50">
                    <td className="p-2 border">{f.TenFileGoc}</td>
                    <td className="p-2 border">{f.LoaiFile}</td>
                    <td className="p-2 border">
                      <a
                        href={f.DuongDanFile}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Xem
                      </a>
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleDelete(f.ID)}
                        className="text-red-500 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}