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
    slug: "example-reading-note",
    type: "reading",
    title: "Example Reading Note: How to Write a Research Summary",
    date: "2026-07-10",
    tags: ["Reading", "Research"],
    summary: "A sample reading note showing how article pages work. Replace it with your own note.",
    file: "articles/reading/example-reading-note.md"
  },
  {
    slug: "example-diary-entry",
    type: "diary",
    title: "Example Diary Entry: First Day of the Website",
    date: "2026-07-10",
    tags: ["Diary"],
    summary: "A sample diary entry. Replace it with your own writing or delete it later.",
    file: "articles/diary/example-diary-entry.md"
  }
];
