import heroImage from "../assets/Popyourownway.jpg";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <h1>Pop your own way</h1>
        <p>
          Discover unique finds, artist-made accessories, and everyday essentials.
        </p>
        <a className="button" href="#shop">Find your style</a>
      </div>

      <img
        className="hero-image"
        src={heroImage}
        alt="Urban Pop shoppers exploring unique finds"
      />
    </section>
  );
}

export default Hero;