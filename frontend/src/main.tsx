import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UploadOrderExcel from './components/upload-order-excel.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/upload-orders" element={<UploadOrderExcel />} />
    </Routes>
  </BrowserRouter>
)
