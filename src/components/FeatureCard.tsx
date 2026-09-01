import { Link } from "react-router-dom";
import type { Feature } from "../data/features";
import { ACCENT_BG, ACCENT_TEXT } from "../data/features";
import { APPS_BY_ID } from "../data/apps";
import Badge from "./Badge";

export default function FeatureCard({ feature: f }: { feature: Feature }) {
  const appCount = f.apps.filter((id) => APPS_BY_ID[id]).length;
  const primaryAppId = f.apps.find((id) => APPS_BY_ID[id]);

  return (
    <Link
      to={primaryAppId ? `/works/${primaryAppId}/${f.slug}` : "/works"}
      className="card-surface group relative flex flex-col overflow-hidden rounded-2xl px-6 pb-[22px] pt-[26px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_50px_-28px_rgba(0,0,0,0.85)]"
    >
      <span
        className={`absolute inset-y-0 left-0 w-[3px] ${ACCENT_BG[f.accent]}`}
      />
      <div className="flex items-center justify-between">
        <span className="font-serif tracking-[0.1em] text-muted">{f.no}</span>
        <Badge status={f.status} />
      </div>
      <div
        className={`mt-4 text-xs uppercase tracking-[0.22em] ${ACCENT_TEXT[f.accent]}`}
      >
        {f.en}
      </div>
      <h3 className="mt-2 font-serif text-2xl font-medium">{f.title}</h3>
      <p className="mt-3 flex-grow text-paper-dim">{f.tagline}</p>
      <div className="mt-[18px] flex items-center justify-between">
        <span className="text-xs tracking-[0.06em] text-muted">
          {appCount ? `${appCount} アプリで実装` : ""}
        </span>
        <span
          className={`text-lg transition-transform group-hover:translate-x-1 ${ACCENT_TEXT[f.accent]}`}
        >
          →
        </span>
      </div>
    </Link>
  );
}
