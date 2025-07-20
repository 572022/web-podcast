// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/admin/Dashboard'
import SidebarLayout from './components/admin/SidebarLayout'
// import ListPodcast from './components/admin/ListPodcast'

import Qltailieu from './components/admin/tailieu/Qltailieu';
// import Tailentailieu from './components/admin/tailieu/Tailentailieu';
import UploadDocument from './components/admin/tailieu/UploadDocument';
import DocumentDetail from './components/admin/tailieu/DocumentDetail';
import QlPodcast from './components/admin/podcast/QlPodcast';
import UploadPodcast from './components/admin/podcast/UploadPodcast';
import Breadcrumbs from './components/admin/Breadcrumbs';
import { useImperativeHandle } from 'react';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/" element={<SidebarLayout />} />
        <Route path="/admin" element={<SidebarLayout />}>
          <Route index element={<Dashboard />} />
          {/* <Route path='/admin/listpodcast' element={<ListPodcast />} /> */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tailieu/Qltailieu" element={<Qltailieu />} />
          {/* <Route path="/admin/tailieu/Tailentailieu" element={<Tailentailieu />} /> */}
          <Route path="/admin/tailieu/UploadDocument" element={<UploadDocument />} />
          {/* <Route path="/admin/tailieu/:id" element={<DocumentDetail />} /> */}

          <Route path="/admin/podcast/QlPodcast" element={<QlPodcast />} />
          <Route path='/admin/podcast/UploadPodcast' element={<UploadPodcast/>} />
          <Route path='/admin/Breadcrumbs' element={<Breadcrumbs />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
