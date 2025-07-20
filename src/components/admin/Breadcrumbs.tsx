import { useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const breadcrumbMap: Record<string, string> = {
    '': 'Trang chủ',
    'admin': 'Trang quản trị',
    'tailieu': 'Quản lý tài liệu',
    'qltailieu': 'Danh sách tài liệu',
    'tailentailieu': 'Tải lên tài liệu',
    'uploaddocument': 'Tải lên tài liệu',
    'qlpodcast': 'Quản lý podcast',
    'thempodcast': 'Thêm podcast',
    'UploadPodcast':'Tải lên podcast'
  };

  return (
    <div className="text-sm breadcrumbs text-gray-600 mb-2">
      <ul className="flex space-x-2">
        {segments.map((segment, index) => {
          const url = "/" + segments.slice(0, index + 1).join("/");
          const label = breadcrumbMap[segment.toLowerCase()] || segment;

          return (
            <li key={url} className="flex items-center space-x-1">
              {index > 0 && <span>/</span>}
              <a href={url} className="hover:underline capitalize">{label}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
