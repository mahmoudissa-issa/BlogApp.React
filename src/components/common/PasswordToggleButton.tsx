import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "../../styles/global.css";

interface PasswordToggleButtonProps {
  showPassword: boolean;
  onToggle: () => void;
}

const PasswordToggleButton: React.FC<PasswordToggleButtonProps> = ({
  showPassword,
  onToggle,
}) => {
  return (
    <button
      type="button"
      className="password-toggle-icon-btn"
      onClick={onToggle}
      aria-label="Toggle password visibility"
    >
      {showPassword ? (
        <AiOutlineEyeInvisible className="password-toggle-icon" />
      ) : (
        <AiOutlineEye className="password-toggle-icon" />
      )}
    </button>
  );
};

export default PasswordToggleButton;
