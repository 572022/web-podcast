import { useEffect, useState } from 'react'
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;
interface NguoiDung {
  id: string;
  email: string;
  ho_ten: string;
  vai_tro: string;
}
interface TaiLieu {
  id: string;
  ten_file_goc: string;
  duong_dan_file: string;
  loai_file: string;
  kich_thuoc_file: number;
  trang_thai: string;
  ngay_tai_len: string;
  ngay_xu_ly_xong: string;
  nguoi_dung: NguoiDung;
}   
    export default function DocumentDetail() {
        const {id} = useParams();
        const [taiLieu, setTaiLieu] = useState<TaiLieu | null>(null);
        const [loading, setLoading] = useState(true);
        const [audioUrl, setAudioUrl] = useState<string | null>(null);

const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/admin/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTaiLieu(res.data.tai_lieu);
      setAudioUrl(res.data.audio_url);
    } catch (err) {
      toast.error("Lỗi khi tải chi tiết tài liệu.");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/admin/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Dữ liệu chi tiết:", res.data); // 👈 THÊM VÀO ĐÂY ĐỂ KIỂM TRA

      setTaiLieu(res.data.tai_lieu); // 👈 kiểm tra res.data có key này không?
      setAudioUrl(res.data.audio_url);
    } catch (err) {
      toast.error("Lỗi khi tải chi tiết tài liệu.");
    } finally {
      setLoading(false);
    }
  };

  fetchDetail();
}, []);

  if (loading) return <p className="p-6 text-gray-600">Đang tải chi tiết tài liệu...</p>;
  if (!taiLieu) return <p className="p-6 text-red-500">Không tìm thấy tài liệu.</p>;
  
      return (
        <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Chi tiết tài liệu</h2>
            <div>
                <p><strong>Tên file gốc:</strong> {taiLieu.ten_file_goc}</p>
                        <p><strong>Loại file:</strong> {taiLieu.loai_file.toUpperCase()}</p>
                        <p><strong>Kích thước:</strong> {(taiLieu.kich_thuoc_file / 1024).toFixed(1)} KB</p>
                        <p><strong>Trạng thái:</strong> 
                        <span className={
                            taiLieu?.trang_thai==="Hoàn thành"?" text-green-600":
                            taiLieu?.trang_thai==="Lỗi"?"text-red-600 ml-1" : "text-yellow-600 ml-1"
                        }>

                        </span>
                </p>
                 <p><strong>Ngày tải lên:</strong> {format(new Date(taiLieu.ngay_tai_len), "dd/MM/yyyy HH:mm:ss")}</p>
        <p><strong>Ngày xử lý xong:</strong> {format(new Date(taiLieu.ngay_xu_ly_xong), "dd/MM/yyyy HH:mm:ss")}</p>
        <p><strong>Người tải lên:</strong> {taiLieu.nguoi_dung.ho_ten} ({taiLieu.nguoi_dung.email})</p>

            </div>

        </div>
      )
    }
    