import { useState } from "react";
import { Link } from "react-router";

import logoNav from "../assets/logoNav.png";
import { useCart } from "../context/useCart";
import "./Header.css";

function Header() {
  const { itemCount } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("urbanpop-token")),
  );

  function handleLogout() {
    localStorage.removeItem("urbanpop-token");
    setIsLoggedIn(false);
  }

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Urban Pop home">
        <img className="brand-icon" src={logoNav} alt="" />
        <span className="brand-name">Urban Pop</span>
      </a>

      <nav className="main-nav" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <a href="/#shop">Shop</a>
        <a href="/#artists">Artists</a>
        <a href="/#about">About</a>

        {isLoggedIn ? (
          <a href="/" onClick={handleLogout}>
            Log Out
          </a>
        ) : (
          <Link to="/login">Log In</Link>
        )}

        <Link to="/cart">Cart ({itemCount})</Link>
      </nav>
    </header>
  );
}

export default Header;