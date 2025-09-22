import { Routes, Route, Navigate } from "react-router-dom";
import AdminLanding from "./Pages/admin/AdminLanding";
import Home from "./Pages/Home";
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/admin" element={<AdminLanding />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
