import { Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import SaveCancelButton from '../common/SaveCancelButton';
import { useCallback, useEffect, useRef, useState } from 'react';
import { clearProfileInfo, GetProfileInfo, UpdateProfile, UploadAvatar } from '../../features/profile/profileSlice';
import { updateAvatar } from '../../features/auth/authSlice';
import { profileSchema, type ProfileFormData } from '../../types/profile';
import { FaCamera, FaUser } from 'react-icons/fa';
import { SERVER_URL } from '../../constants/app';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function ProfileForm() {
  const dispatch = useAppDispatch();
  const { profileInfo, profileLoading, avatarUploading } = useAppSelector((state) => state.profile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: '',
      fullName: '',
      email: '',
    },
  });

  // Fetch profile on mount
  useEffect(() => {
    dispatch(GetProfileInfo());

    return () => {
      dispatch(clearProfileInfo());
    };
  }, [dispatch]);

  // Update form when profileInfo loads
  useEffect(() => {
    if (profileInfo) {
      reset({
        userName: profileInfo.userName || '',
        fullName: profileInfo.fullName || '',
        email: profileInfo.email || '',
      });
      setPreviewUrl(profileInfo.avatarUrl || null);
    }
  }, [profileInfo, reset]);

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, WebP, or GIF)');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image must be smaller than 5MB');
      return false;
    }
    return true;
  };

  const handleAvatarUpload = async (file: File) => {
    if (!validateFile(file)) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const newAvatarUrl = await dispatch(UploadAvatar(file)).unwrap();
      dispatch(updateAvatar(newAvatarUrl)); // Update auth state
      toast.success('Profile picture updated!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Revert preview on failure
      setPreviewUrl(profileInfo?.avatarUrl || null);
      toast.error(error || 'Failed to upload profile picture');
    } finally {
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleAvatarUpload(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleAvatarUpload(file);
  };



  const onSubmit = async (data: ProfileFormData) => {
    try {
      await dispatch(UpdateProfile({ fullName: data.fullName })).unwrap();
      toast.success('Profile updated successfully!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (!isDirty) return;

    if (profileInfo) {
      reset({
        userName: profileInfo.userName || '',
        fullName: profileInfo.fullName || '',
        email: profileInfo.email || '',
      });
      toast.info('Changes discarded');
    }
  };

  const fields = [
    { name: 'userName' as const, label: 'Username', readOnly: true },
    { name: 'fullName' as const, label: 'Full Name', readOnly: false },
  ];

  const initials = profileInfo?.fullName
    ? profileInfo.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : profileInfo?.userName?.[0]?.toUpperCase() || '';



  return (
    <Form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Avatar Upload Section */}
      <div className="avatar-upload-section">
        <div
          className={`avatar-upload-wrapper ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          
        >
          <div className="avatar-preview" onClick={() => fileInputRef.current?.click()}>
            {avatarUploading && (
              <div className="avatar-loading-overlay">
                <div className="avatar-spinner" />
              </div>
            )}
            {previewUrl ? (
              <img src={`${SERVER_URL}${previewUrl}`} alt="Profile" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                {initials ? (
                  <span className="avatar-initials">{initials}</span>
                ) : (
                  <FaUser className="avatar-icon" />
                )}
              </div>
            )}
            <div className="avatar-overlay">
              <FaCamera className="camera-icon" />
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="avatar-file-input"
            aria-label="Upload profile picture"
          />
        </div>

        <div className="avatar-info">
          <h4 className="avatar-title">Profile Picture</h4>
          <p className="avatar-hint">Click the avatar or drag & drop an image</p>
          <p className="avatar-formats">JPG, PNG, WebP or GIF — Max 5MB</p>
          <div className="avatar-actions">
            <button
              type="button"
              className="avatar-btn avatar-btn-upload"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
            >
              <FaCamera /> {avatarUploading ? 'Uploading...' : 'Upload Photo'}
            </button>
           
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <Row className="mb-4">
        {fields.map((field) => (
          <Col md={6} key={field.name}>
            <Form.Group>
              <Form.Label>{field.label}</Form.Label>
              <Form.Control
                type="text"
                {...register(field.name)}
                readOnly={field.readOnly}
              />
              {errors[field.name] && (
                <p className="text-danger mt-1">{errors[field.name]?.message}</p>
              )}
            </Form.Group>
          </Col>
        ))}
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" {...register('email')} readOnly />
        {errors.email && (
          <p className="text-danger mt-1">{errors.email.message}</p>
        )}
      </Form.Group>

      <SaveCancelButton
        onCancel={handleCancel}
        isLoading={profileLoading}
        cancelText="Cancel"
        saveText="Save"
      />
    </Form>
  );
}

export default ProfileForm;