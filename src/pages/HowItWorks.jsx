import {
  ArrowRight,
  CheckCircle2,
  FileText,
  FolderCheck,
  SearchCheck,
  Settings2,
  ShieldCheck,
  UploadCloud,
  UserRound,
  BellRing,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Choose Your Service",
    text: "Select the service you need from the AGX service platform and understand the basic requirements before starting.",
  },
  {
    number: "02",
    icon: UploadCloud,
    title: "Submit Details & Documents",
    text: "Provide the required information and securely submit the documents needed for your selected service.",
  },
  {
    number: "03",
    icon: SearchCheck,
    title: "AGX Reviews & Processes",
    text: "Our team reviews your submission, raises corrections when required, and handles the applicable process.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Track & Receive Result",
    text: "Track your request status and receive the final result or completion update through your AGX account.",
  },
];

function HowItWorks() {
  return (
    <main className="hiw-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hiw-hero">
        <div className="hiw-hero-grid"></div>
        <div className="hiw-hero-glow"></div>

        <div className="container hiw-hero-inner">

          <div className="hiw-eyebrow">
            <span></span>
            SIMPLE • SECURE • TRACKABLE
          </div>

          <h1>
            From Documents
            <br />
            <span>To Done.</span>
          </h1>

          <p>
            AGX makes professional service requests simple.
            Submit your requirements online, stay updated,
            and let our team handle the applicable process.
          </p>

          <div className="hiw-hero-actions">
            <Link to="/services" className="hiw-primary-btn">
              Explore Services
              <ArrowRight size={16} />
            </Link>

            <Link to="/register" className="hiw-secondary-btn">
              Create Account
            </Link>
          </div>

          <div className="hiw-hero-trust">
            <span>
              <ShieldCheck size={14} />
              Secure documents
            </span>

            <span>
              <BellRing size={14} />
              Status updates
            </span>

            <span>
              <UserRound size={14} />
              AGX team support
            </span>
          </div>

        </div>
      </section>


      {/* =====================================================
          4 STEP PROCESS
      ===================================================== */}

      <section className="hiw-steps-section">
        <div className="container">

          <div className="hiw-section-heading">
            <span className="hiw-section-label">
              HOW AGX WORKS
            </span>

            <h2>
              Four simple steps.
              <br />
              <span>One smooth experience.</span>
            </h2>

            <p>
              Everything starts online. You provide the requirements,
              and AGX takes care of the applicable service process.
            </p>
          </div>


          <div className="hiw-steps">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div className="hiw-step" key={step.number}>

                  <div className="hiw-step-number">
                    {step.number}
                  </div>

                  <div className="hiw-step-icon">
                    <Icon size={24} />
                  </div>

                  <div className="hiw-step-content">
                    <span>STEP {step.number}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>

                  {index !== steps.length - 1 && (
                    <div className="hiw-step-connector">
                      <ArrowRight size={16} />
                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>
      </section>


      {/* =====================================================
          DOCUMENT SUBMISSION VISUAL
      ===================================================== */}

      <section className="hiw-showcase-section">
        <div className="container">

          <div className="hiw-showcase">

            <div className="hiw-showcase-copy">

              <span className="hiw-section-label">
                01 — 02
              </span>

              <h2>
                Start with a
                <br />
                <span>simple submission.</span>
              </h2>

              <p>
                Once you choose a service, AGX guides you through
                the information and document requirements. The goal
                is to keep the submission process clear and organized.
              </p>

              <div className="hiw-benefit-list">

                <div>
                  <CheckCircle2 size={17} />
                  Service-specific requirements
                </div>

                <div>
                  <CheckCircle2 size={17} />
                  Organized document submission
                </div>

                <div>
                  <CheckCircle2 size={17} />
                  Clear correction workflow
                </div>

              </div>

            </div>


            <div className="hiw-upload-card">

              <div className="hiw-upload-top">
                <div className="hiw-mini-brand">
                  <img src="./assets/logo.PNG" alt="logo" />
                </div>

                <div>
                  <small>AGX SERVICE PORTAL</small>
                  <strong>Document Submission</strong>
                </div>

                <ShieldCheck size={19} />
              </div>


              <div className="hiw-request-strip">
                <div>
                  <small>SERVICE</small>
                  <strong>GST Filing</strong>
                </div>

                <span>STEP 02 / 04</span>
              </div>


              <div className="hiw-file">
                <div className="hiw-file-icon">
                  <FileText size={19} />
                </div>

                <div>
                  <strong>GST_Documents.pdf</strong>
                  <small>2.4 MB • Ready for review</small>
                </div>

                <CheckCircle2 size={18} />
              </div>


              <div className="hiw-upload-zone">
                <UploadCloud size={27} />
                <strong>Upload required documents</strong>
                <span>PDF, JPG or PNG</span>
              </div>


              <div className="hiw-upload-footer">
                <ShieldCheck size={14} />
                Documents are submitted through your secure request.
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          AGX PROCESSING
      ===================================================== */}

      <section className="hiw-processing-section">
        <div className="container">

          <div className="hiw-processing-grid">

            <div className="hiw-processing-card">

              <div className="hiw-processing-header">
                <div className="hiw-processing-icon">
                  <Settings2 size={20} />
                </div>

                <div>
                  <small>AGX WORKFLOW</small>
                  <strong>Request Processing</strong>
                </div>

                <span className="hiw-live">
                  Active
                </span>
              </div>


              <div className="hiw-workflow-line">

                <div className="hiw-workflow-node done">
                  <CheckCircle2 size={15} />
                </div>

                <div className="hiw-workflow-progress"></div>

                <div className="hiw-workflow-node active">
                  <Settings2 size={15} />
                </div>

                <div className="hiw-workflow-progress faded"></div>

                <div className="hiw-workflow-node">
                  <FolderCheck size={15} />
                </div>

              </div>


              <div className="hiw-workflow-labels">
                <span>Submitted</span>
                <span>Processing</span>
                <span>Completed</span>
              </div>

            </div>


            <div className="hiw-processing-copy">

              <span className="hiw-section-label">
                03 — PROCESS
              </span>

              <h2>
                Your request,
                <br />
                <span>handled by AGX.</span>
              </h2>

              <p>
                After submission, the AGX team reviews your request
                and works through the applicable process. If anything
                needs correction, you can be asked to resubmit the
                required information.
              </p>

              <div className="hiw-status-pills">
                <span>Under Review</span>
                <span>Correction Required</span>
                <span>Processing</span>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          TRACKING
      ===================================================== */}

      <section className="hiw-tracking-section">
        <div className="container">

          <div className="hiw-tracking-card">

            <div className="hiw-tracking-copy">

              <span className="hiw-section-label light">
                04 — TRACKING
              </span>

              <h2>
                Know what is
                <br />
                <span>happening next.</span>
              </h2>

              <p>
                Your request status can move through different stages
                as the AGX team works on it. The portal is designed to
                keep the journey visible from submission to completion.
              </p>

              <Link to="/register" className="hiw-track-btn">
                Get Started
                <ArrowRight size={16} />
              </Link>

            </div>


            <div className="hiw-tracking-panel">

              <div className="hiw-tracking-panel-head">
                <div>
                  <small>REQUEST ID</small>
                  <strong>AGX001248</strong>
                </div>

                <span>Processing</span>
              </div>


              <div className="hiw-timeline">

                <div className="hiw-timeline-item complete">
                  <span></span>
                  <div>
                    <strong>Request Submitted</strong>
                    <small>Information received by AGX</small>
                  </div>
                </div>

                <div className="hiw-timeline-item complete">
                  <span></span>
                  <div>
                    <strong>Documents Reviewed</strong>
                    <small>Initial document review completed</small>
                  </div>
                </div>

                <div className="hiw-timeline-item current">
                  <span></span>
                  <div>
                    <strong>Processing</strong>
                    <small>AGX team is handling the request</small>
                  </div>
                </div>

                <div className="hiw-timeline-item">
                  <span></span>
                  <div>
                    <strong>Completed</strong>
                    <small>Final result will be delivered</small>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          SECURITY
      ===================================================== */}

      <section className="hiw-security-section">
        <div className="container">

          <div className="hiw-security-heading">
            <span className="hiw-section-label">
              BUILT AROUND TRUST
            </span>

            <h2>
              A service journey designed
              <br />
              <span>with clarity and security.</span>
            </h2>
          </div>


          <div className="hiw-security-grid">

            <div className="hiw-security-item">
              <div>
                <ShieldCheck size={21} />
              </div>
              <h3>Secure Submission</h3>
              <p>
                Keep your service documents and request information
                inside your AGX account workflow.
              </p>
            </div>

            <div className="hiw-security-item">
              <div>
                <SearchCheck size={21} />
              </div>
              <h3>Review Before Processing</h3>
              <p>
                Submissions can be reviewed before the applicable
                service process moves forward.
              </p>
            </div>

            <div className="hiw-security-item">
              <div>
                <BellRing size={21} />
              </div>
              <h3>Visible Status</h3>
              <p>
                Track important stages so you know where your
                request currently stands.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="hiw-cta-section">
        <div className="container">

          <div className="hiw-cta">

            <div>
              <span>READY TO GET STARTED?</span>

              <h2>
                Choose a service.
                <br />
                Let AGX handle the rest.
              </h2>
            </div>

            <Link to="/services" className="hiw-cta-btn">
              Explore Services
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

export default HowItWorks;
