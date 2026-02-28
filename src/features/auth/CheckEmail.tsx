import { useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resendVerification } from "./authSlice";
import { ROUTES } from "../../core/routes";
import { useCooldown } from "../../hooks/useCooldown";
import "../../styles/EmailVerification.css";

function CheckEmail() {
  const dispatch = useAppDispatch();
  const { registeredEmail, status } = useAppSelector((state) => state.auth);
  const [cooldown, startCooldown, isCooling] = useCooldown(60);

  const handleResend = useCallback(async () => {
    if (!registeredEmail || isCooling) return;
    try {
      await dispatch(resendVerification({ email: registeredEmail })).unwrap();
      startCooldown();
    } catch {
      // Error handled by thunk
    }
  }, [dispatch, registeredEmail, isCooling, startCooldown]);

  if (!registeredEmail) {
    return <Navigate to={ROUTES.register} replace />;
  }

  const isLoading = status === "loading";

  return (
    <div className="login-container">
      <div className="login-form text-center">
        <div className="verify-email-icon">
          <MdOutlineMarkEmailRead />
        </div>
        <h2 className="fw-bold mb-3 auth-heading">Check Your Email!</h2>
        <p className="auth-subtitle">
          We sent a verification link to{" "}
          <strong className="auth-strong-text">{registeredEmail}</strong>
        </p>
        <p className="auth-subtitle-small mt-2 mb-4">
          Click the link in your email to activate your account.
          <br />
          The link expires in 24 hours.
        </p>

        <div className="resend-section">
          <p className="auth-subtitle-small resend-section-title mb-3">
            Didn't receive it?
          </p>
          <button
            className="btn btn-outline-primary resend-btn w-100"
            onClick={handleResend}
            disabled={isCooling || isLoading}
          >
            {isLoading
              ? "Sending..."
              : isCooling
              ? `Resend in ${cooldown}s`
              : "Resend Email"}
          </button>
        </div>

        <p className="mt-4 auth-subtitle-small">
          Wrong email?{" "}
          <Link to={ROUTES.register} className="login-here">
            Register again
          </Link>
        </p>

        <Link
          to={ROUTES.login}
          className="btn btn-primary login-btn w-100 mt-3"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default CheckEmail;
