import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Clock3,
  Upload,
  ClipboardCheck,
  Settings2,
  Sparkles,
  LockKeyhole,
  Check,
  ChevronRight,
} from "lucide-react";
import "../index.css";
import Abhishek from "../assets/Abhishek.jpeg";
import Akash from "../assets/Akash.PNG";

function Home() {
  const services = [
    {
      icon: FileText,
      title: "Income Tax Filing",
      text: "Simple and guided tax filing assistance.",
      tag: "Tax",
    },
    {
      icon: ClipboardCheck,
      title: "GST Services",
      text: "GST registration, filing and compliance support.",
      tag: "GST",
    },
    {
      icon: ShieldCheck,
      title: "PAN Services",
      text: "Get assistance with PAN related services.",
      tag: "Popular",
    },
    {
      icon: Settings2,
      title: "Accounting",
      text: "Reliable accounting and business support.",
      tag: "Business",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Choose a Service",
      text: "Select the service you need from our service catalogue.",
    },
    {
      number: "02",
      icon: Upload,
      title: "Submit Documents",
      text: "Upload your required documents and provide the details.",
    },
    {
      number: "03",
      icon: ClipboardCheck,
      title: "AGX Processes",
      text: "Our team reviews your request and handles the applicable process.",
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "Get the Result",
      text: "Track your request and receive the final result digitally.",
    },
  ];

  return (
    <main className="home-page">
      {/* ================= HERO ================= */}
      <section className="home-hero">
        <div className="home-hero-grid"></div>
        <div className="home-glow home-glow-one"></div>
        <div className="home-glow home-glow-two"></div>

        <div className="container home-hero-container">
          <div className="home-hero-content">
            <div className="home-eyebrow">
              <span className="eyebrow-dot"></span>
              AGX Digital Service Platform
            </div>

            <h1>
              Your Services.
              <br />
              <span>Handled Smarter.</span>
            </h1>

            <p>
              Tax, compliance, documentation and digital services — submit
              your requirements online and let the AGX team handle the process
              from one secure place.
            </p>

            <div className="home-hero-actions">
              <Link to="/services" className="home-primary-btn">
                Explore Services
                <ArrowRight size={17} />
              </Link>

              <Link to="/how-it-works" className="home-secondary-btn">
                How It Works
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="home-trust-row">
              <div className="trust-item">
                <CheckCircle2 size={15} />
                <span>Simple Process</span>
              </div>

              <div className="trust-item">
                <ShieldCheck size={15} />
                <span>Secure Documents</span>
              </div>

              <div className="trust-item">
                <Clock3 size={15} />
                <span>Track Requests</span>
              </div>
            </div>
          </div>

          {/* ================= HERO SERVICE CARD ================= */}
          <div className="home-dashboard-wrap">
            <div className="hero-service-card">
              <div className="hero-service-header">
                <div className="hero-service-icon">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <span>AGX SERVICE PORTAL</span>
                  <strong>Your service, simplified.</strong>
                </div>
              </div>

              <div className="hero-service-intro">
                <span className="hero-service-label">HOW IT WORKS</span>

                <h3>
                  Get your service done
                  <br />
                  <span>without the hassle.</span>
                </h3>

                <p>
                  Choose a service, submit your details and documents, and
                  track your request online.
                </p>
              </div>

              <div className="hero-service-steps">
                <div className="hero-step">
                  <div className="hero-step-number">1</div>

                  <div>
                    <strong>Choose a Service</strong>
                    <span>Select the service you need.</span>
                  </div>
                </div>

                <div className="hero-step">
                  <div className="hero-step-number">2</div>

                  <div>
                    <strong>Submit Documents</strong>
                    <span>Provide your required details securely.</span>
                  </div>
                </div>

                <div className="hero-step">
                  <div className="hero-step-number">3</div>

                  <div>
                    <strong>Track Your Request</strong>
                    <span>Stay updated until completion.</span>
                  </div>
                </div>
              </div>

              <Link to="/services" className="hero-service-button">
                Browse Services
                <ArrowRight size={16} />
              </Link>

              <div className="hero-service-trust">
                <ShieldCheck size={15} />
                <span>Secure • Simple • Transparent</span>
              </div>
            </div>

            {/* Floating notification */}
            <div className="dashboard-floating-card">
              <div className="floating-check">
                <Check size={17} />
              </div>

              <div>
                <strong>Ready to get started?</strong>
                <span>Choose a service and submit your request</span>
              </div>

              <Sparkles size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="home-trust-strip">
        <div className="container">
          <div className="trust-strip-content">
            <div>
              <strong>One platform.</strong>
              <span>Multiple digital services.</span>
            </div>

            <div className="trust-strip-divider"></div>

            <div className="trust-stat">
              <strong>Simple</strong>
              <span>Online submission</span>
            </div>

            <div className="trust-stat">
              <strong>Secure</strong>
              <span>Document handling</span>
            </div>

            <div className="trust-stat">
              <strong>Transparent</strong>
              <span>Request tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="home-services-section">
        <div className="container">
          <div className="home-section-heading">
            <div>
              <span className="home-section-label">OUR SERVICES</span>

              <h2>
                Everything you need,
                <span> in one place.</span>
              </h2>
            </div>

            <Link to="/services" className="section-view-link">
              View all services
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="home-services-grid">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  to="/services"
                  className="home-service-card"
                  key={service.title}
                >
                  <div className="service-card-icon">
                    <Icon size={21} />
                  </div>

                  <div className="service-card-tag">{service.tag}</div>

                  <h3>{service.title}</h3>

                  <p>{service.text}</p>

                  <div className="service-card-link">
                    Explore service
                    <ArrowRight size={15} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="home-process-section">
        <div className="container">
          <div className="process-heading">
            <span className="home-section-label">HOW IT WORKS</span>

            <h2>
              From documents to result,
              <span> made simple.</span>
            </h2>

            <p>
              A straightforward process designed to make your service requests
              easier to manage.
            </p>
          </div>

          <div className="home-process-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div className="home-process-card" key={step.number}>
                  <div className="process-number">{step.number}</div>

                  <div className="process-icon">
                    <Icon size={20} />
                  </div>

                  <h3>{step.title}</h3>

                  <p>{step.text}</p>

                  {index !== steps.length - 1 && (
                    <div className="process-connector">
                      <ArrowRight size={15} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WHY AGX ================= */}
      <section className="home-why-section">
        <div className="container home-why-grid">
          <div className="why-visual">
            <div className="why-main-card">
              <div className="why-card-header">
                <div>
                  <small>AGX</small>
                  <strong>Service Journey</strong>
                </div>

                <div className="why-live">
                  <span></span>
                  Live
                </div>
              </div>

              <div className="journey-line">
                <div className="journey-step completed-journey">
                  <span>✓</span>

                  <div>
                    <strong>Request Submitted</strong>
                    <small>Your documents were received</small>
                  </div>
                </div>

                <div className="journey-step completed-journey">
                  <span>✓</span>

                  <div>
                    <strong>Document Review</strong>
                    <small>AGX team reviewed your request</small>
                  </div>
                </div>

                <div className="journey-step current-journey">
                  <span>3</span>

                  <div>
                    <strong>Processing</strong>
                    <small>Your request is being processed</small>
                  </div>
                </div>

                <div className="journey-step">
                  <span>4</span>

                  <div>
                    <strong>Completed</strong>
                    <small>Final result will be delivered</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="why-mini-card">
              <ShieldCheck size={19} />

              <div>
                <strong>Secure by design</strong>
                <span>Privacy-focused document handling</span>
              </div>
            </div>
          </div>

          <div className="why-content">
            <span className="home-section-label">WHY AGX</span>

            <h2>
              Less paperwork.
              <br />
              <span>More clarity.</span>
            </h2>

            <p>
              AGX brings your service requests, documents, payments and status
              updates into a single organized experience.
            </p>

            <div className="why-points">
              <div className="why-point">
                <div>
                  <Check size={15} />
                </div>

                <section>
                  <strong>Submit everything online</strong>
                  <span>
                    Provide documents and information without unnecessary
                    visits.
                  </span>
                </section>
              </div>

              <div className="why-point">
                <div>
                  <Check size={15} />
                </div>

                <section>
                  <strong>Know what is happening</strong>
                  <span>
                    Follow your request through clear status updates.
                  </span>
                </section>
              </div>

              <div className="why-point">
                <div>
                  <Check size={15} />
                </div>

                <section>
                  <strong>Keep everything organized</strong>
                  <span>
                    Access your requests, documents and results from one place.
                  </span>
                </section>
              </div>
            </div>

            <Link to="/about" className="why-link">
              Learn more about AGX
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOUNDERS ================= */}
      <section className="home-founders-section">
        <div className="container">
          <div className="home-founders-heading">
            <span className="home-section-label">THE PEOPLE BEHIND AGX</span>
            <h2>
              Meet Our <span>Founders.</span>
            </h2>
            <p>
              AGX is built with a simple vision — making professional services
              easier, more transparent and accessible through technology.
            </p>
          </div>

          <div className="home-founders-grid">
            <article className="home-founder-card">
              <div className="home-founder-image-wrap">
                <img
                  src={Abhishek}
                  alt="Portrait of Abhishek Awasthi, Founder of AGX"
                  className="home-founder-image"
                />
                <div className="home-founder-overlay"></div>
                <div className="home-founder-info">
                  <span>FOUNDER</span>
                  <h3>Abhishek Awasthi</h3>
                  <strong>Founder &amp; Operations</strong>
                  <p>
                    Helping build AGX through efficient operations,
                    client support and a commitment to dependable service.
                  </p>
                </div>
              </div>
            </article>

            <article className="home-founder-card">
              <div className="home-founder-image-wrap">
                <img
                  src={Akash}
                  alt="portrait for AGX Founder"
                  className="home-founder-image"
                />
                <div className="home-founder-overlay"></div>
                <div className="home-founder-info">
                  <span>FOUNDER</span>
                  <h3>Akash Awasthi</h3>
                  <strong>Founder &amp; CEO</strong>
                  <p>
                    Driving AGX with a focus on professional services,
                    technology and a better client experience.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Founder section styles — kept here so no other CSS file needs to be changed */}
      <style>{`
        .home-founders-section {
          position: relative;
          padding: 100px 0;
          background: #f8fbff;
          overflow: hidden;
        }

        .home-founders-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(37, 99, 235, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.045) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .home-founders-heading {
          position: relative;
          z-index: 1;
          max-width: 720px;
          margin: 0 auto 48px;
          text-align: center;
        }

        .home-founders-heading h2 {
          margin: 10px 0 14px;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.08;
          letter-spacing: -1.5px;
          color: #0b1220;
        }

        .home-founders-heading h2 span {
          color: #2563eb;
        }

        .home-founders-heading p {
          max-width: 650px;
          margin: 0 auto;
          color: #64748b;
          font-size: 16px;
          line-height: 1.7;
        }

        .home-founders-grid {
          position: relative;
          z-index: 1;
          max-width: 980px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px;
        }

        .home-founder-card {
          min-width: 0;
          border-radius: 20px;
          overflow: hidden;
          background: #dce6f0;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.14);
          border: 1px solid rgba(148, 163, 184, 0.25);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .home-founder-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 25px 55px rgba(15, 23, 42, 0.2);
        }

        .home-founder-image-wrap {
          position: relative;
          height: 500px;
          overflow: hidden;
          background: linear-gradient(145deg, #cbd5e1, #eef2f7);
        }

        .home-founder-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center top;
          filter: saturate(0.9);
          transition: transform 0.45s ease;
        }

        .home-founder-card:hover .home-founder-image {
          transform: scale(1.035);
        }

        .home-founder-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(4, 15, 31, 0) 35%,
            rgba(4, 15, 31, 0.08) 48%,
            rgba(3, 35, 67, 0.9) 100%
          );
        }

        .home-founder-info {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 28px 30px 30px;
          color: #fff;
        }

        .home-founder-info > span {
          display: inline-block;
          margin-bottom: 7px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: rgba(255, 255, 255, 0.72);
        }

        .home-founder-info h3 {
          margin: 0 0 5px;
          font-size: 28px;
          line-height: 1.15;
          color: #fff;
        }

        .home-founder-info strong {
          display: block;
          font-size: 14px;
          color: #dbeafe;
        }

        .home-founder-info p {
          max-width: 430px;
          margin: 11px 0 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 13px;
          line-height: 1.55;
        }

        @media (max-width: 760px) {
          .home-founders-section {
            padding: 72px 0;
          }

          .home-founders-heading {
            margin-bottom: 34px;
          }

          .home-founders-grid {
            grid-template-columns: 1fr;
            max-width: 520px;
          }

          .home-founder-image-wrap {
            height: 470px;
          }
        }

        @media (max-width: 480px) {
          .home-founder-image-wrap {
            height: 430px;
          }

          .home-founder-info {
            padding: 24px 22px 24px;
          }

          .home-founder-info h3 {
            font-size: 24px;
          }
        }
      `}</style>

      {/* ================= SECURITY ================= */}
      <section className="home-security-section">
        <div className="container">
          <div className="security-box">
            <div className="security-icon">
              <ShieldCheck size={28} />
            </div>

            <div className="security-content">
              <span>YOUR DOCUMENTS MATTER</span>

              <h2>
                Built around trust,
                <br />
                privacy and transparency.
              </h2>

              <p>
                Your service journey should be clear and organized. AGX is
                designed around secure document handling, controlled access
                and transparent request tracking.
              </p>
            </div>

            <div className="security-points">
              <div>
                <LockKeyhole size={17} />
                <span>Secure document handling</span>
              </div>

              <div>
                <ShieldCheck size={17} />
                <span>Privacy-focused workflow</span>
              </div>

              <div>
                <CheckCircle2 size={17} />
                <span>Clear request status</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="home-cta-section">
        <div className="container">
          <div className="home-cta-box">
            <div className="cta-glow"></div>

            <div className="cta-content">
              <span>READY TO GET STARTED?</span>

              <h2>
                Your next service request
                <br />
                starts with <em>AGX.</em>
              </h2>

              <p>
                Choose a service, submit your requirements and let us take it
                from there.
              </p>

              <div className="cta-actions">
                <Link to="/services" className="cta-primary">
                  Browse Services
                  <ArrowRight size={17} />
                </Link>

                <Link to="/contact" className="cta-secondary">
                  Talk to AGX
                </Link>
              </div>
            </div>

            <div className="cta-pattern"></div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;