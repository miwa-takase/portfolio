// 年表プロフィール（About ページ）
// ▼ これは「記入例」です。実際の経歴に書き換えてください。
//   - year は文字列（"2024" / "2024.04" / "2024–現在" など自由）
//   - detail は省略可
//   - 上から時系列で並びます（新しい順にしたい場合は並べ替え）
export type TimelineEntry = {
  year: string;
  title: string;
  detail?: string;
};

export const TIMELINE: TimelineEntry[] = [
  {
    year: "2018",
    title: "〇〇大学 △△学部 卒業",
    detail:
      "（例）専攻・研究テーマなど。ここを実際の内容に書き換えてください。",
  },
  {
    year: "2019",
    title: "株式会社◇◇ 入社",
    detail: "（例）担当領域・使用技術・関わったプロダクトなど。",
  },
  {
    year: "2022",
    title: "個人開発を本格化",
    detail: "（例）AI・音声・映像を軸に、フルスタックで試作を量産。",
  },
  {
    year: "2026",
    title: "本ポートフォリオを公開",
    detail: "機能軸で制作物を整理し、その場で試せるサイトとして運用開始。",
  },
];
