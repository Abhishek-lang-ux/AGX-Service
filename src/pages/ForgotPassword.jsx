import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./password-reset.css";
import { forgotPassword } from "../lib/api.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to send the reset link. Please try again.",
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
                ACCOUNT RECOVERY
              </div>

              <h1>
                Get back into
                <span> your account.</span>
              </h1>

              <p>
                Enter your registered email address and we&apos;ll send you a
                secure link to create a new AGX Services password.
              </p>

              <div className="login-benefits">
                <div>
                  <div className="login-benefit-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong>Secure Recovery</strong>
                    <span>Reset links are protected and time-limited.</span>
                  </div>
                </div>

                <div>
                  <div className="login-benefit-icon">
                    <LockKeyhole size={18} />
                  </div>
                  <div>
                    <strong>One-Time Link</strong>
                    <span>Each reset link can be used only once.</span>
                  </div>
                </div>

                <div>
                  <div className="login-benefit-icon">
                    <Mail size={18} />
                  </div>
                  <div>
                    <strong>Email Verification</strong>
                    <span>The reset link is delivered to your email.</span>
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
              {!sent ? (
                <>
                  <div className="login-card-header">
                    <div className="login-card-icon">
                      <LockKeyhole size={21} />
                    </div>

                    <div>
                      <span>PASSWORD RECOVERY</span>
                      <h2>Forgot password?</h2>
                    </div>
                  </div>

                  <p className="login-card-description">
                    Enter the email address linked to your AGX account.
                  </p>

                  <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                      <div className="auth-form-error" role="alert">
                        {error}
                      </div>
                    )}

                    <div className="login-field">
                      <label htmlFor="forgot-email">Email Address</label>

                      <div className="login-input-wrap">
                        <Mail size={17} />
                        <input
                          id="forgot-email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="login-submit"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                      {!loading && <ArrowRight size={18} />}
                    </button>
                  </form>

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
                    CHECK YOUR EMAIL
                  </span>

                  <h2>Reset link sent</h2>

                  <p>
                    If an AGX account exists for this email, a password reset
                    link has been sent. Please check your inbox and spam
                    folder.
                  </p>

                  <Link to="/login" className="login-submit password-success-btn">
                    Back to Sign In
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

export default ForgotPassword;
