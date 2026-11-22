import { useState } from "react";
import { useNavigate } from "react-router";

import Header from "../components/Header";
import Footer from "../components/Footer";
import artistImage from "../assets/Artists application.jpg";
import urbanPopLogo from "../assets/logoUrbanPop.png";
import { apiRequest } from "../services/api";
import "./ArtistApplicationPage.css";

function ArtistApplicationPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSending(true);

    const formData = new FormData(event.currentTarget);

    const application = {
      artist_name: formData.get("artistName"),
      email: formData.get("email"),
      category: formData.get("category"),
      portfolio: formData.get("portfolio"),
      about_work: formData.get("aboutWork"),
    };

    try {
      await apiRequest("/api/artists/applications/", {
        method: "POST",
        body: JSON.stringify(application),
      });

      navigate("/application-received");
    } catch (submitError) {
      setError(
        submitError.message === "Failed to fetch"
          ? "Could not connect to Urban Pop. Make sure Django is running."
          : submitError.message ||
              "The application could not be submitted. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="storefront auth-page">
      <Header />

      <main className="artist-application-layout">
        <section className="artist-brand" aria-label="Urban Pop">
          <img src={urbanPopLogo} alt="" />
          <h2>Urban Pop</h2>
        </section>

        <section className="artist-application-panel">
          <div className="artist-application-copy">
            <h1>Sell with Urban Pop!</h1>
            <p>Apply to join our Artist Marketplace!</p>
            <p>
              There’s no monthly fee to join. UrbanPop earns a 10% commission
              when you make a sale.
            </p>

            <form onSubmit={handleSubmit}>
              <label>
                Artist or Studio Name
                <input type="text" name="artistName" required />
              </label>

              <label>
                Contact Email
                <input type="email" name="email" required />
              </label>

              <label>
                Product Category
                <input type="text" name="category" required />
              </label>

              <label>
                Portfolio or Social Link
                <input type="url" name="portfolio" />
              </label>

              <label>
                Tell us about your work
                <textarea name="aboutWork" rows="4" required />
              </label>

              <button type="submit" disabled={isSending}>
                {isSending ? "Sending…" : "Submit Application"}
              </button>

              {error && <p role="alert">{error}</p>}
            </form>

            <p className="application-note">
              We’ll review your application and contact you by email.
            </p>
          </div>

          <img
            className="artist-application-image"
            src={artistImage}
            alt="An artist making handmade jewelry"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ArtistApplicationPage;