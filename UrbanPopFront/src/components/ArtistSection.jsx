import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "./ArtistSection.css";

function ArtistSection() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArtists() {
      try {
        const data = await apiRequest("/api/artists/approved/");
        setArtists(data);
      } catch (loadError) {
        setError(
          loadError.message === "Failed to fetch"
            ? "Could not load artists. Make sure Django is running."
            : loadError.message || "Could not load artists."
        );
      } finally {
        setLoading(false);
      }
    }

    loadArtists();
  }, []);

  return (
    <section className="artists" id="artists">
      <h2>Meet the Artists</h2>
      <p>Discover tattoo art and handmade jewelry by independent artists.</p>

      <div className="artist-list">
        {loading && <p>Loading artists…</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && artists.length === 0 && (
          <p>No approved artists yet.</p>
        )}

        {!loading &&
          !error &&
          artists.map((artist) => (
            <article className="artist-card" key={artist.artist_name}>
              <h3>{artist.artist_name}</h3>
              <p>{artist.category}</p>

              {artist.portfolio && (
                <a href={artist.portfolio} target="_blank" rel="noreferrer">
                  View portfolio
                </a>
              )}
            </article>
          ))}
      </div>
    </section>
  );
}

export default ArtistSection;