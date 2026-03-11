import { Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../../types/profile";
import PasswordToggleButton from "../common/PasswordToggleButton";
import SaveCancelButton from "../common/SaveCancelButton";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ChangePassword } from "../../features/profile/profileSlice";
import { showConfirmDialog } from "../../utils/confirmDialog";
import { usePasswordToggle } from "../../hooks/usePasswordToggle";
import "../../styles/PasswordSettings.css";

const PASSWORD_FIELDS = [
  { name: "currentPassword" as const, label: "Current Password", fullWidth: true },
  { name: "newPassword" as const, label: "New Password" },
  { name: "confirmNewPassword" as const, label: "Confirm New Password" },
] as const;

function PasswordForm() {
  const pw = usePasswordToggle("currentPassword", "newPassword", "confirmNewPassword");
  const dispatch = useAppDispatch();
  const { passwordLoading } = useAppSelector((state) => state.profile);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await dispatch(ChangePassword(data)).unwrap();
      toast.success("Password changed successfully!");
      reset();
    } catch (error: unknown) {
      toast.error((error as string) || "Failed to change password");
    }
  };

  const handleCancel = async () => {
    const formValues = watch();
    const hasValues = Object.values(formValues).some((v) => v && v.trim() !== "");
    if (!hasValues) { reset(); return; }

    const isConfirmed = await showConfirmDialog({
      title: "Discard Changes?",
      message: "Your changes will be lost. Do you want to continue?",
      confirmText: "Discard",
      cancelText: "Keep Editing",
      icon: "question",
    });
    if (isConfirmed) reset();
  };

  return (
    <Form className="password-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Current Password - Full Width */}
      <Form.Group className="mb-4">
        <Form.Label>{PASSWORD_FIELDS[0].label}</Form.Label>
        <div className="password-input-wrapper">
          <Form.Control
            type={pw.currentPassword.show ? "text" : "password"}
            {...register(PASSWORD_FIELDS[0].name)}
            className="password-input-field"
          />
          <PasswordToggleButton showPassword={pw.currentPassword.show} onToggle={pw.currentPassword.toggle} />
        </div>
        {errors.currentPassword && <p className="text-danger mt-1">{errors.currentPassword.message}</p>}
      </Form.Group>

      {/* New Password & Confirm Password - Two Columns */}
      <Row className="mb-4 g-4">
        {PASSWORD_FIELDS.slice(1).map((field) => (
          <Col md={6} xs={12} key={field.name}>
            <Form.Group>
              <Form.Label>{field.label}</Form.Label>
              <div className="password-input-wrapper">
                <Form.Control
                  type={pw[field.name].show ? "text" : "password"}
                  {...register(field.name)}
                  className="password-input-field"
                />
                <PasswordToggleButton showPassword={pw[field.name].show} onToggle={pw[field.name].toggle} />
              </div>
              {errors[field.name] && <p className="text-danger mt-1">{errors[field.name]?.message}</p>}
            </Form.Group>
          </Col>
        ))}
      </Row>

      <SaveCancelButton onCancel={handleCancel} isLoading={passwordLoading} />
    </Form>
  );
}

export default PasswordForm;