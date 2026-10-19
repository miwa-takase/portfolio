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
    detail: "",
  },
  {
    year: "2013 / 04 - 2016 / 03",
    title: "中学時代",
    detail: "",
  },
  {
    year: "2016 / 04 - 2019 / 03",
    title: "高校時代",
    detail: "",
  },
  {
    year: "2019 / 04 - 2023 / 03",
    title: "大学時代",
    detail: "",
  },
  {
    year: "2023 / 04 - 2025 / 09",
    title: "上京 ･ 1社目",
    detail: "",
  },
  {
    year: "2025 / 10",
    title: "2社目 入社",
    detail: "",
  },
];
