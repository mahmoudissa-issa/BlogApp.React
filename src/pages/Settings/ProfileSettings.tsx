import ProfileForm from "../../components/Profile/ProfileForm";
import "../../styles/ProfileSettings.css";
function ProfileSettings() {
  return (
    <div className="profile-settings">
      <div className="settings-section-header">
        <h2 className="settings-section-title">Profile</h2>
        <p className="settings-section-description">
         The username and email can only be changed by an admin.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}

export default ProfileSettings;