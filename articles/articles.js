/*
  Add your reading notes and diary entries here.

  Steps for a new article:
  1. Give the article its own folder in articles/reading/ or articles/diary/.
  2. Put the article in index.md.
  3. Store its images in assets/img/Reading_YYYYMMDD_article-slug/ or
     assets/img/Diary_YYYYMMDD_article-slug/ so every article has one image folder.
  4. Add one item below with the index.md path.
  5. Keep slug unique; it becomes part of the article URL.
*/

window.ARTICLES = [
  {
    slug: "20261105-chengdu",
    type: "diary",
    title: "20261105 成都之行",
    date: "2026-11-05",
    tags: ["Diary", "成都"],
    summary: "成都食记",
    file: "articles/diary/20261105 成都之行.md"
  },
  {
    slug: "example-reading-note",
    type: "reading",
    title: "Example Reading Note: How to Write a Research Summary",
    date: "2026-07-10",
    tags: ["Reading", "Research"],
    summary: "A sample reading note showing how article pages work. Replace it with your own note.",
    file: "articles/reading/example-reading-note.md"
  },
  {
    slug: "20211122-xiaoxue",
    type: "diary",
    title: "20211122 小雪",
    date: "2021-11-22",
    tags: ["随笔"],
    summary: "旧文重发",
    file: "articles/diary/20211122 小雪.md"
  }
];
