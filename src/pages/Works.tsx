import { Link } from "react-router-dom";
import { FEATURES } from "../data/features";
import { SKILLS } from "../data/skills";
import FeatureCard from "../components/FeatureCard";

export default function Works() {
  return (
    <section className="wrap">
      <nav className="flex items-center gap-2.5 pt-[30px] text-[0.76rem] tracking-[0.06em] text-muted">
        <Link to="/" className="text-paper-dim hover:text-accent-soft">
          Home
        </Link>
        <span className="text-line">/</span>
        <span className="text-paper-dim">Works</span>
      </nav>

      <div className="pt-[22px]">
        <div className="text-[0.74rem] uppercase tracking-[0.34em] text-accent">
          Tech Stack
        </div>
        <h2 className="mt-2.5 font-serif text-[2rem] font-medium">
          技術スタック
        </h2>
      </div>
      <p className="mt-3.5 max-w-[680px] text-[1.02rem] text-paper-dim">
        フロントからバックエンド、クラウド、AI連携まで一通りを一人で組み上げます。
      </p>
      <div className="mt-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {SKILLS.map((s) => (
          <div key={s.h} className="card-surface rounded-xl p-[18px]">
            <h4 className="mb-2 font-serif text-[1.05rem] font-medium">
              {s.h}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {s.items.map((i) => (
                <span
                  key={i}
                  className="rounded-[5px] border border-line-soft bg-ink-2 px-2 py-[3px] text-[0.7rem] text-paper-dim"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 border-t border-line-soft pt-[30px]">
        <div className="text-[0.74rem] uppercase tracking-[0.34em] text-accent">
          Capabilities
        </div>
        <h2 className="mt-2.5 font-serif text-[2rem] font-medium">機能一覧</h2>
      </div>
      <p className="mt-3.5 max-w-[680px] text-[1.02rem] text-paper-dim">
        「どんな機能を作ってきたか」を軸に整理しました。各ページで実際に
        <b className="text-paper">試せます</b>——実バックエンドに繋がる
        <b className="text-teal">実デモ</b>、ブラウザ内の
        <b className="text-accent-soft">サンプル</b>まで。
      </p>

      <div className="flex items-center justify-end py-2 text-[0.78rem] tracking-[0.08em] text-muted">
        {FEATURES.length} 機能
      </div>

      <div className="grid grid-cols-1 gap-[18px] pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <FeatureCard key={f.slug} feature={f} />
        ))}
      </div>
    </section>
  );
}
