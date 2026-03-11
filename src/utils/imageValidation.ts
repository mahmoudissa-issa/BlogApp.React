import { toast } from "react-toastify";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Validates an image file's type and size.
 * Shows a toast and returns `false` when invalid.
 */
export const validateImageFile = (file: File): boolean => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    toast.error("Please upload a valid image (JPEG, PNG, WebP, or GIF)");
    return false;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    toast.error("Image must be smaller than 5 MB");
    return false;
  }
  return true;
};
