import { useEffect, useState } from "react";
import logo from "../../assets/m-logo-design.svg";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../../types/auth";
import { useForm } from "react-hook-form";
import { registers } from "./authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PasswordToggleButton from "../../components/common/PasswordToggleButton";
import "../../styles/Register.css";
function Register() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      roleName: 'Reader',
    },
  });
  const onSubmit = (data: RegisterFormData) => {
    dispatch(
      registers({
        userName: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        roleName: data.roleName,
      }),
    );
  };
  return (
    <div className="register-container">
      <div className="register-form">
        <img
          src={logo}
          alt="logo"
          width="48"
          height="48"
          loading="lazy"
          className="d-block mx-auto mb-1"
        />
        <h2
          className="text-center mb-2 fw-bold auth-heading"
        >
          Sign up to an account
        </h2>
        <p className="text-center auth-subtitle">
          Already registered?{" "}
          <Link to="/login" className="login-here">
            Sign in
          </Link>{" "}
          to your account
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group mb-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-danger mt-1">{errors.username.message}</p>
            )}
          </div>
          <div className="form-group mb-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-danger mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="form-group mb-2">
            <label htmlFor="password">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                {...register("password")}
              />
              <PasswordToggleButton
                showPassword={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && (
              <p className="text-danger mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="form-group mb-2">
            <label htmlFor="confirmPassword">Confirm Password</label>
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
          <div className="form-group mb-4">
            <label className="mb-3">I want to:</label>
            <div className="role-selection">
              <div className="role-option">
                <input
                  type="radio"
                  id="reader"
                  value="Reader"
                  {...register("roleName")}
                  className="form-check-input"
                />
                <label htmlFor="reader" className="form-check-label ms-2">
                  Read and comment on posts
                </label>
              </div>
              <div className="role-option">
                <input
                  type="radio"
                  id="author"
                  value="Author"
                  {...register("roleName")}
                  className="form-check-input"
                />
                <label htmlFor="author" className="form-check-label ms-2">
                  Write and publish posts
                </label>
              </div>
            </div>
            {errors.roleName && (
              <p className="text-danger mt-2">{errors.roleName.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary register-btn mt-4 w-100"
            disabled={isSubmitting}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
