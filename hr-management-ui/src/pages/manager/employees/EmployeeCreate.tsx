import { useNavigate } from "react-router-dom";
import EmployeeForm, { type EmployeeFormValues } from "./EmployeeForm";
import { apiFetch } from "../../../lib/api";

export default function EmployeeCreate() {
  const nav = useNavigate();

  async function handleSubmit(values: EmployeeFormValues) {
    await apiFetch("/api/manager/employees", {
      method: "POST",
      body: JSON.stringify({
        firstName: values.firstName,
        secondName: values.secondName,
        lastName: values.lastName,
        secondLastName: values.secondLastName,
        email: values.email,
        phoneNo: values.phoneNo,
        address: values.address,
        birthPlace: values.birthPlace,
        nationalId: values.identityNumber,
        title: values.title,
        section: values.section,
        hiredDate: values.hiredDate,
        resignationDate: values.resignationDate,
        salary: values.salary,
        imageUrl: values.imageUrl,
        backgroundImageUrl: values.backgroundImageUrl,
      }),
    });

    nav("/manager/employees", { replace: true });
  }

  return (
    <div className="content">
      <EmployeeForm submitLabel="Create employee" onSubmit={handleSubmit} />
    </div>
  );
}
