import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { APPS, type App } from "../data/apps";

function AppWorkCard({ app }: { app: App }) {
  return (
    <Link
      to={`/works/${app.id}`}
      className="works-app-card card-surface group relative flex flex-col overflow-hidden rounded-2xl px-6 pb-6 pt-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-accent" />
      <h3 className="font-serif text-2xl font-medium italic">{app.title}</h3>
      <p className="mt-3 flex-grow text-paper-dim">
        {app.overview ?? "概要文が未入力です"}
        {app.wip && (
          <span className="ml-2 inline-flex rounded-md border border-line-soft px-2 py-0.5 align-middle text-xs leading-5 tracking-wide text-muted">
            WIP
          </span>
        )}
      </p>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs tracking-wide text-muted">詳細を見る</span>
        <span className="text-lg text-accent transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

export default function Works() {
  return (
    <section className="wrap">
      <Breadcrumb items={[{ label: "Works" }]} className="pt-8" />

      <h1 className="display-title pt-6 font-serif text-4xl font-medium italic leading-tight md:text-5xl lg:text-6xl">
        Applications
      </h1>
      <p className="mt-4 max-w-2xl text-base text-paper-dim">
        このデバイス上の各アプリを起点に整理しました
        <br />
        カードから詳細へ進み、そこでスクリーンショット・キャプチャと機能サンプルを確認できます
      </p>

      <div className="works-cards-area -mx-5 mt-5 px-5 pb-10 sm:-mx-7 sm:px-7">
        <div className="flex items-center justify-end py-2 text-xs tracking-wide text-muted">
          {APPS.length} アプリ
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {APPS.map((app) => (
            <AppWorkCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}
