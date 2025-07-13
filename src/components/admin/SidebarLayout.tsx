import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiBookOpen,
  FiHeadphones,
  FiLayers,
  FiBarChart2,
  FiFilePlus,
  FiList,
  FiFileText,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

export default function SidebarLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const [showSidebar, setShowSidebar] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(true);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:bg-slate-600 p-2 rounded-md flex items-center gap-2 text-white transition-colors duration-200 ${
      isActive ? "bg-slate-700 font-semibold" : ""
    }`;

  return (
    <>
      {/* Header */}
      <header className="bg-gray-900 w-full fixed top-0 left-0 z-40 text-white flex justify-between items-center px-4 h-14 shadow-md border-b border-gray-700">
        <div className="text-lg font-bold">Trang quản trị Podcast</div>

        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="md:hidden block focus:outline-none text-xl"
        >
          ☰
        </button>

        <div className="hidden md:flex items-center gap-4">
          <span>
            Xin chào: <strong>{user.ho_ten}</strong>
          </span>
          <button onClick={handleLogout} className="text-red-500 hover:underline">
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="flex pt-14 min-h-screen">
        <aside
          className={`bg-gray-900 text-white p-4 md:w-[17%] w-64 fixed top-14 left-0 bottom-0 z-30 transform transition-transform duration-300 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
        >
          <nav className="flex flex-col gap-4">
            <NavLink to="/admin/dashboard" className={linkClass}>
              <FiHome className="inline m-0" /> Dashboard
            </NavLink>

            {/* Quản lý tài liệu */}
            <div>
              <div
                onClick={() => setShowSubMenu(!showSubMenu)}
                className={`cursor-pointer p-2 rounded-md flex items-center justify-between gap-2 hover:bg-slate-600 transition-colors duration-200 ${
                  showSubMenu ? "bg-slate-700 font-semibold" : ""
                }`}
              >
                <span className="flex items-center gap-2 text-white">
                  <FiBookOpen className="text-lg" /> Quản lý tài liệu
                </span>
                {showSubMenu ? <FiChevronDown /> : <FiChevronRight />}
              </div>

              {showSubMenu && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  <NavLink to="/admin/upload" className={linkClass}>
                    <FiFilePlus className="text-base" /> Upload tài liệu
                  </NavLink>
                  <NavLink to="/admin/danh-sach-tai-lieu" className={linkClass}>
                    <FiList className="text-base" /> Danh sách tài liệu
                  </NavLink>
                  <NavLink to="/admin/chi-tiet-tai-lieu" className={linkClass}>
                    <FiFileText className="text-base" /> Xem chi tiết tài liệu
                  </NavLink>
                </div>
              )}
            </div>

            {/* Các mục khác */}
            <NavLink to="/admin/danh-sach-podcast" className={linkClass}>
              <FiHeadphones className="text-lg" /> Quản lý Podcast
            </NavLink>

            <NavLink to="/admin/danh-sach-danh-muc" className={linkClass}>
              <FiLayers className="text-lg" /> Quản lý danh mục
            </NavLink>

            <NavLink to="/admin/analytics" className={linkClass}>
              <FiBarChart2 className="text-lg" /> Analytics chi tiết
            </NavLink>

            <div className="md:hidden block mt-4">
              <button onClick={handleLogout} className="text-red-400 hover:underline">
                Đăng xuất
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 mt-2 overflow-y-auto w-full bg-gray-50">
          <div className="text-sm breadcrumbs text-gray-600">
            <ul className="flex space-x-2">
              <li>
                <a href="/pages/home" className="hover:underline">
                  Trang chủ
                </a>
              </li>
              <li>/</li>
              <li>
                <a href="/admin" className="hover:underline">
                  Quản trị
                </a>
              </li>
              <li>/</li>
              <li className="text-blue-600 font-semibold">Thêm Podcast</li>
            </ul>
          </div>

          <Outlet />
        </main>
      </div>
    </>
  );
}
