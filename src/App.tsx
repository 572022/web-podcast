// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/admin/Dashboard'
import SidebarLayout from './components/admin/SidebarLayout'
import ListPodcast from './components/admin/ListPodcast'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<SidebarLayout />} />
        <Route path="/admin" element={<SidebarLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='/admin/listpodcast' element={<ListPodcast />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
