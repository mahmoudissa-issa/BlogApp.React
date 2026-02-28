import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdVerified, MdErrorOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { verifyEmail, resendVerification } from "./authSlice";
import { ROUTES } from "../../core/routes";
import { useCooldown } from "../../hooks/useCooldown";
import "../../styles/EmailVerification.css";

type VerifyState = "loading" | "success" | "failed";

function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, user } = useAppSelector((state) => state.auth);

  const [pageState, setPageState] = useState<VerifyState>("loading");
  const [countdown, setCountdown] = useState(3);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, startCooldown, isCooling] = useCooldown(60);
  const hasVerified = useRef(false);

  // Verify token on mount (once)
  useEffect(() => {
    if (hasVerified.current || !token) {
      setPageState("failed");
      return;
    }
    hasVerified.current = true;

    dispatch(verifyEmail(token))
      .unwrap()
      .then(() => setPageState("success"))
      .catch(() => setPageState("failed"));
  }, [token, dispatch]);

  // Redirect countdown after success
  useEffect(() => {
    if (pageState !== "success") return;
    if (countdown <= 0) {
      navigate(ROUTES.home, { replace: true });
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [pageState, countdown, navigate]);

  const handleResend = useCallback(async () => {
    if (!resendEmail || isCooling) return;
    setResendLoading(true);
    try {
      await dispatch(resendVerification({ email: resendEmail })).unwrap();
      startCooldown();
    } catch {
      // Error handled by thunk
    } finally {
      setResendLoading(false);
    }
  }, [dispatch, resendEmail, isCooling, startCooldown]);

  // ── Loading ──
  if (pageState === "loading") {
    return (
      <div className="login-container">
        <div className="login-form text-center">
          <div className="verify-loading-spinner" />
          <h2 className="fw-bold mb-2 auth-heading">Verifying...</h2>
          <p className="auth-subtitle">
            Please wait while we verify your email address
          </p>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (pageState === "success" && user) {
    return (
      <div className="login-container">
        <div className="login-form text-center">
          <div className="verify-success-icon">
            <MdVerified />
          </div>
          <h2 className="fw-bold mb-3 auth-heading">Email Verified!</h2>
          <p className="auth-subtitle">
            Your account is now active.
            <br />
            Welcome to Fullstack Blog!
          </p>
          <div className="verify-countdown-badge mt-4">
            Redirecting in {countdown}...
          </div>
          <Link
            to={ROUTES.home}
            className="btn btn-primary login-btn w-100 mt-4"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ── Failed ──
  return (
    <div className="login-container">
      <div className="login-form text-center">
        <div className="verify-error-icon">
          <MdErrorOutline />
        </div>
        <h2 className="fw-bold mb-3 auth-heading">Link Expired</h2>
        <p className="auth-subtitle mb-4">
          {error || "This verification link has expired or is no longer valid."}
        </p>

        <div className="resend-section">
          <p className="auth-subtitle-small resend-section-title mb-3">
            Request a new verification link
          </p>
          <div className="form-group mb-3">
            <label htmlFor="resendEmail">Email address</label>
            <input
              type="email"
              className="form-control"
              id="resendEmail"
              placeholder="you@example.com"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
            />
          </div>
          <button
            className="btn btn-outline-primary resend-btn w-100"
            onClick={handleResend}
            disabled={!resendEmail || isCooling || resendLoading}
          >
            {resendLoading
              ? "Sending..."
              : isCooling
              ? `Resend in ${cooldown}s`
              : "Request New Verification Link"}
          </button>
        </div>

        <Link
          to={ROUTES.login}
          className="btn btn-primary login-btn w-100 mt-4"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmail;
