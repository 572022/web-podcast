import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiBookOpen,
  FiHeadphones,
  FiLayers,
  FiBarChart2,
   FiChevronDown,
  FiChevronRight,
  FiFilePlus,
  FiList,
  FiFileText
}  
 from "react-icons/fi";
import Breadcrumbs from "./Breadcrumbs";
export default function SidebarLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSubMenuPodcasts, setShowSubMenuPodcasts] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  console.log(user);

  const [showSidebar, setShowSidebar] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:bg-slate-600 text-white p-2 rounded-md flex items-center gap-2 ${
      isActive ? "bg-slate-700 font-semibold" : ""
    }`;

  return (
   <>
  {/* Header */}
  <header className="bg-gray-900 w-full fixed top-0 left-0 z-40 text-white flex justify-between items-center px-4 h-14 shadow-md border-b-[1px] border-gray-100">
    <div className="text-lg font-bold">Trang quản trị Podcast</div>

    <button
      onClick={() => setShowSidebar(!showSidebar)}
      className="md:hidden block focus:outline-none"
    >
      ☰
    </button>

    <div className="hidden md:flex items-center gap-4">
      <span>
        Xin chào: <strong>{user.ho_ten}</strong>
      </span>
      <button onClick={handleLogout} className="text-red-500">
        Đăng xuất
      </button>
    </div>
  </header>

  <div className="flex pt-14 min-h-screen">
    {/* Sidebar */}
    <aside
      className={`bg-gray-900 text-white p-4 md:w-[17%] w-64 fixed top-14 left-0 bottom-0 z-30 transform transition-transform duration-300 ease-in-out
      ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
    >
      <nav className="flex flex-col gap-4">
        {/* Dashboard */}
        <NavLink to="/admin/dashboard" className={linkClass}>
          <FiHome className="inline m-0" /> Dashboard
        </NavLink>
        <NavLink to="/admin/tailieu/Qltailieu" className={linkClass}>
          <FiList className="text-base" />  Quản lý tài liệu
        </NavLink>


        {/* Quản lý podcast (collapse menu) */}
        <div>
          <div
            onClick={() => setShowSubMenuPodcasts(!showSubMenuPodcasts)}
            className={`cursor-pointer p-2 rounded-md flex items-center justify-between gap-2 hover:bg-slate-600 transition-colors duration-200 ${
              showSubMenuPodcasts ? "bg-slate-700 font-semibold" : ""
            }`}
          >
            <span className="flex items-center gap-2 text-white">
              <FiBookOpen className="text-lg" /> Quản lý Podcast
            </span>
            {showSubMenuPodcasts ? <FiChevronDown /> : <FiChevronRight />}
          </div>

          {showSubMenuPodcasts && (
            <div className="ml-4 mt-2 flex flex-col gap-2 text-sm">
              <NavLink to="/admin/podcast/QlPodcast" className={linkClass}>
                <FiList className="text-base" /> Danh sách Podcast
              </NavLink>
              <NavLink to="/admin/podcast/UploadPodcast" className={linkClass}>
                <FiFilePlus className="text-base" /> Tải lên podcast
              </NavLink>
            </div>
          )}
        </div>

        {/* Danh mục & Analytics */}
        <NavLink to="/admin/category" className={linkClass}>
          <FiLayers className="text-lg" /> Quản lý danh mục
        </NavLink>
        <NavLink to="/admin/analytics" className={linkClass}>
          <FiBarChart2 className="text-lg" /> Analytics chi tiết
        </NavLink>

        {/* Logout button cho mobile */}
        <div className="md:hidden block mt-4">
          <button onClick={handleLogout} className="text-red-400">
            Đăng xuất
          </button>
        </div>
      </nav>
    </aside>

    {/* Main content */}
    <main className="flex-1 p-2 mt-2 overflow-y-auto w-full">
      <Breadcrumbs />
      <Outlet />
    </main>
  </div>
</>

  );
}