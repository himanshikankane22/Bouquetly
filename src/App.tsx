import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DraftProvider } from './state/DraftContext'
import Home from './pages/Home'
import Create from './pages/Create'
import Preview from './pages/Preview'
import Surprise from './pages/Surprise'

export default function App() {
  return (
    <BrowserRouter>
      <DraftProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/surprise/:id" element={<Surprise />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DraftProvider>
    </BrowserRouter>
  )
}