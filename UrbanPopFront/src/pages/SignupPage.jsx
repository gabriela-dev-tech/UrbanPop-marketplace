import { useState } from "react";
import { Link } from "react-router";

import Header from "../components/Header";
import Footer from "../components/Footer";
import urbanPopLogo from "../assets/logoUrbanPop.png";
import "./LoginPage.css";

function SignupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const firstError = Object.values(result)
          .flat()
          .find((message) => typeof message === "string");

        throw new Error(firstError || "Could not create your account.");
      }

      setSubmitted(true);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Could not connect to Urban Pop. Make sure Django is running.",
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
            <h2>Account Created!</h2>
            <p>Your Urban Pop account is ready.</p>
            <Link className="signup-success-link" to="/login">
              Go to Log In
            </Link>
          </section>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <p>Join the community. Discover your style.</p>

            <label>
              Name
              <input type="text" name="name" required />
            </label>

            <label>
              Email
              <input type="email" name="email" required />
            </label>

            <label>
              Password
              <input type="password" name="password" required minLength="8" />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                required
                minLength="8"
              />
            </label>

            {error && <p className="signup-error">{error}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create an Account"}
            </button>

            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default SignupPage;