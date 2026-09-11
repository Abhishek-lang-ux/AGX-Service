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
              Tax, compliance, documentation and digital services —
              submit your requirements online and let the AGX team
              handle the process from one secure place.
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


          {/* ================= DASHBOARD VISUAL ================= */}
          <div className="home-dashboard-wrap">

            <div className="dashboard-orbit orbit-one"></div>
            <div className="dashboard-orbit orbit-two"></div>

            <div className="home-dashboard">

              <div className="dashboard-topbar">

                <div className="dashboard-brand">
                  <div className="dashboard-logo">
                    <span>AG</span>X
                  </div>

                  <div>
                    <small>AGX SERVICE PORTAL</small>
                    <strong>Service Overview</strong>
                  </div>
                </div>

                <div className="dashboard-user">
                  <span></span>
                </div>

              </div>


              <div className="dashboard-welcome">
                <div>
                  <span>Good morning</span>
                  <strong>Welcome to AGX</strong>
                </div>

                <div className="dashboard-secure-badge">
                  <ShieldCheck size={14} />
                  Secure
                </div>
              </div>


              <div className="dashboard-stat-grid">

                <div className="dashboard-stat">
                  <span>Total Requests</span>
                  <strong>24</strong>
                  <small>All requests</small>
                </div>

                <div className="dashboard-stat active-stat">
                  <span>Processing</span>
                  <strong>08</strong>
                  <small>In progress</small>
                </div>

                <div className="dashboard-stat">
                  <span>Completed</span>
                  <strong>16</strong>
                  <small>Successfully done</small>
                </div>

              </div>


              <div className="dashboard-section-heading">
                <div>
                  <span>RECENT REQUESTS</span>
                  <strong>Track your services</strong>
                </div>

                <span className="view-all">View all</span>
              </div>


              <div className="dashboard-request">

                <div className="request-icon-box gst-icon">
                  GST
                </div>

                <div className="dashboard-request-info">
                  <strong>GST Filing</strong>
                  <small>Request #AGX001248</small>
                </div>

                <div className="dashboard-status processing-status">
                  Processing
                </div>

                <div className="request-line">
                  <span className="line-complete"></span>
                  <span className="line-complete"></span>
                  <span className="line-active"></span>
                  <span></span>
                </div>

                <div className="request-labels">
                  <small>Submitted</small>
                  <small>Review</small>
                  <small>Processing</small>
                  <small>Completed</small>
                </div>

              </div>


              <div className="dashboard-request compact-request">

                <div className="request-icon-box pan-icon">
                  PAN
                </div>

                <div className="dashboard-request-info">
                  <strong>PAN Card Service</strong>
                  <small>Request #AGX001247</small>
                </div>

                <div className="dashboard-status completed-status">
                  Completed
                </div>

              </div>


              <div className="dashboard-footer">

                <div>
                  <LockKeyhole size={14} />
                  <span>Your documents are protected</span>
                </div>

                <span>AGX</span>

              </div>

            </div>


            {/* Floating notification */}
            <div className="dashboard-floating-card">

              <div className="floating-check">
                <Check size={17} />
              </div>

              <div>
                <strong>Request Updated</strong>
                <span>GST request is under processing</span>
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
              <span className="home-section-label">
                OUR SERVICES
              </span>

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

                  <div className="service-card-tag">
                    {service.tag}
                  </div>

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

            <span className="home-section-label">
              HOW IT WORKS
            </span>

            <h2>
              From documents to result,
              <span> made simple.</span>
            </h2>

            <p>
              A straightforward process designed to make
              your service requests easier to manage.
            </p>

          </div>


          <div className="home-process-grid">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div className="home-process-card" key={step.number}>

                  <div className="process-number">
                    {step.number}
                  </div>

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

            <span className="home-section-label">
              WHY AGX
            </span>

            <h2>
              Less paperwork.
              <br />
              <span>More clarity.</span>
            </h2>

            <p>
              AGX brings your service requests, documents,
              payments and status updates into a single
              organized experience.
            </p>


            <div className="why-points">

              <div className="why-point">
                <div>
                  <Check size={15} />
                </div>

                <section>
                  <strong>Submit everything online</strong>
                  <span>
                    Provide documents and information without unnecessary visits.
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
                Your service journey should be clear and
                organized. AGX is designed around secure
                document handling, controlled access and
                transparent request tracking.
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
                Choose a service, submit your requirements
                and let us take it from there.
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