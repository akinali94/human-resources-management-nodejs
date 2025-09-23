import { useNavigate } from "react-router-dom";
import ManagerForm, { type ManagerFormValues } from "./ManagerForm";
import { apiFetch } from "../../../lib/api";

export default function ManagerCreate() {
  const nav = useNavigate();

  async function handleSubmit(values: ManagerFormValues) {
    await apiFetch("/api/admin/managers", {
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
        companyId: values.companyId,
        title: values.title,
        section: values.section,
        hiredDate: values.hiredDate,
        resignationDate: values.resignationDate,
        salary: values.salary,
        imageUrl: values.imageUrl,
        backgroundImageUrl: values.backgroundImageUrl,
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
