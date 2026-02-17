import { Button } from "react-bootstrap";

interface SaveCancelButtonProps {
  onCancel: () => void;
  onSave?: () => void;
  isLoading?: boolean;
  cancelText?: string;
  saveText?: string;
}

function SaveCancelButton({
  onCancel,
  onSave,
  isLoading = false,
  cancelText = "Cancel",
  saveText = "Save",
}: SaveCancelButtonProps) {
  return (
    <div className="d-flex justify-content-end gap-2">
      <Button
        variant="outline-secondary"
        type="button"
        onClick={onCancel}
        className="cancel-btn"
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        variant="primary"
        type="submit"
        className="save-btn"
        disabled={isLoading}
        onClick={onSave}
      >
        {isLoading ? "Saving..." : saveText}
      </Button>
    </div>
  );
}

export default SaveCancelButton;