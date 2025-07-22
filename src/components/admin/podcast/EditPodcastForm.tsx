import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  id: string;
  onSuccess?: () => void;
}

const API = "https://podcastserver-production.up.railway.app";

export default function EditPodcastForm({ id, onSuccess }: Props) {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    tieu_de: "",
    mo_ta: "",
    the_tag: "",
    danh_muc_id: "",
    trang_thai: "Tắt",
    hinh_anh_dai_dien: null as File | null,
  });

  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${API}/api/categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch(() => {
        toast.error("Không lấy được danh mục");
      });
  }, []);

  // Fetch podcast details
  useEffect(() => {
    axios
      .get(`${API}/api/podcasts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data;
        setForm({
          tieu_de: data.tieu_de || "",
          mo_ta: data.mo_ta || "",
          the_tag: data.the_tag || "",
          danh_muc_id: data.danh_muc?.id || "",
          trang_thai: data.trang_thai || "Tắt",
          hinh_anh_dai_dien: null,
        });
      })
      .catch(() => {
        toast.error("Không thể tải chi tiết podcast");
      });
  }, [id]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, hinh_anh_dai_dien: file }));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "hinh_anh_dai_dien" && value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    try {
      await axios.put(`${API}/api/admin/podcasts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Cập nhật podcast thành công");
      onSuccess?.();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Lỗi khi cập nhật podcast");
    }
  };

  return (
       <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 border rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Chỉnh sửa Podcast</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Tiêu đề</label>
        <input
          type="text"
          name="tieu_de"
          value={form.tieu_de}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mô tả</label>
        <textarea
          name="mo_ta"
          value={form.mo_ta}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Tags (cách nhau bằng dấu phẩy)</label>
        <input
          type="text"
          name="the_tag"
          value={form.the_tag}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Danh mục</label>
        <select
          name="danh_muc_id"
          value={form.danh_muc_id}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.ten_danh_muc}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Trạng thái</label>
        <select
          name="trang_thai"
          value={form.trang_thai}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Bật">Bật</option>
          <option value="Tắt">Tắt</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Ảnh đại diện (tuỳ chọn nếu muốn thay)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Cập nhật
      </button>
    </form>   
  );
}
