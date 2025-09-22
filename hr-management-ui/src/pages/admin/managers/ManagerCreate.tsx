import { useNavigate } from "react-router-dom";
import ManagerForm, { type ManagerFormValues } from "./ManagerForm";
import { apiFetch } from "../../../lib/api";

export default function ManagerCreate() {
  const nav = useNavigate();

  async function handleSubmit(values: ManagerFormValues) {
    // Server should set role = "Manager", UI does not send it
    await apiFetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({
        firstName: values.firstName,
        secondName: values.secondName,
        lastName: values.lastName,
        secondSurname: values.secondSurname,
        email: values.email,
        phone: values.phone,
        address: values.address,
        birthPlace: values.birthPlace,
        birthDate: values.birthDate,
        gender: values.gender,
        nationalId: values.nationalId,
        companyId: values.companyId,
        title: values.title,
        section: values.section,
        hiredDate: values.hiredDate,
        resignationDate: values.resignationDate,
        salary: values.salary,
        imageUrl: values.imageUrl,
        backgroundImageUrl: values.backgroundImageUrl,
        isActive: values.isActive,
        invite: values.invite ?? true,
      }),
    });

    nav("/admin/managers", { replace: true });
  }

  return (
    <div className="content">
      <ManagerForm submitLabel="Create manager" onSubmit={handleSubmit} />
    </div>
  );
}
