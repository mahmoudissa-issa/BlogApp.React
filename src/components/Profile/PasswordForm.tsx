import { useState } from "react";
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
import "../../styles/PasswordSettings.css";

function PasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error || "Failed to change password");
    }
  };

  const handleCancel = async () => {
    // Check if form has actual values (not just touched)
    const formValues = watch();
    const hasValues = Object.values(formValues).some(value => value && value.trim() !== "");

    if (!hasValues) {
      reset();
      return;
    }

    const isConfirmed = await showConfirmDialog({
      title: "Discard Changes?",
      message: "Your changes will be lost. Do you want to continue?",
      confirmText: "Discard",
      cancelText: "Keep Editing",
      icon: "question",
    });

    if (isConfirmed) reset();
  };

  const passwordFields = [
    {
      name: "currentPassword" as const,
      label: "Current Password",
      show: showCurrentPassword,
      setShow: setShowCurrentPassword,
      fullWidth: true,
    },
    {
      name: "newPassword" as const,
      label: "New Password",
      show: showNewPassword,
      setShow: setShowNewPassword,
    },
    {
      name: "confirmNewPassword" as const,
      label: "Confirm New Password",
      show: showConfirmPassword,
      setShow: setShowConfirmPassword,
    },
  ];

  return (
    <Form className="password-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Current Password - Full Width */}
      <Form.Group className="mb-4">
        <Form.Label>{passwordFields[0].label}</Form.Label>
        <div className="password-input-wrapper">
          <Form.Control
            type={passwordFields[0].show ? "text" : "password"}
            {...register(passwordFields[0].name)}
            className="password-input-field"
          />
          <PasswordToggleButton
            showPassword={passwordFields[0].show}
            onToggle={() => passwordFields[0].setShow(!passwordFields[0].show)}
          />
        </div>
        {errors[passwordFields[0].name] && (
          <p className="text-danger mt-1">
            {errors[passwordFields[0].name]?.message}
          </p>
        )}
      </Form.Group>

      {/* New Password & Confirm Password - Two Columns */}
      <Row className="mb-4 g-4">
        {passwordFields.slice(1).map((field) => (
          <Col md={6} xs={12} key={field.name}>
            <Form.Group>
              <Form.Label>{field.label}</Form.Label>
              <div className="password-input-wrapper">
                <Form.Control
                  type={field.show ? "text" : "password"}
                  {...register(field.name)}
                  className="password-input-field"
                />
                <PasswordToggleButton
                  showPassword={field.show}
                  onToggle={() => field.setShow(!field.show)}
                />
              </div>
              {errors[field.name] && (
                <p className="text-danger mt-1">{errors[field.name]?.message}</p>
              )}
            </Form.Group>
          </Col>
        ))}
      </Row>


        <SaveCancelButton
          onCancel={handleCancel}
          isLoading={passwordLoading}
          cancelText="Cancel"
          saveText="Save"
        />
    </Form>
  );
}

export default PasswordForm;