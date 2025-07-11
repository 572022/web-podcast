import { Outlet, NavLink } from "react-router-dom";
import React, { useState } from "react";
import {
  FiHome,
  FiBookOpen,
  FiHeadphones,
  FiLayers,
  FiBarChart2,
} from "react-icons/fi";

export default function SidebarLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/AdminLogin";
  };

  const [showSidebar, setShowSidebar] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:bg-slate-600 p-2 rounded-md flex items-center gap-2 ${
      isActive ? "bg-slate-700 font-semibold" : ""
    }`;

  return (
    <>
      {/* Header */}
      <header className="bg-gray-900 w-full fixed top-0 left-0 z-40 text-white flex justify-between items-center px-4 h-14 shadow-md  border-b-[1px] border-gray-100">
        <div className="text-lg font-bold">Trang quản trị Podcast</div>

        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="md:hidden block focus:outline-none"
        >
          ☰
        </button>

        <div className="hidden md:flex items-center gap-4">
          <span>
            Xin chào: <strong>{user.hoTen}</strong>
          </span>
          <button onClick={handleLogout} className="text-red-500">
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
            <NavLink to="/admin/Listpodcast" className={linkClass}>
              <FiHome className="inline m-0" /> Dashboard
            </NavLink>

            <NavLink
              to="/admin/danh-sach-tai-lieu"
              className={linkClass}
            >
              <FiBookOpen className="text-lg" /> Quản lý tài liệu
            </NavLink>

            <NavLink
              to="/admin/danh-sach-podcast"
              className={linkClass}
            >
              <FiHeadphones className="text-lg" /> Quản lý Podcast
            </NavLink>

            <NavLink
              to="/admin/danh-sach-danh-muc"
              className={linkClass}
            >
              <FiLayers className="text-lg" /> Quản lý danh mục
            </NavLink>

            <NavLink
              to="/admin/analytics"
              className={linkClass}
            >
              <FiBarChart2 className="text-lg" /> Analytics chi tiết
            </NavLink>

            <div className="md:hidden block mt-4">
              <button onClick={handleLogout} className="text-red-400">
                Đăng xuất
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-2 mt-2 overflow-y-auto w-full">
          <div className="text-sm breadcrumbs text-gray-600">
            <ul className="flex space-x-2">
              <li>
                <a href="/" className="hover:underline">
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
