// 年表プロフィール（About ページ）
export type TimelineEntry = {
  year: string;
  title: string;
  detail?: string;
};

export const TIMELINE: TimelineEntry[] = [
  {
    year: "2001 - 01",
    title: "誕生",
    detail: "大阪にて育つ",
  },
  {
    year: "2023 - 03",
    title: "大学卒業",
    detail: "社会学部 卒業時は記事制作を実施",
  },
  {
    year: "2023 - 04",
    title: "上京 / 株式会社divx 入社",
    detail: "未経験で入社、1年目の冬に新卒部門で社内表彰",
  },
  {
    year: "2025 - 10",
    title: "株式会社ソニー・ミュージックエンタテインメント 入社",
    detail: "AI推進部へ配属、業務改善ツールの開発などに従事",
  },
];
