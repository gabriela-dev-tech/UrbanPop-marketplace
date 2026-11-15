import { Link } from "react-router";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer" >
      <div className="footer-brand">
        <p>© {new Date().getFullYear()} Urban Pop</p>
        <Link to="/artist-application">Apply to Sell</Link>
      </div>

      <section className="footer-contact" id="contact">
        <h2>Contact</h2>
        <a href="mailto:hello@urbanpop.example">
          hello@urbanpop.example
        </a>
      </section>

      <section className="footer-social" id="social">
        <h2>Follow Urban Pop</h2>

        <nav aria-label="Social links">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            <span>Instagram</span>
            <span>@urbanpop.style</span>
          </a>

          <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">
            <span>TikTok</span>
            <span>@urbanpop.finds</span>
          </a>

          <a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">
            <span>Pinterest</span>
            <span>UrbanPop Finds</span>
          </a>
        </nav>
      </section>
    </footer>
  );
}

export default Footer;