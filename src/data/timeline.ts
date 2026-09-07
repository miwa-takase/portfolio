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
    year: "2007 / 04 - 2013 / 03",
    title: "小学時代",
    detail: "週5で習い事 + ベネッセのハードスケジュール",
  },
  {
    year: "2013 / 04 - 2016 / 03",
    title: "中学時代",
    detail: "音楽経験0から吹奏楽とマーチングを始める",
  },
  {
    year: "2016 / 04 - 2019 / 03",
    title: "高校時代",
    detail: "吹奏楽漬けの3年間、校舎で合宿 ･ スポーツ応援 ･ 全休年3日･･･",
  },
  {
    year: "2019 / 04 - 2023 / 03",
    title: "大学時代",
    detail: "社会学部に所属、ライブ遠征に目覚める",
  },
  {
    year: "2023 / 04 - 2025 / 09",
    title: "上京 ･ 1社目",
    detail: "未経験エンジニアとして入社、1年目の冬に新卒部門で社内表彰",
  },
  {
    year: "2025 / 10",
    title: "2社目 入社",
    detail: "AI推進部へ配属、0 → 1での開発を経験",
  },
];
