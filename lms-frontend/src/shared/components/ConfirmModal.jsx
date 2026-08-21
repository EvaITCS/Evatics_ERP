export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>

        <p>{message}</p>

        <div className="modal-actions">
          <button
            className="secondary-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="primary-btn"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}