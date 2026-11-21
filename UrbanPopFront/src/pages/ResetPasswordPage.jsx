import { useState } from "react";
import { Link, useSearchParams } from "react-router";

import Header from "../components/Header";
import Footer from "../components/Footer";
import urbanPopLogo from "../assets/logoUrbanPop.png";
import "./LoginPage.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/password-reset/confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid,
            token,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        },
      );

      let result = {};
      try {
        result = await response.json();
      } catch {
        // Show a friendly message if the server didn't return JSON.
      }

      if (!response.ok) {
        const detail =
          result.detail ||
          result.new_password ||
          result.confirm_password ||
          "Could not reset the password. The link may be invalid or expired.";

        throw new Error(Array.isArray(detail) ? detail.join(" ") : detail);
      }

      localStorage.removeItem("urbanpop-token");
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

  const hasResetLink = Boolean(uid && token);

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
            <h2>Password Reset</h2>
            <p>Your password has been changed. Please log in.</p>
            <Link className="signup-success-link" to="/login">
              Go to Log In
            </Link>
          </section>
        ) : !hasResetLink ? (
          <section className="login-form">
            <h2>Reset Link Missing</h2>
            <p>This password-reset link is incomplete.</p>
            <Link to="/forgot-password">Request another link</Link>
          </section>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Choose a New Password</h2>
            <p>Enter and confirm your new password.</p>

            <label>
              New Password
              <input
                type="password"
                name="new_password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            <label>
              Confirm New Password
              <input
                type="password"
                name="confirm_password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
            </label>

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ResetPasswordPage;