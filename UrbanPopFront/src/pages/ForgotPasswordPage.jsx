import { useState } from "react";
import { Link } from "react-router";

import Header from "../components/Header";
import Footer from "../components/Footer";
import urbanPopLogo from "../assets/logoUrbanPop.png";
import "./LoginPage.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/password-reset/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      let result = {};
      try {
        result = await response.json();
      } catch {
        // Show the friendly error below if the server didn't return JSON.
      }

      if (!response.ok) {
        const emailError = result.email;
        const message = Array.isArray(emailError)
          ? emailError.join(" ")
          : emailError || result.detail || "Could not request a reset link.";

        throw new Error(message);
      }

      setSubmitted(true);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Could not connect. Make sure Django is running.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="storefront auth-page">
      <Header />

      <main className="login-layout">
        <section className="login-brand" aria-label="Urban Pop">
          <img className="login-logo" src={urbanPopLogo} alt="" />
          <h1>Urban Pop</h1>
        </section>

        {submitted ? (
          <section className="login-form signup-success">
            <h2>Check for reset instructions</h2>
            <p>
              If an account uses that email address, reset instructions have
              been sent.
            </p>
            <p>
              In this local demo, look in the Django terminal for the reset
              link.
            </p>
            <Link className="signup-success-link" to="/login">
              Back to Log In
            </Link>
          </section>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Forgot Password?</h2>
            <p>Enter the email address for your Urban Pop account.</p>

            <label>
              Email Address
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>

            <p>
              Remembered your password? <Link to="/login">Log in</Link>
            </p>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ForgotPasswordPage;