import PasswordForm from "../../components/Profile/PasswordForm";


function PasswordSettings() {
  return (
    <div className="password-settings">
      <div className="settings-section-header">
        <h2 className="settings-section-title">Change Password</h2>
        <p className="settings-section-description">
          Use this form to update your password.
        </p>
      </div>
      <PasswordForm />
    </div>
  );
}

export default PasswordSettings;