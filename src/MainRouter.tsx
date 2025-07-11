import { Routes, Route } from 'react-router-dom'
import Home from './components/dangnhap'
import SidebarLayout from './components/admin/SidebarLayout'
import ListPodcast from './components/admin/ListPodcast'

import AdminLogin from './components/AdminLogin'
function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<AdminLogin />} />

      <Route path="/admin" element={<SidebarLayout />}>
        <Route index element={<div>Trang chủ sinh viên</div>}/>
        <Route path='listpodcast' element={<ListPodcast />} />
      </Route>
    </Routes>
  )
}
export default App
