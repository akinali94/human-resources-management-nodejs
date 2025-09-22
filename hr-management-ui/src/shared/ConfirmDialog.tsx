type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};
export default function ConfirmDialog({
  open, title, description, confirmText = "Confirm", cancelText = "Cancel",
  danger, onConfirm, onCancel
}: Props) {
  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header"><h3>{title}</h3></div>
        {description && <div className="modal-body">{description}</div>}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>{cancelText}</button>
          <button className={`btn-primary ${danger ? "danger" : ""}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
