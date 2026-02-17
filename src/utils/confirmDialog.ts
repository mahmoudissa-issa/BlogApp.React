import Swal from "sweetalert2";

interface ConfirmDialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: "warning" | "info" | "question" | "success" | "error";
}

export const showConfirmDialog = async (
  options: ConfirmDialogOptions = {}
): Promise<boolean> => {
  const {
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Yes",
    cancelText = "No",
    icon = "question",
  } = options;

  const result = await Swal.fire({
    title,
    text: message,
    icon,
    iconColor: "#39bdf9",
    showCancelButton: true,
    reverseButtons: true,
    allowOutsideClick: false,
    confirmButtonColor: "#39bdf9",
    cancelButtonColor: "transparent",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    customClass: {
      popup: "custom-swal-popup",
      title: "custom-swal-title",
      htmlContainer: "custom-swal-content",
      confirmButton: "custom-swal-confirm-btn",
      cancelButton: "custom-swal-cancel-btn",
      container: "custom-swal-container",
    },
    didOpen: (modal) => {
      // Style the confirm button
      const confirmBtn = modal.querySelector(".custom-swal-confirm-btn") as HTMLElement;
      if (confirmBtn) {
        confirmBtn.style.backgroundColor = "#39bdf9";
        confirmBtn.style.color = "white";
        confirmBtn.style.padding = "0.5rem 2rem";
        confirmBtn.style.borderRadius = "6px";
        confirmBtn.style.border = "none";
        confirmBtn.style.fontWeight = "500";
        confirmBtn.style.cursor = "pointer";
        confirmBtn.style.minWidth = "120px";
        confirmBtn.style.marginLeft = "0.5rem";
      }

      // Style the cancel button
      const cancelBtn = modal.querySelector(".custom-swal-cancel-btn") as HTMLElement;
      if (cancelBtn) {
        cancelBtn.style.backgroundColor = "transparent";
        cancelBtn.style.color = "#39bdf9";
        cancelBtn.style.border = "2px solid #39bdf9";
        cancelBtn.style.padding = "0.4rem 2rem";
        cancelBtn.style.borderRadius = "6px";
        cancelBtn.style.fontWeight = "500";
        cancelBtn.style.cursor = "pointer";
        cancelBtn.style.minWidth = "120px";
        cancelBtn.style.marginRight = "1rem";
      }
    },
  });

  return result.isConfirmed;
};

export default showConfirmDialog;
