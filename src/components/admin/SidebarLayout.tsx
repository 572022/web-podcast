import { Outlet, Link } from "react-router-dom"

export default function SidebarLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4 fixed top-0 left-0 bottom-0">
        <h1 className="text-xl font-bold mb-6">Podcast</h1>
        <nav className="flex flex-col gap-4">
          <Link to="/giangvien/MonhocManager" className="hover:bg-slate-600 p-2 rounded-md">
            Quản lý môn học
          </Link>
          <Link to="/giangvien/dsmongiangvien" className="hover:bg-slate-600 p-2 rounded-md">
            Danh sách môn
          </Link>
        
        </nav>

        <div className="mt-auto text-sm border-t border-green-300 pt-3  ">         
          <p className="mb-2">
            Xin chào: <span className="font-semibold">{user.hoTen || "Người dùng"}</span>
          </p>
         <button
            onClick={handleLogout}
            className="hover:text- hover:bg-slate-600 p-2 rounded-md cursor-pointer text-left w-[100%]"
          >
            Đăng xuất
          </button>

        </div>
      </aside>

      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
