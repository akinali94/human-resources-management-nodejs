import { type ReactNode } from "react";

type Props = { title: string; description?: string; action?: ReactNode };
export default function EmptyState({ title, description, action }: Props) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
