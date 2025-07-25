// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/admin/Dashboard'
import SidebarLayout from './components/admin/SidebarLayout'
import Analytics from './components/admin/Analytics'

import Qltailieu from './components/admin/tailieu/Qltailieu';
// import Tailentailieu from './components/admin/tailieu/Tailentailieu';
import UploadDocument from './components/admin/tailieu/UploadDocument';
// import DocumentDetail from './components/admin/tailieu/DocumentDetail';
import QlPodcast from './components/admin/podcast/QlPodcast';
import UploadPodcast from './components/admin/podcast/UploadPodcast';
import Breadcrumbs from './components/admin/Breadcrumbs';
// import { useImperativeHandle } from 'react';
// import EditPodcastForm from './components/admin/podcast/EditPodcastForm';
import DetailDocument from './components/admin/DetailDocument'
import CategoryList from './components/admin/CategoryList'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          {/* <Route path='/admin/podcast/EditPodcastForm' element={<EditPodcastForm/>} /> */}

          <Route path='/admin/Breadcrumbs' element={<Breadcrumbs />} />
        <Route index element={<Dashboard />} />
        <Route path='upload' element={<UploadDocument />} />
        <Route path='detail/:id' element={<DetailDocument />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="category" element={<CategoryList />} />
        <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
      <ToastContainer />

    </BrowserRouter>
  );
}
