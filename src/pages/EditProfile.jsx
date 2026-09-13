import {
  ArrowLeft,
  Camera,
  Check,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import { apiRequest, updateStoredUser } from "../lib/api.js";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./editProfile.css";

function EditProfile() {
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef("");

  const [profile, setProfile] = useState(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const [apiError, setApiError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saved, setSaved] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    bio: "",
  });

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoadingProfile(true);
        setApiError("");

        const data = await apiRequest("/profile");

        if (!active) return;

        const p = data.profile || {};

        setProfile(p);

        setForm({
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          phone: p.phone || "",
          dateOfBirth: p.dateOfBirth
            ? String(p.dateOfBirth).slice(0, 10)
            : "",
          addressLine1: p.addressLine1 || "",
          addressLine2: p.addressLine2 || "",
          city: p.city || "",
          state: p.state || "",
          postalCode: p.postalCode || "",
          country: p.country || "India",
          bio: p.bio || "",
        });

        /*
         * Backend returns avatarPath.
         */
        if (p.avatarPath) {
          setPhotoPreview(p.avatarPath);
        } else {
          setPhotoPreview("");
        }
      } catch (error) {
        if (active) {
          setApiError(
            error.message || "Unable to load profile",
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

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     DISPLAY NAME
  ========================================================= */

  const displayName =
    [form.firstName, form.lastName]
      .filter(Boolean)
      .join(" ") ||
    profile?.email ||
    "AGX Client";

  /* =========================================================
     INITIALS
  ========================================================= */

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "AA";

  /* =========================================================
     OPEN FILE PICKER
  ========================================================= */

  const openPhotoPicker = () => {
    if (saving) return;

    fileInputRef.current?.click();
  };

  /* =========================================================
     PHOTO CHANGE
  ========================================================= */

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setApiError("");
    setSaveMessage("");
    setSaved(false);

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setApiError(
        "Invalid image. Please select a JPG, PNG or WEBP file.",
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setApiError(
        "Profile photo must be less than 5 MB.",
      );

      event.target.value = "";
      return;
    }

    /*
     * Remove previous temporary preview URL.
     */
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);

    previewUrlRef.current = previewUrl;

    setSelectedPhoto(file);
    setPhotoPreview(previewUrl);
  };

  /* =========================================================
     REMOVE SELECTED PHOTO
  ========================================================= */

  const handleRemoveSelectedPhoto = () => {
    setSelectedPhoto(null);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    /*
     * Restore the photo currently saved on server.
     */
    setPhotoPreview(profile?.avatarPath || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const handleSave = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setApiError("");
    setSaveMessage("");
    setSaved(false);

    try {
      /*
       * Backend requires firstName.
       */
      if (!form.firstName.trim()) {
        setApiError("First name is required.");
        setSaving(false);
        return;
      }

      let response;

      /* =====================================================
         WITH PHOTO
      ===================================================== */

      if (selectedPhoto) {
        const formData = new FormData();

        formData.append(
          "profileImage",
          selectedPhoto,
        );

        formData.append(
          "firstName",
          form.firstName.trim(),
        );

        formData.append(
          "lastName",
          form.lastName.trim(),
        );

        formData.append(
          "phone",
          form.phone.trim(),
        );

        formData.append(
          "dateOfBirth",
          form.dateOfBirth,
        );

        formData.append(
          "addressLine1",
          form.addressLine1.trim(),
        );

        formData.append(
          "addressLine2",
          form.addressLine2.trim(),
        );

        formData.append(
          "city",
          form.city.trim(),
        );

        formData.append(
          "state",
          form.state.trim(),
        );

        formData.append(
          "postalCode",
          form.postalCode.trim(),
        );

        formData.append(
          "country",
          form.country.trim() || "India",
        );

        formData.append(
          "bio",
          form.bio.trim(),
        );

        /*
         * IMPORTANT:
         * Do NOT manually set Content-Type.
         * Browser creates multipart boundary automatically.
         */
        response = await apiRequest("/profile", {
          method: "PUT",
          body: formData,
        });
      }

      /* =====================================================
         WITHOUT PHOTO
      ===================================================== */

      else {
        response = await apiRequest("/profile", {
          method: "PUT",
          body: JSON.stringify({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            phone: form.phone.trim(),
            dateOfBirth: form.dateOfBirth,
            addressLine1: form.addressLine1.trim(),
            addressLine2: form.addressLine2.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            postalCode: form.postalCode.trim(),
            country: form.country.trim() || "India",
            bio: form.bio.trim(),
          }),
        });
      }

      /*
       * Reload profile from backend.
       */
      const fresh = await apiRequest("/profile");

      const freshProfile = fresh.profile;

      setProfile(freshProfile);

      setForm({
        firstName: freshProfile.firstName || "",
        lastName: freshProfile.lastName || "",
        phone: freshProfile.phone || "",
        dateOfBirth: freshProfile.dateOfBirth
          ? String(freshProfile.dateOfBirth).slice(0, 10)
          : "",
        addressLine1: freshProfile.addressLine1 || "",
        addressLine2: freshProfile.addressLine2 || "",
        city: freshProfile.city || "",
        state: freshProfile.state || "",
        postalCode: freshProfile.postalCode || "",
        country: freshProfile.country || "India",
        bio: freshProfile.bio || "",
      });

      /*
       * Update stored login user.
       */
      updateStoredUser({
        id: freshProfile.id,
        uuid: freshProfile.uuid,
        email: freshProfile.email,
        role: freshProfile.role,
        status: freshProfile.status,
        firstName: freshProfile.firstName,
        lastName: freshProfile.lastName,
        profileImage: freshProfile.avatarPath || "",
        avatarPath: freshProfile.avatarPath || "",
      });

      /*
       * Show saved server photo.
       */
      setPhotoPreview(
        freshProfile.avatarPath || "",
      );

      setSelectedPhoto(null);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = "";
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSaveMessage(
        response?.message ||
          "Profile updated successfully.",
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      setApiError(
        error.message || "Unable to save profile",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

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
            STATUS
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
                  initials
                )}

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

              {/* First Name */}

              <div className="edit-form-group">
                <label>
                  First Name
                </label>

                <div className="edit-input-wrap">
                  <UserRound size={16} />

                  <input
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    autoComplete="given-name"
                  />
                </div>
              </div>

              {/* Last Name */}

              <div className="edit-form-group">
                <label>
                  Last Name
                </label>

                <div className="edit-input-wrap">
                  <UserRound size={16} />

                  <input
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    autoComplete="family-name"
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
                    value={profile?.email || ""}
                    placeholder="Your email"
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
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    autoComplete="tel"
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
                    value={
                      profile?.role
                        ? `${profile.role}`
                        : "Client Account"
                    }
                    disabled
                    readOnly
                  />
                </div>

                <small>
                  Account type cannot be changed.
                </small>
              </div>

              {/* Date of Birth */}

              <div className="edit-form-group">
                <label>
                  Date of Birth
                </label>

                <input
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              {/* Address */}

              <div className="edit-form-group">
                <label>
                  Address
                </label>

                <input
                  name="addressLine1"
                  type="text"
                  value={form.addressLine1}
                  onChange={handleChange}
                  placeholder="Address line 1"
                />
              </div>

              <div className="edit-form-group">
                <label>
                  Address Line 2
                </label>

                <input
                  name="addressLine2"
                  type="text"
                  value={form.addressLine2}
                  onChange={handleChange}
                  placeholder="Address line 2"
                />
              </div>

              {/* City */}

              <div className="edit-form-group">
                <label>
                  City
                </label>

                <input
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>

              {/* State */}

              <div className="edit-form-group">
                <label>
                  State
                </label>

                <input
                  name="state"
                  type="text"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
              </div>

              {/* Postal Code */}

              <div className="edit-form-group">
                <label>
                  Postal Code
                </label>

                <input
                  name="postalCode"
                  type="text"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                />
              </div>

              {/* Country */}

              <div className="edit-form-group">
                <label>
                  Country
                </label>

                <input
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </div>

            </div>
          </section>

          {/* ===================================================
              BIO
          =================================================== */}

          <section className="edit-profile-card">

            <div className="edit-profile-card-title">
              <div>
                <span>ABOUT YOU</span>
                <h2>Profile Bio</h2>
              </div>
            </div>

            <div className="edit-form-group">
              <label>
                Bio
              </label>

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us something about yourself..."
                rows={5}
              />
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
              disabled={saving || loadingProfile}
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