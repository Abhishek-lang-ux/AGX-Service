import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./contact.css";

const contactMethods = [
  {
    icon: MessageCircle,
    label: "WhatsApp Assistance",
    value: "+91 9984710087",
    note: "Quick service-related assistance",
    href: "https://wa.me/9984710087",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@agxservices.in",
    note: "For detailed enquiries",
    href: "mailto:contact@agxservices.in",
  },
  {
    icon: Phone,
    label: "Call AGX",
    value: "+91 8601295183 +91 9984710087",
    note: "Speak with the service team",
    href: "tel:+918601295183 +919984710087",
  },
];

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-grid"></div>
        <div className="contact-hero-glow"></div>

        <div className="container contact-hero-inner">
          <div className="contact-eyebrow">
            <span></span>
            AGX SUPPORT & ENQUIRIES
          </div>

          <h1>
            Let&apos;s talk about
            <br />
            <span>what you need.</span>
          </h1>

          <p>
            Have a question about a service, document requirement or your
            request? Send AGX a message and the team can guide you on the
            appropriate next step.
          </p>

          <div className="contact-hero-badges">
            <span><ShieldCheck size={14} /> Structured service support</span>
            <span><Clock3 size={14} /> Request updates through the portal</span>
          </div>
        </div>
      </section>

      <section className="contact-main-section">
        <div className="container contact-main-grid">
          <div className="contact-info">
            <span className="contact-section-label">CONTACT AGX</span>

            <h2>
              One place for
              <br />
              <span>your questions.</span>
            </h2>

            <p>
              Use the channel that works best for you. For an existing service
              request, your Request ID helps the AGX team locate the correct
              request faster.
            </p>

            <div className="contact-method-list">
              {contactMethods.map((method) => {
                const Icon = method.icon;

                return (
                  <a
                    className="contact-method"
                    href={method.href}
                    target={method.href.startsWith("http") ? "_blank" : undefined}
                    rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                    key={method.label}
                  >
                    <div className="contact-method-icon">
                      <Icon size={19} />
                    </div>

                    <div>
                      <small>{method.label}</small>
                      <strong>{method.value}</strong>
                      <span>{method.note}</span>
                    </div>

                    <ArrowRight size={16} />
                  </a>
                );
              })}
            </div>

            <div className="contact-location-card">
              <div className="contact-location-icon">
                <MapPin size={18} />
              </div>
              <div>
                <small>OFFICE / SERVICE LOCATION</small>
                <strong>AGX Services</strong>
                <span>Bara Marg Purvi Lakhpera, Mohammadi Kheri, 262804, Uttar Pradesh</span>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap">
            <div className="contact-form-card">
              <div className="contact-form-head">
                <div className="contact-form-icon">
                  <Send size={20} />
                </div>
                <div>
                  <span>SEND AN ENQUIRY</span>
                  <h2>How can we help?</h2>
                </div>
              </div>

              <p className="contact-form-intro">
                Tell us what you need. This form is currently a frontend
                interface and will be connected to the AGX backend later.
              </p>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <label>
                    Full Name
                    <input type="text" placeholder="Enter your name" />
                  </label>

                  <label>
                    Phone Number
                    <input type="tel" placeholder="+91 XXXXX XXXXX" />
                  </label>
                </div>

                <label>
                  Email Address
                  <input type="email" placeholder="you@example.com" />
                </label>

                <label>
                  What do you need help with?
                  <select defaultValue="">
                    <option value="" disabled>Select a topic</option>
                    <option>Service enquiry</option>
                    <option>Existing request</option>
                    <option>Document requirement</option>
                    <option>Payment / invoice</option>
                    <option>Website / software service</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Request ID <span className="optional">(optional)</span>
                  <input type="text" placeholder="Example: AGX-2026-000145" />
                </label>

                <label>
                  Message
                  <textarea
                    rows="5"
                    placeholder="Briefly describe what you need..."
                  ></textarea>
                </label>

                <button type="submit" className="contact-submit-btn">
                  Send Enquiry
                  <ArrowRight size={16} />
                </button>

                <div className="contact-form-note">
                  <ShieldCheck size={14} />
                  <span>Do not submit sensitive documents through this enquiry form.</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-help-section">
        <div className="container">
          <div className="contact-help-card">
            <div>
              <span className="contact-section-label light">NEED A SERVICE?</span>
              <h2>
                Skip the enquiry.
                <br />
                <span>Start your request.</span>
              </h2>
              <p>
                If you already know what you need, choose a service and follow
                the guided AGX request journey.
              </p>
            </div>

            <Link to="/services" className="contact-help-btn">
              Explore Services
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
