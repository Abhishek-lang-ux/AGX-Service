import { ArrowLeft, Camera, Check, Mail, Phone, UserRound } from "lucide-react";
import { apiRequest, updateStoredUser } from "../lib/api.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./editProfile.css";

function EditProfile() {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await apiRequest("/profile");
        if (!active) return;
        setProfile(data.profile);
      } catch (error) {
        if (active) setApiError(error.message || "Unable to load profile");
      } finally {
        if (active) setLoadingProfile(false);
      }
    }

    loadProfile();
    return () => { active = false; };
  }, []);

  const saveProfileToApi = async (payload) => {
    setSaving(true);
    setApiError("");
    setSaveMessage("");

    try {
      await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const fresh = await apiRequest("/profile");
      setProfile(fresh.profile);
      updateStoredUser({
        id: fresh.profile.id,
        uuid: fresh.profile.uuid,
        email: fresh.profile.email,
        role: fresh.profile.role,
        status: fresh.profile.status,
        firstName: fresh.profile.firstName,
        lastName: fresh.profile.lastName,
      });
      setSaveMessage("Profile updated successfully.");
    } catch (error) {
      setApiError(error.message || "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="edit-profile-page">
      <div className="edit-profile-container">

        <div className="edit-profile-top">
          <Link to="/profile" className="edit-profile-back">
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <span className="edit-profile-label">
            ACCOUNT / PROFILE
          </span>
        </div>


        <section className="edit-profile-header">
          <div>
            <span className="edit-profile-eyebrow">
              PERSONAL INFORMATION
            </span>

            <h1>Edit Profile</h1>

            <p>
              Update your personal information associated with your AGX account.
            </p>
          </div>
        </section>


        
        {loadingProfile && <div className="profile-api-status">Loading saved profile…</div>}
        {apiError && <div className="profile-api-error" role="alert">{apiError}</div>}
        {saveMessage && <div className="profile-api-success" role="status">{saveMessage}</div>}
<form onSubmit={handleSave}>

          {/* Profile Photo */}
          <section className="edit-profile-card">

            <div className="edit-profile-card-title">
              <div>
                <span>PROFILE PHOTO</span>
                <h2>Your Profile</h2>
              </div>
            </div>

            <div className="edit-photo-area">

              <div className="edit-photo">
                AA

                <button type="button" title="Change photo">
                  <Camera size={15} />
                </button>
              </div>

              <div>
                <strong>Akash Awasthi</strong>
                <p>
                  JPG, PNG or WEBP. Recommended size: 400 × 400px.
                </p>

                <button type="button" className="change-photo-btn">
                  Change Photo
                </button>
              </div>

            </div>

          </section>


          {/* Personal Details */}
          <section className="edit-profile-card">

            <div className="edit-profile-card-title">
              <div>
                <span>PERSONAL DETAILS</span>
                <h2>Basic Information</h2>
              </div>

              <UserRound size={19} />
            </div>


            <div className="edit-form-grid">

              <div className="edit-form-group">
                <label>Full Name</label>

                <div className="edit-input-wrap">
                  <UserRound size={16} />

                  <input
                    type="text"
                    defaultValue="Akash Awasthi"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>


              <div className="edit-form-group">
                <label>Email Address</label>

                <div className="edit-input-wrap">
                  <Mail size={16} />

                  <input
                    type="email"
                    defaultValue="your@email.com"
                    placeholder="Enter your email"
                  />
                </div>

                <small>
                  Your email is used for important account notifications.
                </small>
              </div>


              <div className="edit-form-group">
                <label>Mobile Number</label>

                <div className="edit-input-wrap">
                  <Phone size={16} />

                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>


              <div className="edit-form-group">
                <label>Account Type</label>

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


          {/* Business */}
          <section className="edit-profile-card">

            <div className="edit-profile-card-title">
              <div>
                <span>BUSINESS DETAILS</span>
                <h2>Business Information</h2>
              </div>
            </div>


            <div className="edit-form-grid">

              <div className="edit-form-group">
                <label>Business / Organization</label>

                <input
                  type="text"
                  placeholder="Enter business name"
                />
              </div>


              <div className="edit-form-group">
                <label>PAN</label>

                <input
                  type="text"
                  placeholder="Enter PAN"
                  maxLength="10"
                />
              </div>


              <div className="edit-form-group">
                <label>GSTIN</label>

                <input
                  type="text"
                  placeholder="Enter GSTIN"
                  maxLength="15"
                />
              </div>


              <div className="edit-form-group">
                <label>Business Address</label>

                <input
                  type="text"
                  placeholder="Enter business address"
                />
              </div>

            </div>

          </section>


          {/* Actions */}
          <div className="edit-profile-actions">

            <Link to="/profile" className="cancel-profile-btn">
              Cancel
            </Link>

            <button type="submit" className="save-profile-btn">
              {saved ? (
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

export default EditProfile
