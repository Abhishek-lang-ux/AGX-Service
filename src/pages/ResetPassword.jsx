import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import "./password-reset.css";
import { resetPassword } from "../lib/api.js";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(
    () => searchParams.get("token") || "",
    [searchParams],
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("This password reset link is invalid or missing.");
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This password reset link is invalid or missing.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to reset your password. Please request a new link.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page password-reset-page">
      <section className="login-shell">
        <div className="container login-grid">
          <div className="login-brand-panel">
            <Link to="/" className="login-brand">
              <span className="login-brand-mark">AGX</span>
              <span>Services</span>
            </Link>

            <div className="login-brand-content">
              <div className="login-eyebrow">
                <Sparkles size={14} />
                SECURE PASSWORD RESET
              </div>

              <h1>
                Create a new
                <span> secure password.</span>
              </h1>

              <p>
                Choose a strong password for your AGX Services client account
                and continue securely to your portal.
              </p>

              <div className="login-benefits">
                <div>
                  <div className="login-benefit-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong>Protected Account</strong>
                    <span>Your password is securely hashed before storage.</span>
                  </div>
                </div>

                <div>
                  <div className="login-benefit-icon">
                    <LockKeyhole size={18} />
                  </div>
                  <div>
                    <strong>Minimum 8 Characters</strong>
                    <span>Use a strong password you have not used elsewhere.</span>
                  </div>
                </div>

                <div>
                  <div className="login-benefit-icon">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <strong>One-Time Reset</strong>
                    <span>This recovery link is valid for one password reset.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="login-brand-footer">
              <span>© {new Date().getFullYear()} AGX Services</span>
              <span>Professional Digital Assistance</span>
            </div>
          </div>

          <div className="login-form-area">
            <div className="login-mobile-brand">
              <Link to="/" className="login-brand">
                <span className="login-brand-mark">AGX</span>
                <span>Services</span>
              </Link>
            </div>

            <div className="login-card password-reset-card">
              {!success ? (
                <>
                  <div className="login-card-header">
                    <div className="login-card-icon">
                      <LockKeyhole size={21} />
                    </div>

                    <div>
                      <span>NEW PASSWORD</span>
                      <h2>Reset password</h2>
                    </div>
                  </div>

                  <p className="login-card-description">
                    Create a new password for your AGX Services account.
                  </p>

                  <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                      <div className="auth-form-error" role="alert">
                        {error}
                      </div>
                    )}

                    <div className="login-field">
                      <label htmlFor="reset-password">New Password</label>

                      <div className="login-input-wrap">
                        <LockKeyhole size={17} />
                        <input
                          id="reset-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          minLength={8}
                          required
                          disabled={!token}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() =>
                            setShowPassword((value) => !value)
                          }
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          disabled={!token}
                        >
                          {showPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="login-field">
                      <label htmlFor="reset-confirm-password">
                        Confirm Password
                      </label>

                      <div className="login-input-wrap">
                        <LockKeyhole size={17} />
                        <input
                          id="reset-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          minLength={8}
                          required
                          disabled={!token}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() =>
                            setShowConfirmPassword((value) => !value)
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          disabled={!token}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="login-submit"
                      disabled={loading || !token}
                    >
                      {loading ? "Updating..." : "Update Password"}
                      {!loading && <ArrowRight size={18} />}
                    </button>
                  </form>

                  <div className="password-reset-hint">
                    Your reset link expires after 30 minutes and can only be
                    used once.
                  </div>

                  <div className="password-back-link">
                    <Link to="/login">
                      <ArrowLeft size={15} />
                      Back to Sign In
                    </Link>
                  </div>
                </>
              ) : (
                <div className="password-reset-success">
                  <div className="password-success-icon">
                    <CheckCircle2 size={28} />
                  </div>

                  <span className="password-success-label">
                    PASSWORD UPDATED
                  </span>

                  <h2>Password reset successful</h2>

                  <p>
                    Your AGX Services password has been updated successfully.
                    You can now sign in with your new password.
                  </p>

                  <Link to="/login" className="login-submit password-success-btn">
                    Sign In
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </div>

            <div className="login-security-note">
              <ShieldCheck size={15} />
              <span>Your account and documents are designed to stay protected.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ResetPassword;
