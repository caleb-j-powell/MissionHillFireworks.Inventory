import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UploadOrderExcel from './components/upload-order-excel.tsx'
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import BottomNav from './components/bottom-navigation.tsx'

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline/>

    <BrowserRouter>
      <Box sx={{ pb: "calc(56px + env(safe-area-inset-bottom))" }}>
        <Routes>
          <Route path="/scan" element={<App />} />
          <Route path="/product-intake" element={<UploadOrderExcel />} />
        </Routes>

        <BottomNav/>
      </Box>
    </BrowserRouter>
  </ThemeProvider>
)
