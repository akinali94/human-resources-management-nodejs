import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLanding from "./pages/admin/AdminLanding";
import ManagersList from "./pages/admin/managers/ManagersList";
import ManagerDetails from "./pages/admin/managers/ManagerDetails";
import ManagerCreate from "./pages/admin/managers/ManagerCreate";
import ManagerEdit from "./pages/admin/managers/ManagerEdit";
import Home from "./pages/Home";
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/admin" element={<AdminLayout />} >
        <Route index element={<AdminLanding />} />
        <Route path="managers" element={<ManagersList />} />
        <Route path="managers/new" element={<ManagerCreate />} />
        <Route path="managers/:id" element={<ManagerDetails />} />
        <Route path="managers/:id/edit" element={<ManagerEdit />} />
        {/* <Route path="companies" element={<CompaniesList />} /> */}
        {/* <Route path="companies/new" element={<CompanyCreate />} /> */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
