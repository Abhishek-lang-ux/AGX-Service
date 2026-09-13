import {
  ArrowLeft,
  Camera,
  Check,
  Mail,
  Phone,
  UserRound,
  Upload,
  X,
} from "lucide-react";

import { apiRequest, updateStoredUser } from "../lib/api.js";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./editProfile.css";

function EditProfile() {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const [apiError, setApiError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const [saved, setSaved] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  /*
   * =========================================================
   * LOAD PROFILE
   * =========================================================
   */

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoadingProfile(true);
        setApiError("");

        const data = await apiRequest("/profile");

        if (!active) return;

        setProfile(data.profile);

        /*
         * If backend already returns a profile photo URL,
         * use it.
         */
        if (data.profile?.profileImage) {
          setPhotoPreview(data.profile.profileImage);
        } else if (data.profile?.profile_image) {
          setPhotoPreview(data.profile.profile_image);
        }
      } catch (error) {
        if (active) {
          setApiError(
            error.message || "Unable to load profile"
          );
        }
      } finally {
        if (active) {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  /*
   * =========================================================
   * OPEN FILE PICKER
   * =========================================================
   */

  const openPhotoPicker = () => {
    if (saving) return;

    fileInputRef.current?.click();
  };

  /*
   * =========================================================
   * PHOTO SELECT
   * =========================================================
   */

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setApiError("");
    setSaveMessage("");

    /*
     * File type validation
     */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setApiError(
        "Invalid image. Please select a JPG, PNG or WEBP file."
      );

      event.target.value = "";
      return;
    }

    /*
     * 5 MB validation
     */

    if (file.size > 5 * 1024 * 1024) {
      setApiError(
        "Profile photo must be less than 5 MB."
      );

      event.target.value = "";
      return;
    }

    /*
     * Save selected file
     */

    setSelectedPhoto(file);

    /*
     * Instant preview
     */

    const previewUrl = URL.createObjectURL(file);

    setPhotoPreview(previewUrl);
  };

  /*
   * =========================================================
   * REMOVE SELECTED PHOTO
   * =========================================================
   */

  const handleRemoveSelectedPhoto = () => {
    setSelectedPhoto(null);

    /*
     * Restore existing photo if available
     */

    if (profile?.profileImage) {
      setPhotoPreview(profile.profileImage);
    } else if (profile?.profile_image) {
      setPhotoPreview(profile.profile_image);
    } else {
      setPhotoPreview("");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
   * =========================================================
   * SAVE PROFILE
   * =========================================================
   */

  const saveProfileToApi = async () => {
    setSaving(true);
    setApiError("");
    setSaveMessage("");
    setSaved(false);

    try {
      /*
       * IMPORTANT:
       *
       * If no photo is selected, normal JSON profile update.
       */

      if (!selectedPhoto) {
        const payload = {
          name:
            document.getElementById("profile-name")?.value ||
            profile?.firstName ||
            profile?.name ||
            "",

          phone:
            document.getElementById("profile-phone")?.value ||
            profile?.phone ||
            "",

          businessName:
            document.getElementById("business-name")?.value ||
            profile?.businessName ||
            "",

          pan:
            document.getElementById("profile-pan")?.value ||
            profile?.pan ||
            "",

          gstin:
            document.getElementById("profile-gstin")?.value ||
            profile?.gstin ||
            "",

          businessAddress:
            document.getElementById("business-address")?.value ||
            profile?.businessAddress ||
            "",
        };

        await apiRequest("/profile", {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        /*
         * =====================================================
         * PHOTO UPLOAD
         * =====================================================
         *
         * This requires backend /profile to support
         * multipart/form-data.
         */

        const formData = new FormData();

        formData.append("profileImage", selectedPhoto);

        /*
         * Normal profile fields
         */

        formData.append(
          "name",
          document.getElementById("profile-name")?.value ||
            profile?.firstName ||
            profile?.name ||
            ""
        );

        formData.append(
          "phone",
          document.getElementById("profile-phone")?.value ||
            profile?.phone ||
            ""
        );

        formData.append(
          "businessName",
          document.getElementById("business-name")?.value ||
            profile?.businessName ||
            ""
        );

        formData.append(
          "pan",
          document.getElementById("profile-pan")?.value ||
            profile?.pan ||
            ""
        );

        formData.append(
          "gstin",
          document.getElementById("profile-gstin")?.value ||
            profile?.gstin ||
            ""
        );

        formData.append(
          "businessAddress",
          document.getElementById("business-address")?.value ||
            profile?.businessAddress ||
            ""
        );

        /*
         * NOTE:
         *
         * apiRequest must support FormData without forcing
         * Content-Type: application/json.
         */

        await apiRequest("/profile", {
          method: "PUT",
          body: formData,
        });
      }

      /*
       * Reload fresh profile
       */

      const fresh = await apiRequest("/profile");

      setProfile(fresh.profile);

      /*
       * Update stored login user
       */

      updateStoredUser({
        id: fresh.profile.id,
        uuid: fresh.profile.uuid,
        email: fresh.profile.email,
        role: fresh.profile.role,
        status: fresh.profile.status,
        firstName: fresh.profile.firstName,
        lastName: fresh.profile.lastName,
        profileImage:
          fresh.profile.profileImage ||
          fresh.profile.profile_image ||
          "",
      });

      /*
       * Update photo preview
       */

      if (fresh.profile?.profileImage) {
        setPhotoPreview(fresh.profile.profileImage);
      } else if (fresh.profile?.profile_image) {
        setPhotoPreview(fresh.profile.profile_image);
      }

      setSelectedPhoto(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSaveMessage(
        "Profile updated successfully."
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      setApiError(
        error.message || "Unable to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================================================
   * FORM SUBMIT
   * =========================================================
   */

  const handleSave = async (e) => {
    e.preventDefault();

    if (saving) return;

    await saveProfileToApi();
  };

  /*
   * =========================================================
   * DISPLAY NAME
   * =========================================================
   */

  const displayName =
    profile?.name ||
    [
      profile?.firstName,
      profile?.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Akash Awasthi";

  /*
   * =========================================================
   * INITIALS
   * =========================================================
   */

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <main className="edit-profile-page">
      <div className="edit-profile-container">

        {/* =====================================================
            TOP
        ===================================================== */}

        <div className="edit-profile-top">
          <Link
            to="/profile"
            className="edit-profile-back"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <span className="edit-profile-label">
            ACCOUNT / PROFILE
          </span>
        </div>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="edit-profile-header">
          <div>
            <span className="edit-profile-eyebrow">
              PERSONAL INFORMATION
            </span>

            <h1>Edit Profile</h1>

            <p>
              Update your personal information associated
              with your AGX account.
            </p>
          </div>
        </section>

        {/* =====================================================
            API STATUS
        ===================================================== */}

        {loadingProfile && (
          <div className="profile-api-status">
            Loading saved profile…
          </div>
        )}

        {apiError && (
          <div
            className="profile-api-error"
            role="alert"
          >
            {apiError}
          </div>
        )}

        {saveMessage && (
          <div
            className="profile-api-success"
            role="status"
          >
            {saveMessage}
          </div>
        )}

        {/* =====================================================
            FORM
        ===================================================== */}

        <form onSubmit={handleSave}>

          {/* ===================================================
              PROFILE PHOTO
          =================================================== */}

          <section className="edit-profile-card">

            <div className="edit-profile-card-title">
              <div>
                <span>PROFILE PHOTO</span>
                <h2>Your Profile</h2>
              </div>
            </div>

            <div className="edit-photo-area">

              {/* Hidden file input */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />

              {/* Photo */}

              <div className="edit-photo">

                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt={`${displayName} profile`}
                    className="edit-profile-photo-image"
                  />
                ) : (
                  initials || "AA"
                )}

                {/* Camera */}

                <button
                  type="button"
                  title="Change photo"
                  aria-label="Change profile photo"
                  onClick={openPhotoPicker}
                  disabled={saving}
                >
                  <Camera size={15} />
                </button>

              </div>

              {/* Photo information */}

              <div>

                <strong>
                  {displayName}
                </strong>

                <p>
                  JPG, PNG or WEBP. Recommended size:
                  400 × 400px. Maximum 5 MB.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >

                  <button
                    type="button"
                    className="change-photo-btn"
                    onClick={openPhotoPicker}
                    disabled={saving}
                  >
                    <Camera size={15} />
                    Change Photo
                  </button>

                  {selectedPhoto && (
                    <button
                      type="button"
                      onClick={handleRemoveSelectedPhoto}
                      disabled={saving}
                      style={{
                        border: "1px solid #d9e2ef",
                        background: "#fff",
                        color: "#52657a",
                        borderRadius: "8px",
                        padding: "9px 12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      <X size={15} />
                      Remove
                    </button>
                  )}

                </div>

                {selectedPhoto && (
                  <small
                    style={{
                      display: "block",
                      marginTop: "8px",
                      color: "#1769e0",
                      fontWeight: 600,
                    }}
                  >
                    New photo selected: {selectedPhoto.name}
                  </small>
                )}

              </div>

            </div>

          </section>

          {/* ===================================================
              PERSONAL DETAILS
          =================================================== */}

          <section className="edit-profile-card">

            <div className="edit-profile-card-title">

              <div>
                <span>PERSONAL DETAILS</span>
                <h2>Basic Information</h2>
              </div>

              <UserRound size={19} />

            </div>

            <div className="edit-form-grid">

              {/* Full Name */}

              <div className="edit-form-group">

                <label>
                  Full Name
                </label>

                <div className="edit-input-wrap">

                  <UserRound size={16} />

                  <input
                    id="profile-name"
                    type="text"
                    defaultValue={
                      displayName
                    }
                    placeholder="Enter your full name"
                  />

                </div>

              </div>

              {/* Email */}

              <div className="edit-form-group">

                <label>
                  Email Address
                </label>

                <div className="edit-input-wrap">

                  <Mail size={16} />

                  <input
                    type="email"
                    defaultValue={
                      profile?.email ||
                      "your@email.com"
                    }
                    placeholder="Enter your email"
                    disabled
                    readOnly
                  />

                </div>

                <small>
                  Your email is used for important
                  account notifications.
                </small>

              </div>

              {/* Phone */}

              <div className="edit-form-group">

                <label>
                  Mobile Number
                </label>

                <div className="edit-input-wrap">

                  <Phone size={16} />

                  <input
                    id="profile-phone"
                    type="tel"
                    defaultValue={
                      profile?.phone || ""
                    }
                    placeholder="+91 XXXXX XXXXX"
                  />

                </div>

              </div>

              {/* Account Type */}

              <div className="edit-form-group">

                <label>
                  Account Type
                </label>

                <div className="edit-input-wrap">

                  <UserRound size={16} />

                  <input
                    type="text"
                    value="Client Account"
                    disabled
                    readOnly
                  />

                </div>

                <small>
                  Account type cannot be changed.
                </small>

              </div>

            </div>

          </section>

          {/* ===================================================
              BUSINESS
          =================================================== */}

          <section className="edit-profile-card">

            <div className="edit-profile-card-title">

              <div>
                <span>BUSINESS DETAILS</span>
                <h2>Business Information</h2>
              </div>

            </div>

            <div className="edit-form-grid">

              {/* Business */}

              <div className="edit-form-group">

                <label>
                  Business / Organization
                </label>

                <input
                  id="business-name"
                  type="text"
                  defaultValue={
                    profile?.businessName || ""
                  }
                  placeholder="Enter business name"
                />

              </div>

              {/* PAN */}

              <div className="edit-form-group">

                <label>
                  PAN
                </label>

                <input
                  id="profile-pan"
                  type="text"
                  defaultValue={
                    profile?.pan || ""
                  }
                  placeholder="Enter PAN"
                  maxLength="10"
                  style={{
                    textTransform: "uppercase",
                  }}
                />

              </div>

              {/* GSTIN */}

              <div className="edit-form-group">

                <label>
                  GSTIN
                </label>

                <input
                  id="profile-gstin"
                  type="text"
                  defaultValue={
                    profile?.gstin || ""
                  }
                  placeholder="Enter GSTIN"
                  maxLength="15"
                  style={{
                    textTransform: "uppercase",
                  }}
                />

              </div>

              {/* Address */}

              <div className="edit-form-group">

                <label>
                  Business Address
                </label>

                <input
                  id="business-address"
                  type="text"
                  defaultValue={
                    profile?.businessAddress ||
                    ""
                  }
                  placeholder="Enter business address"
                />

              </div>

            </div>

          </section>

          {/* ===================================================
              ACTIONS
          =================================================== */}

          <div className="edit-profile-actions">

            <Link
              to="/profile"
              className="cancel-profile-btn"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="save-profile-btn"
              disabled={saving}
            >

              {saving ? (
                <>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check size={17} />
                  Changes Saved
                </>
              ) : (
                <>
                  Save Changes
                </>
              )}

            </button>

          </div>

        </form>

      </div>
    </main>
  );
}

export default EditProfile;