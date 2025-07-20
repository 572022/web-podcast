import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

export default function EditPodcast() {
  const { id } = useParams(); // /admin/podcasts/edit/:id
  const [loading, setLoading] = useState(true);
  const [tieuDe, setTieuDe] = useState("");
  const [moTa, setMoTa] = useState("");
  const [tags, setTags] = useState("");
  const [danhMucId, setDanhMucId] = useState("");
  const [trangThai, setTrangThai] = useState("Tắt");
  const [hinhAnh, setHinhAnh] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/admin/podcasts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const p = res.data.podcast;
        setTieuDe(p.tieu_de || "");
        setMoTa(p.mo_ta || "");
        setTags(p.the_tag || "");
        setDanhMucId(p.danh_muc_id || "");
        setTrangThai(p.trang_thai || "Tắt");
      } catch (err) {
        toast.error("Không thể tải dữ liệu podcast");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  const handleUpdate = async () => {
    const formData = new FormData();
    if (tieuDe) formData.append("tieu_de", tieuDe);
    if (moTa) formData.append("mo_ta", moTa);
    if (tags) formData.append("the_tag", tags);
    if (danhMucId) formData.append("danh_muc_id", danhMucId);
    if (trangThai) formData.append("trang_thai", trangThai);
    if (hinhAnh) formData.append("hinh_anh_dai_dien", hinhAnh);

    try {
      const token = localStorage.getItem("token");

      await axios.put(`${API}/api/admin/podcasts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(" Cập nhật podcast thành công");
    } catch (err: any) {
      const msg =
        err.response?.data?.error || "Lỗi khi cập nhật podcast";
      setError(msg);
      toast.error(msg);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Đang tải...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">✏️ Chỉnh sửa Podcast</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Tiêu đề:</label>
        <input
          type="text"
          value={tieuDe}
          onChange={(e) => setTieuDe(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
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

      <div className="mb-4">
        <label className="block font-medium mb-1">Thẻ (tags):</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">ID Danh mục:</label>
        <input
          type="text"
          value={danhMucId}
          onChange={(e) => setDanhMucId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Trạng thái:</label>
        <select
          value={trangThai}
          onChange={(e) => setTrangThai(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Tắt">Tắt</option>
          <option value="Bật">Bật</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Ảnh đại diện (nếu muốn đổi):</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setHinhAnh(e.target.files?.[0] || null)
          }
        />
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleUpdate}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        💾 Lưu thay đổi
      </button>
    </div>
  );
}
