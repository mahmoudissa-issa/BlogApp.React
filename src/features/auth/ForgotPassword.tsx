import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import logo from "../../assets/m-logo-design.svg";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../../types/auth";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { forgotPassword } from "./authSlice";
import { ROUTES } from "../../core/routes";

function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await dispatch(forgotPassword({ email: data.email })).unwrap();
      setSentEmail(data.email);
      setSubmitted(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error is handled by the thunk
    }
  };

  if (submitted) {
    return (
      <div className="login-container">
        <div className="login-form text-center">
          <div className="forgot-success-icon">
            <MdOutlineMarkEmailRead />
          </div>
          <h2 className="fw-bold mb-2 auth-heading">
            Check your inbox
          </h2>
          <p className="auth-subtitle">
            We sent a password reset link to{" "}
            <strong className="auth-strong-text">{sentEmail}</strong>
          </p>
          <p className="mt-3 auth-subtitle-small">
            Didn't receive the email?{" "}
            <button
              className="btn-link-styled"
              onClick={() => setSubmitted(false)}
            >
              Try again
            </button>
          </p>
          <Link
            to={ROUTES.login}
            className="btn btn-primary login-btn w-100 mt-4"
          >
            Back to sign in
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
          Forgot password?
        </h2>
        <p className="text-center auth-subtitle">
          Enter your email and we'll send you a reset link
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="form-group mb-4">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-danger mt-1">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary login-btn w-100"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <p className="text-center mt-3 auth-subtitle">
          Remember your password?{" "}
          <Link to={ROUTES.login} className="login-here">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
