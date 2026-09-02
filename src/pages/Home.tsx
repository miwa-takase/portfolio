import TerminalConsole from "../components/TerminalConsole";
import SpotifyNowPlaying from "../demos/SpotifyNowPlaying";

export default function Home() {
  return (
    <section className="home-screen wrap">
      <header className="home-intro">
        <h1
          className="display-title reveal font-serif text-5xl font-medium leading-tight md:text-7xl lg:text-8xl"
          style={{ animationDelay: ".08s" }}
        >
          <span className="italic text-accent-soft">Judy</span> and _
        </h1>
      </header>

      <div className="home-utilities">
        <section
          aria-labelledby="home-terminal-title"
          className="home-terminal reveal"
          style={{ animationDelay: ".26s" }}
        >
          <h2
            id="home-terminal-title"
            className="mb-5 text-sm uppercase tracking-widest text-white"
          >
            Terminal
          </h2>
          <TerminalConsole />
        </section>

        <div
          className="home-now-playing reveal"
          style={{ animationDelay: ".34s" }}
        >
          <SpotifyNowPlaying />
        </div>
      </div>
    </section>
  );
}
