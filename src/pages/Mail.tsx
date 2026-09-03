import Breadcrumb from "../components/Breadcrumb";
import { OWNER } from "../data/apps";

const btnWhite =
  "mail-send-button inline-flex items-center gap-2 rounded-full border border-white px-6 py-2.5 text-sm tracking-wide text-white transition-colors";

export default function Mail() {
  return (
    <section className="wrap py-16">
      <Breadcrumb items={[{ label: "Contact" }]} />

      <div className="max-w-2xl pt-6">
        <h1 className="display-title font-serif text-4xl font-medium italic leading-tight md:text-6xl">
          Contact
        </h1>
        <p className="mt-4 text-base text-paper-dim">
          機能の詳細・実装については、こちらからご連絡ください
        </p>
      </div>

      <div className="card-surface mt-8 flex items-center justify-between rounded-2xl p-8">
        <p className="text-base leading-8 text-paper-dim">
          右のボタンから、お使いのメールソフトが起動します
        </p>
        <a
          href={`mailto:${OWNER.email}`}
          className={btnWhite}
          aria-label="メールを作成する"
        >
          <span aria-hidden="true">✉</span>
          メールを送る
        </a>
      </div>
    </section>
  );
}
