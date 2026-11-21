import { useState } from "react";
import { Route, Routes } from "react-router";

import Header from "./components/Header";
import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import ArtistSection from "./components/ArtistSection";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ApplicationReceivedPage from "./pages/ApplicationReceivedPage";
import ArtistApplicationPage from "./pages/ArtistApplicationPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";

import "./App.css";

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  function handleCategorySelect(category) {
    setSelectedCategory((currentCategory) =>
      currentCategory === category ? "All" : category
    );
  }

  return (
    <div className="storefront">
      <Header />

      <main>
        <Hero />

        <div className="catalog" id="shop">
          <CategorySection onSelectCategory={handleCategorySelect} />
          <ProductSection selectedCategory={selectedCategory} />
        </div>

        <ArtistSection />

        <section className="about-section" id="about">
          <h2>About Urban Pop</h2>
          <p>
            Urban Pop brings affordable finds and unique artist-made pieces
            together, so everyone can express their own style.
          </p>
          <p>
            We help independent tattoo and jewelry artists share their work
            with a wider community.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/artist-application"
          element={<ArtistApplicationPage />}
        />
        <Route
          path="/application-received"
          element={<ApplicationReceivedPage />}
        />
      </Routes>
    </CartProvider>
  );
}

export default App;