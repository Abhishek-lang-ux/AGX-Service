import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { apiRequest, setAuthSession } from "../lib/api.js";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setAuthSession(data.token, data.user, remember);
      const role = data.user?.role;

      if (role === "superadmin") {
        navigate("/superadmin", { replace: true });
      } else if (role === "distributor") {
        navigate("/distributor/dashboard", { replace: true });
      } else if (role === "retailer") {
        navigate("/retailer/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
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
                CLIENT SERVICE PORTAL
              </div>

              <h1>
                Everything you need,
                <span> in one place.</span>
              </h1>

              <p>
                Sign in to manage your service requests, documents, payments
                and updates through the AGX digital experience.
              </p>

              <div className="login-benefits">
                <div>
                  <div className="login-benefit-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong>Secure Experience</strong>
                    <span>Designed for protected client information.</span>
                  </div>
                </div>

                <div>
                  <div className="login-benefit-icon">
                    <LockKeyhole size={18} />
                  </div>
                  <div>
                    <strong>Track Your Requests</strong>
                    <span>Keep your service activity organised.</span>
                  </div>
                </div>

                <div>
                  <div className="login-benefit-icon">
                    <UserRoundPlus size={18} />
                  </div>
                  <div>
                    <strong>One Client Account</strong>
                    <span>Access your AGX services from one dashboard.</span>
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

            <div className="login-card">
              <div className="login-card-header">
                <div className="login-card-icon">
                  <LockKeyhole size={21} />
                </div>

                <div>
                  <span>WELCOME BACK</span>
                  <h2>Sign in to AGX</h2>
                </div>
              </div>

              <p className="login-card-description">
                Enter your account details to continue to your client portal.
              </p>

              <form onSubmit={handleSubmit} className="login-form">
                {error && <div className="auth-form-error" role="alert">{error}</div>}
                <div className="login-field">
                  <label htmlFor="login-email">Email Address</label>

                  <div className="login-input-wrap">
                    <Mail size={17} />
                    <input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="login-field">
                  <div className="login-label-row">
                    <label htmlFor="login-password">Password</label>

                    <Link to="/forgot-password">Forgot password?</Link>
                  </div>

                  <div className="login-input-wrap">
                    <LockKeyhole size={17} />

                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <label className="remember-row">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <button type="submit" className="login-submit" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="login-divider">
                <span>or continue with</span>
              </div>

              <div className="login-social-grid">
                <button type="button" className="login-social-btn">
                  <span className="google-symbol">G</span>
                  Google
                </button>

                <button type="button" className="login-social-btn">
                  <span className="facebook-symbol">f</span>
                  Facebook
                </button>
              </div>

              <div className="login-register">
                <span>Don’t have an AGX account?</span>
                <Link to="/register">
                  Create Account
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <br />
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

export default Login;
