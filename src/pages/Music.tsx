import { Link } from "react-router-dom";
import SpotifyNowPlaying from "../demos/SpotifyNowPlaying";

export default function Music() {
  return (
    <section className="wrap py-16">
      <nav className="breadcrumb flex items-center gap-2 text-xs tracking-wide text-muted">
        <Link to="/" className="text-paper-dim hover:text-accent-soft">
          Home
        </Link>
        <span className="text-line">/</span>
        <span className="text-paper-dim">Music</span>
      </nav>

      <div className="mt-10 max-w-2xl">
        <div className="text-xs uppercase tracking-widest text-accent">
          Spotify
        </div>
        <h1 className="display-title mt-2 font-serif text-4xl font-medium leading-tight md:text-6xl">
          Music
        </h1>
        <p className="mt-4 text-base text-paper-dim">
          Spotify の再生状況を表示します
        </p>
      </div>

      <div className="mt-8 max-w-2xl">
        <SpotifyNowPlaying />
      </div>

      <section
        className="mt-12 max-w-2xl"
        aria-labelledby="favorite-music-title"
      >
        <h2
          id="favorite-music-title"
          className="mb-5 text-xs uppercase tracking-widest text-muted"
        >
          Favorite Music
        </h2>
        <div className="utility-frame min-h-48" />
      </section>
    </section>
  );
}
