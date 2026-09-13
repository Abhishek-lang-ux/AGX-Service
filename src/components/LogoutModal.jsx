import { useState } from "react";
import { LogOut, ShieldCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./logout-modal.css";
import { clearAuthSession } from "../lib/api.js";

function LogoutModal({ isOpen, onClose, onLogout }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleLogout = () => {
    setLoggingOut(true);

    clearAuthSession();

    setTimeout(() => {
        onLogout?.();
      navigate("/", { replace: true });
    }, 500);
  };

  return (
    <div
      className="logout-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="logout-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
      >
        <button
          type="button"
          className="logout-modal-close"
          onClick={onClose}
          aria-label="Close logout dialog"
        >
          <X size={18} />
        </button>

        <div className="logout-modal-icon">
          <LogOut size={23} />
        </div>

        <div className="logout-modal-content">
          <span className="logout-modal-label">
            ACCOUNT SECURITY
          </span>

          <h2 id="logout-title">Sign out of AGX?</h2>

          <p>
            Are you sure you want to sign out of your AGX Service Portal
            account?
          </p>
        </div>

        <div className="logout-security-note">
          <ShieldCheck size={17} />

          <span>
            You can sign back in anytime using your registered account.
          </span>
        </div>

        <div className="logout-modal-actions">
          <button
            type="button"
            className="logout-cancel-btn"
            onClick={onClose}
            disabled={loggingOut}
          >
            Cancel
          </button>

          <button
            type="button"
            className="logout-confirm-btn"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={16} />

            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;