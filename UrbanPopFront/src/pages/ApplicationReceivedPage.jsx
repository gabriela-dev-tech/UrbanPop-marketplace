import { Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import urbanPopLogo from "../assets/logoUrbanPop.png";
import artistImage from "../assets/Artists application.jpg";
import "./ApplicationReceivedPage.css";

function ApplicationReceivedPage() {
  return (
    <div className="storefront auth-page">
      <Header />

      <main className="application-received-layout">
        <section className="artist-brand" aria-label="Urban Pop">
          <img src={urbanPopLogo} alt="" />
          <h2>Urban Pop</h2>
        </section>

        <section className="application-received-panel">
          <div>
            <h1>Application received!</h1>
            <p>We’ll review your work and contact you by email.</p>
            <Link className="back-home-link" to="/">
              Back to Home
            </Link>
          </div>

          <img
            src={artistImage}
            alt="An artist making handmade jewelry"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ApplicationReceivedPage;