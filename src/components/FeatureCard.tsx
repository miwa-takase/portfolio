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
      className="card-surface group relative flex flex-col overflow-hidden rounded-2xl px-6 pb-6 pt-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <span
        className={`absolute inset-y-0 left-0 w-1 ${ACCENT_BG[f.accent]}`}
      />
      <div className="flex items-center justify-between">
        <Badge status={f.status} />
      </div>
      <h3 className="mt-4 font-serif text-2xl font-medium">{f.title}</h3>
      <p className="mt-3 flex-grow text-paper-dim">{f.tagline}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="tex-sm tracking-wide text-muted">
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
