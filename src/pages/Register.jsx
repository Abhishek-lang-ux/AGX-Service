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
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { apiRequest, setAuthSession } from "../lib/api.js";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phone,
        }),
      });

      setAuthSession(data.token, data.user, false);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

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
                <Sparkles size={14} />
                CREATE YOUR CLIENT ACCOUNT
              </div>

              <h1>
                Your services,
                <span> organised digitally.</span>
              </h1>

              <p>
                Create your AGX client account and keep your service requests,
                documents, payments and updates connected in one place.
              </p>

              <div className="register-feature-list">
                <div>
                  <div className="register-feature-icon">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <strong>Manage Service Requests</strong>
                    <span>Keep your ongoing requirements organised.</span>
                  </div>
                </div>

                <div>
                  <div className="register-feature-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong>Secure Client Experience</strong>
                    <span>Built around responsible information handling.</span>
                  </div>
                </div>

                <div>
                  <div className="register-feature-icon">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <strong>Track Progress</strong>
                    <span>Stay updated as your request moves forward.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="register-info-footer">
              <span>© {new Date().getFullYear()} AGX Services</span>
              <span>Professional Digital Assistance</span>
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
                  <UserRound size={21} />
                </div>

                <div>
                  <span>GET STARTED</span>
                  <h2>Create your account</h2>
                </div>
              </div>

              <p className="register-card-description">
                Enter your details to create your AGX client account.
              </p>

              <form className="register-form" onSubmit={handleSubmit}>
                {error && <div className="auth-form-error" role="alert">{error}</div>}
                <div className="register-field">
                  <label htmlFor="register-name">Full Name</label>

                  <div className="register-input-wrap">
                    <UserRound size={16} />
                    <input
                      id="register-name"
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
                    <label htmlFor="register-email">Email Address</label>

                    <div className="register-input-wrap">
                      <Mail size={16} />
                      <input
                        id="register-email"
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
                    <label htmlFor="register-phone">Phone Number</label>

                    <div className="register-input-wrap">
                      <Phone size={16} />
                      <input
                        id="register-phone"
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
                    <label htmlFor="register-password">Password</label>

                    <div className="register-input-wrap">
                      <LockKeyhole size={16} />

                      <input
                        id="register-password"
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
                    <label htmlFor="register-confirm-password">
                      Confirm Password
                    </label>

                    <div className="register-input-wrap">
                      <LockKeyhole size={16} />

                      <input
                        id="register-confirm-password"
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
                            ? "Hide password"
                            : "Show password"
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
                    required
                  />
                  <span>
                    I agree to the AGX terms of service and acknowledge the
                    privacy policy.
                  </span>
                </label>

                <button type="submit" className="register-submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="register-login">
                <span>Already have an AGX account?</span>

                <Link to="/login">
                  Sign In
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="register-security-note">
              <ShieldCheck size={15} />
              <span>Secure account experience for AGX clients.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
