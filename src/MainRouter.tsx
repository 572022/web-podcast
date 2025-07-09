import { Routes, Route } from 'react-router-dom'
import Home from './components/dangnhap'
import SidebarLayout from './components/admin/SidebarLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/admin" element={<SidebarLayout />}>
        <Route index element={<div>Trang chủ sinh viên</div>} >
        
        </Route>
      </Route>
    </Routes>
  )
}
export default App
