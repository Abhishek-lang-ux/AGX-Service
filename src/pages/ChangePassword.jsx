import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./change-password.css";

function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const passwordValid =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[0-9]/.test(newPassword);

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!passwordValid) {
      setError(
        "New password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number."
      );
      return;
    }

    if (!passwordsMatch) {
      setError("New password and confirmation password do not match.");
      return;
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 2500);
  };

  return (
    <main className="change-password-page">
      <div className="change-password-container">

        {/* Top */}
        <div className="change-password-top">
          <Link to="/settings" className="change-password-back">
            <ArrowLeft size={17} />
            Back to Settings
          </Link>

          <span>SECURITY / PASSWORD</span>
        </div>


        {/* Header */}
        <section className="change-password-header">
          <div className="change-password-icon">
            <KeyRound size={23} />
          </div>

          <div>
            <span>ACCOUNT SECURITY</span>
            <h1>Change Password</h1>
            <p>
              Create a strong password to keep your AGX account secure.
            </p>
          </div>
        </section>


        <div className="change-password-layout">

          {/* Form */}
          <section className="password-card">

            <div className="password-card-heading">
              <span>PASSWORD UPDATE</span>
              <h2>Update your password</h2>
            </div>


            <form onSubmit={handleSubmit}>

              {/* Current */}
              <div className="password-form-group">

                <label>Current Password</label>

                <div className="password-input">
                  <LockKeyhole size={17} />

                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    aria-label="Show current password"
                  >
                    {showCurrent ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

              </div>


              {/* New */}
              <div className="password-form-group">

                <label>New Password</label>

                <div className="password-input">
                  <KeyRound size={17} />

                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    aria-label="Show new password"
                  >
                    {showNew ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

              </div>


              {/* Password Requirements */}
              <div className="password-requirements">

                <div
                  className={
                    newPassword.length >= 8 ? "requirement valid" : "requirement"
                  }
                >
                  <span />
                  At least 8 characters
                </div>

                <div
                  className={
                    /[A-Z]/.test(newPassword)
                      ? "requirement valid"
                      : "requirement"
                  }
                >
                  <span />
                  One uppercase letter
                </div>

                <div
                  className={
                    /[a-z]/.test(newPassword)
                      ? "requirement valid"
                      : "requirement"
                  }
                >
                  <span />
                  One lowercase letter
                </div>

                <div
                  className={
                    /[0-9]/.test(newPassword)
                      ? "requirement valid"
                      : "requirement"
                  }
                >
                  <span />
                  One number
                </div>

              </div>


              {/* Confirm */}
              <div className="password-form-group">

                <label>Confirm New Password</label>

                <div className="password-input">
                  <KeyRound size={17} />

                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label="Show confirmation password"
                  >
                    {showConfirm ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                {confirmPassword && (
                  <small
                    className={
                      passwordsMatch
                        ? "password-match"
                        : "password-not-match"
                    }
                  >
                    {passwordsMatch
                      ? "Passwords match."
                      : "Passwords do not match."}
                  </small>
                )}

              </div>


              {error && (
                <div className="password-error">
                  {error}
                </div>
              )}


              {saved && (
                <div className="password-success">
                  <CheckCircle2 size={17} />
                  Password updated successfully.
                </div>
              )}


              <div className="password-actions">

                <Link to="/settings" className="password-cancel">
                  Cancel
                </Link>

                <button type="submit" className="password-save">
                  <ShieldCheck size={16} />
                  Update Password
                </button>

              </div>

            </form>

          </section>


          {/* Security Info */}
          <aside className="password-security-card">

            <div className="security-info-icon">
              <ShieldCheck size={21} />
            </div>

            <span>SECURITY TIP</span>

            <h2>Keep your account protected</h2>

            <p>
              Use a password that is unique to your AGX account and avoid
              sharing it with anyone.
            </p>


            <div className="security-tip-list">

              <div>
                <CheckCircle2 size={15} />
                Use a unique password
              </div>

              <div>
                <CheckCircle2 size={15} />
                Avoid common words
              </div>

              <div>
                <CheckCircle2 size={15} />
                Never share your password
              </div>

              <div>
                <CheckCircle2 size={15} />
                Update it if you suspect compromise
              </div>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}

export default ChangePassword;