import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLanding from "./pages/admin/AdminLanding";
import ManagersList from "./pages/admin/managers/ManagersList";
import ManagerDetails from "./pages/admin/managers/ManagerDetails";
import ManagerCreate from "./pages/admin/managers/ManagerCreate";
import ManagerEdit from "./pages/admin/managers/ManagerEdit";
import CompaniesList from "./pages/admin/companies/CompaniesList";
import CompanyCreate from "./pages/admin/companies/CompanyCreate";
import CompanyDetails from "./pages/admin/companies/CompanyDetails";
import CompanyEdit from "./pages/admin/companies/CompanyEdit";
import ManagerLayout from "./pages/manager/ManagerLayout";
import ManagerLanding from "./pages/manager/ManagerLanding";
import Home from "./pages/Home";
import './App.css'
import EmployeesList from "./pages/manager/employees/EmployeesList";
import EmployeeDetails from "./pages/manager/employees/EmployeeDetails";
import EmployeeCreate from "./pages/manager/employees/EmployeeCreate";
import EmployeeEdit from "./pages/manager/employees/EmployeeEdit";



function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminLanding />} />
        <Route path="managers" element={<ManagersList />} />
        <Route path="managers/new" element={<ManagerCreate />} />
        <Route path="managers/:id" element={<ManagerDetails />} />
        <Route path="managers/:id/edit" element={<ManagerEdit />} />
        <Route path="companies" element={<CompaniesList />} />
        <Route path="companies/:id" element={<CompanyDetails />} />
        <Route path="companies/:id/edit" element={<CompanyEdit />} />
        <Route path="companies/new" element={<CompanyCreate />} />
      </Route>

      {/* Manager Routes */}
      <Route path="/manager" element={<ManagerLayout />}>
        <Route index element={<ManagerLanding />} />
        <Route path="employees" element={<EmployeesList />} />
        <Route path="employees/new" element={<EmployeeCreate />} />
        <Route path="employees/:id" element={<EmployeeDetails />} />
        <Route path="employees/:id/edit" element={<EmployeeEdit />} />
        
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
