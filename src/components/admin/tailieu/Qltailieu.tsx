import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

interface TaiLieu {
  id: string;
  ten_file_goc: string;
  trang_thai: string;
  ngay_tai_len: string;
}

export default function Qltailieu() {
  const [documents, setDocuments] = useState<TaiLieu[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token")?.replace("Bearer ", "");
      const res = await axios.get(`${API}/api/admin/documents`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, limit: 1000 }, // Lấy tất cả dữ liệu
      });
      setDocuments(res.data.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách tài liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token")?.replace("Bearer ", "");
    if (!token) return;

    const ws = new WebSocket(
      `wss://podcastserver-production.up.railway.app/ws/status?token=${token}`
    );

    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "document_list_changed") {
          console.log("Dữ liệu thay đổi, làm mới...");
          fetchDocuments();
        }
      } catch (err) {
        console.warn("Không phải JSON:", event.data);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket disconnected");
    return () => ws.close();
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.ten_file_goc
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        !statusFilter || doc.trang_thai === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [documents, search, statusFilter]);

  const totalPages = Math.ceil(filteredDocuments.length / limit);
  const paginatedDocuments = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredDocuments.slice(start, start + limit);
  }, [filteredDocuments, page, limit]);

  const renderStatus = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return (
          <span className="text-green-600 font-medium">
            {status} <span className="text-xs">(Đã tạo podcast)</span>
          </span>
        );
      case "Lỗi":
      case "Lỗi khi tạo audio":
        return <span className="text-red-500 font-medium"> {status}</span>;
      case "Đã trích xuất":
        return <span className="text-blue-500 font-medium"> {status}</span>;
      case "Đã tải lên":
        return <span className="text-yellow-500 font-medium"> {status}</span>;
      case "Đang tạo audio...":
        return <span className="text-purple-500 font-medium">{status}</span>;
      case "Đang tải lên tài liệu...":
        return <span className="text-orange-500 font-medium"> {status}</span>;
      default:
        return <span className="text-gray-500 font-medium">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Quản lý tài liệu</h2>

      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên file..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/2"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-1/3"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đã tải lên">Đã tải lên</option>
          <option value="Đã trích xuất">Đã trích xuất</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Lỗi">Lỗi</option>
          <option value="Đang tạo audio...">Đang tạo audio...</option>
          <option value="Đang tải lên tài liệu...">Đang tải lên tài liệu...</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600">Đang tải danh sách...</p>
      ) : paginatedDocuments.length === 0 ? (
        <p className="text-gray-500">Không có tài liệu nào phù hợp.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Tên file</th>
                <th className="px-4 py-2">Ngày tải lên</th>
                <th className="px-4 py-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDocuments.map((doc) => (
                <tr key={doc.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{doc.ten_file_goc}</td>
                  <td className="px-4 py-2">
                    {format(new Date(doc.ngay_tai_len), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-2">{renderStatus(doc.trang_thai)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded bg-gray-100"
            disabled={page === 1}
          >
            Trang trước
          </button>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border rounded bg-gray-100"
            disabled={page === totalPages}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}
