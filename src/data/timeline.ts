// 年表プロフィール（About ページ）
export type TimelineEntry = {
  year: string;
  title: string;
  detail?: string;
};

export const TIMELINE: TimelineEntry[] = [
  {
    year: "2001 / 01",
    title: "誕生",
  },
  {
    year: "2013 / 04 - 2019 / 03",
    title: "中学 ･ 高校時代",
    detail: "吹奏楽に明け暮れる",
  },
  {
    year: "2019 / 04 - 2023 / 03",
    title: "大学時代",
    detail: "アルバイトとライブ遠征を繰り返す",
  },
  {
    year: "2023 / 04",
    title: "上京 ･ 株式会社divx 入社",
    detail: "未経験エンジニアとして入社、1年目の冬に新卒部門で社内表彰",
  },
  {
    year: "2025 / 10",
    title: "株式会社ソニー・ミュージックエンタテインメント 入社",
    detail: "AI推進部へ配属、業務改善ツールの開発などに従事",
  },
];
