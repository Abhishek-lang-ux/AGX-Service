import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { apiRequest } from "../lib/api.js";

function DistributorRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [distributorCode, setDistributorCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");if (!/^AGX-D\d{3,}$/i.test(distributorCode.trim())) {
      setError("Please enter a valid Distributor ID.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please accept the terms and privacy policy.");
      return;
    }

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ") || null;

    setLoading(true);

    try {
      await apiRequest("/auth/register-distributor", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phone,
        }),
      });

      setSubmitted(true);
    } catch (requestError) {
      setError(
        requestError.message || "Unable to submit your distributor application."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="register-page">
        <section className="register-shell">
          <div className="container register-form-area">
            <div className="register-card">
              <div className="register-card-header">
                <div className="register-card-icon">
                  <CheckCircle2 size={21} />
                </div>
                <div>
                  <span>APPLICATION SUBMITTED</span>
                  <h2>Distributor request received</h2>
                </div>
              </div>

              <p className="register-card-description">
                Your distributor account is currently pending approval. Once
                approved by AGX, you will be able to log in and access the
                distributor portal.
              </p>

              <button
                type="button"
                className="register-submit"
                onClick={() => navigate("/login")}
              >
                Continue to Login
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="register-page">
      <section className="register-shell">
        <div className="container register-grid">
          <div className="register-info">
            <Link to="/" className="register-brand">
              <span className="register-brand-mark">AGX</span>
              <span>Services</span>
            </Link>

            <div className="register-info-content">
              <div className="register-eyebrow">
                <Store size={14} />
                BECOME AN AGX DISTRIBUTOR
              </div>

              <h1>
                Grow your business,
                <span> with AGX Services.</span>
              </h1>

              <p>
                Register as an AGX distributor and access professional digital
                assistance services designed for distributor partners.
              </p>

              <div className="register-feature-list">
                <div>
                  <div className="register-feature-icon">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <strong>Distributor Service Access</strong>
                    <span>Access AGX services through your distributor portal.</span>
                  </div>
                </div>

                <div>
                  <div className="register-feature-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong>Approval-Based Account</strong>
                    <span>Your distributor account is activated after review.</span>
                  </div>
                </div>

                <div>
                  <div className="register-feature-icon">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <strong>Dedicated Distributor Experience</strong>
                    <span>Manage your distributor activities digitally.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="register-info-footer">
              <span>© {new Date().getFullYear()} AGX Services</span>
              <span>Distributor Partner Program</span>
            </div>
          </div>

          <div className="register-form-area">
            <div className="register-mobile-brand">
              <Link to="/" className="register-brand">
                <span className="register-brand-mark">AGX</span>
                <span>Services</span>
              </Link>
            </div>

            <div className="register-card">
              <div className="register-card-header">
                <div className="register-card-icon">
                  <Store size={21} />
                </div>

                <div>
                  <span>DISTRIBUTOR REGISTRATION</span>
                  <h2>Become a Distributor</h2>
                </div>
              </div>

              <p className="register-card-description">
                Submit your details. Your distributor account will be activated
                after SuperAdmin approval.
              </p>

              <form className="register-form" onSubmit={handleSubmit}>
                {error && (
                  <div className="auth-form-error" role="alert">
                    {error}
                  </div>
                )}<div className="register-field">
                  <label htmlFor="distributor-register-name">Full Name</label>
                  <div className="register-input-wrap">
                    <UserRound size={16} />
                    <input
                      id="distributor-register-name"
                      type="text"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="register-two-column">
                  <div className="register-field">
                    <label htmlFor="distributor-register-email">
                      Email Address
                    </label>
                    <div className="register-input-wrap">
                      <Mail size={16} />
                      <input
                        id="distributor-register-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="register-field">
                    <label htmlFor="distributor-register-phone">
                      Phone Number
                    </label>
                    <div className="register-input-wrap">
                      <Phone size={16} />
                      <input
                        id="distributor-register-phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="register-two-column">
                  <div className="register-field">
                    <label htmlFor="distributor-register-password">
                      Password
                    </label>
                    <div className="register-input-wrap">
                      <LockKeyhole size={16} />
                      <input
                        id="distributor-register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="register-password-toggle"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="register-field">
                    <label htmlFor="distributor-register-confirm-password">
                      Confirm Password
                    </label>
                    <div className="register-input-wrap">
                      <LockKeyhole size={16} />
                      <input
                        id="distributor-register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="register-password-toggle"
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <label className="register-terms">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <span>
                    I agree to the terms and privacy policy.
                  </span>
                </label>

                <button
                  type="submit"
                  className="register-submit"
                  disabled={loading}
                >
                  {loading ? "Submitting Application..." : "Submit Distributor Application"}
                  {!loading && <ArrowRight size={17} />}
                </button>
              </form>

              <div className="register-login-link">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DistributorRegister;
