import { useNavigate } from "react-router-dom";
import CompanyForm, { type CompanyFormValues } from "./CompanyForm";
import { apiFetch } from "../../../lib/api";

export default function CompanyCreate() {
  const nav = useNavigate();

  async function handleSubmit(values: CompanyFormValues) {
    await apiFetch("/api/companies", {
      method: "POST",
      body: JSON.stringify({
        name: values.name,
        title: values.title,
        mersisNo: values.mersisNo,
        taxNumber: values.taxNumber,
        logo: values.logo,
        telephoneNumber: values.telephoneNumber,
        address: values.address,
        email: values.email,
        foundationYear: values.foundationYear,
        contractStartDate: values.contractStartDate,
        contractEndDate: values.contractEndDate,
        isActive: values.isActive,
      }),
    });

    nav("/admin/companies", { replace: true });
  }

  return (
    <div className="content">
      <CompanyForm submitLabel="Create company" onSubmit={handleSubmit} />
    </div>
  );
}
