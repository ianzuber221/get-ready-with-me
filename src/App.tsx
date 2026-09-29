import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { WeekPage } from "./pages/WeekPage"
import { TonightPage } from "./pages/TonightPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WeekPage />} />
        <Route path="/tonight" element={<TonightPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
