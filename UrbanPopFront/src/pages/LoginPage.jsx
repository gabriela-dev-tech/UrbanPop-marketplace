import { useState } from "react";
import { Link } from "react-router";

import Header from "../components/Header";
import Footer from "../components/Footer";
import urbanPopLogo from "../assets/logoUrbanPop.png";
import { apiRequest } from "../services/api";
import "./LoginPage.css";

function LoginPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await apiRequest("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      localStorage.setItem("urbanpop-token", result.token);
      setLoggedIn(true);
    } catch (requestError) {
      setError(
        requestError.message === "Failed to fetch"
          ? "Could not connect to Urban Pop. Make sure Django is running."
          : requestError.message || "Could not log in."
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

        {loggedIn ? (
          <section className="login-form signup-success">
            <h2>Welcome back!</h2>
            <p>You’re logged in to your Urban Pop account.</p>
            <Link className="signup-success-link" to="/">
              Continue shopping
            </Link>
          </section>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Welcome Back!</h2>
            <p>Log in to your account to continue shopping.</p>

            <label>
              Email Address
              <input type="email" name="email" required />
            </label>

            <label>
              Password
              <input type="password" name="password" required />
            </label>

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>

            <p>
              <Link to="/forgot-password">Forgot password?</Link>
            </p>

            <p>
              New to Urban Pop? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;