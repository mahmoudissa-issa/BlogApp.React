import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdErrorOutline } from "react-icons/md";
import logo from "../../assets/m-logo-design.svg";
import { resetPasswordSchema, type ResetPasswordFormData } from "../../types/auth";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetPassword } from "./authSlice";
import { ROUTES } from "../../core/routes";
import PasswordToggleButton from "../../components/common/PasswordToggleButton";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await dispatch(resetPassword({
        token,
        email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })).unwrap();
      navigate(ROUTES.login, { replace: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error is handled by the thunk
    }
  };

  if (!token || !email) {
    return (
      <div className="login-container">
        <div className="login-form text-center">
          <div className="reset-invalid-icon">
            <MdErrorOutline />
          </div>
          <h2 className="fw-bold mb-2 auth-heading">
            Invalid link
          </h2>
          <p className="auth-subtitle">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to={ROUTES.forgotPassword}
            className="btn btn-primary login-btn w-100 mt-4"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <img
          src={logo}
          alt="logo"
          width="48"
          height="48"
          loading="lazy"
          className="d-block mx-auto mb-3"
        />
        <h2
          className="text-center mb-2 fw-bold auth-heading"
        >
          Set new password
        </h2>
        <p className="text-center auth-subtitle">
          Your new password must be at least 6 characters
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="form-group mb-3">
            <label htmlFor="newPassword">New password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="newPassword"
                {...register("newPassword")}
              />
              <PasswordToggleButton
                showPassword={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.newPassword && (
              <p className="text-danger mt-1">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="form-group mb-4">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <div className="position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                {...register("confirmPassword")}
              />
              <PasswordToggleButton
                showPassword={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-danger mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary login-btn w-100"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Resetting..." : "Reset password"}
          </button>
        </form>
        <p className="text-center mt-3 auth-subtitle">
          <Link to={ROUTES.login} className="login-here">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
