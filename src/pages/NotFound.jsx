import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Compass,
  Home,
  SearchX,
} from "lucide-react";
import "./not-found.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-container">

        <div className="not-found-icon">
          <SearchX size={28} />
        </div>

        <span className="not-found-label">
          AGX SERVICE PORTAL
        </span>

        <div className="not-found-number">
          404
        </div>

        <h1>Page not found</h1>

        <p>
          The page you're looking for doesn't exist, has been moved,
          or the address may be incorrect.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-home-btn">
            <Home size={17} />
            Go to Home
          </Link>

          <button
            type="button"
            className="not-found-back-btn"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>

        <div className="not-found-help">
          <Compass size={17} />

          <span>
            Need help? Visit our{" "}
            <Link to="/contact">Contact</Link>{" "}
            page for assistance.
          </span>
        </div>

      </div>
    </main>
  );
}

export default NotFound;