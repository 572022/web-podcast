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
        console.log("Podcast data:", data);
        setForm({
          tieu_de: data.tieu_de || "",
          mo_ta: data.mo_ta || "",
          the_tag: data.the_tag || "",
          danh_muc_id: data.danh_muc_id || "", // ✅ Sửa tại đây
          trang_thai: data.trang_thai || "Tắt",
          hinh_anh_dai_dien: null,
        });
      })
      .catch(() => {
        toast.error("Không thể tải chi tiết podcast");
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, hinh_anh_dai_dien: file }));
  };

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
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-4 bg-white rounded-2xl shadow-lg space-y-6 border border-[#7f8e9544]"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
          <input
            type="text"
            name="tieu_de"
            value={form.tieu_de}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
          <textarea
            name="mo_ta"
            value={form.mo_ta}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (cách nhau bằng dấu phẩy)</label>
          <input
            type="text"
            name="the_tag"
            value={form.the_tag}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
            <select
              name="danh_muc_id"
              value={form.danh_muc_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              name="trang_thai"
              value={form.trang_thai}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
            >
              <option value="Bật">Bật</option>
              <option value="Tắt">Tắt</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-lg cursor-pointer transition-all hover:bg-indigo-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                <svg className="w-8 h-8 mb-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click để upload</span> hoặc kéo thả
                </p>
                <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Cập nhật Podcast
      </button>
    </form>
  );
}
