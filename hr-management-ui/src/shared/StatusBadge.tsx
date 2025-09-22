export default function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`badge ${active ? "ok" : "off"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}
