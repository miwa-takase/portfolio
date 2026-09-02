import { Link } from "react-router-dom";
import { DesignMode, designModes } from "../lib/designMode";

const navLink =
  "site-nav-link text-sm tracking-wide text-white transition-colors hover:text-accent-soft";

type TopBarProps = {
  designMode: DesignMode;
  onDesignModeChange: (mode: DesignMode) => void;
};

export default function TopBar({
  designMode,
  onDesignModeChange,
}: TopBarProps) {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-line-soft bg-ink/70 pt-4 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between">
        <Link
          to="/"
          className="site-logo font-serif text-lg tracking-widest text-white"
        >
          Judy<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden gap-7 sm:flex">
            <Link to="/" className={navLink}>
              Home
            </Link>
            <Link to="/about" className={navLink}>
              About
            </Link>
            <Link to="/works" className={navLink}>
              Works
            </Link>
          </nav>
          <div
            className="design-selector inline-flex rounded-full border border-line-soft bg-ink/60 p-1 backdrop-blur"
            aria-label="Design selector"
          >
            {designModes.map((mode) => (
              <button
                key={mode.value}
                className={`design-selector-option rounded-full px-3 py-1.5 text-sm font-semibold tracking-wide transition-colors ${
                  designMode === mode.value
                    ? "design-selector-active bg-accent text-ink"
                    : "text-paper-dim hover:text-accent-soft"
                }`}
                type="button"
                onClick={() => onDesignModeChange(mode.value)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
