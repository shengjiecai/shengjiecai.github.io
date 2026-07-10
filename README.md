# Personal Academic Website Starter

This is a simple static website for an academic homepage with a personal writing section. It has no build system and no paid hosting requirement.

## What is included

- Home page: name, photo, position, contact information, introduction, and section previews
- Research page: working papers, projects, and links
- Teaching Assistantship page: course records and responsibilities
- Personal Space page: Reading and Diary subsections
- Article page: each Reading or Diary title opens a complete article

## File structure

```text
personal-academic-website/
├── index.html                  # Home page
├── research.html               # Research page
├── teaching.html               # Teaching Assistantship page
├── personal.html               # Reading and Diary lists
├── article.html                # Full article display page
├── assets/
│   ├── css/style.css           # Visual design
│   ├── js/site-data.js         # Your academic profile, research, teaching
│   ├── js/main.js              # Website logic; usually do not edit
│   ├── img/profile-placeholder.svg
│   └── files/                  # Put your CV PDF or papers here
└── articles/
    ├── articles.js             # Article list and metadata
    ├── reading/                # Reading notes in Markdown
    └── diary/                  # Diary entries in Markdown
```

## Edit your personal information

Open this file:

```text
assets/js/site-data.js
```

Replace the sample text with your own:

- `name`
- `currentPosition`
- `affiliation`
- `email`
- `office`
- `introduction`
- `research`
- `teaching`

Keep quotation marks and commas in the same style as the sample.

## Replace the profile photo

Put your photo in:

```text
assets/img/
```

For example, name it:

```text
profile.jpg
```

Then open:

```text
assets/js/site-data.js
```

Change:

```js
profileImage: "assets/img/profile-placeholder.svg",
```

to:

```js
profileImage: "assets/img/profile.jpg",
```

## Add your CV

Put your CV PDF in:

```text
assets/files/cv.pdf
```

The homepage CV button already points to that file.

## Add a new Reading article

Create a new Markdown file, for example:

```text
articles/reading/asset-pricing-note.md
```

Then open:

```text
articles/articles.js
```

Add this item inside `window.ARTICLES = [ ... ];`:

```js
{
  slug: "asset-pricing-note",
  type: "reading",
  title: "Reading Note: Asset Pricing",
  date: "2026-07-10",
  tags: ["Reading", "Finance"],
  summary: "Short summary shown on the Personal Space page.",
  file: "articles/reading/asset-pricing-note.md"
},
```

The title will automatically appear under Reading. Clicking it will open the full article.

## Add a new Diary article

Create a new Markdown file, for example:

```text
articles/diary/first-week.md
```

Then add this item to `articles/articles.js`:

```js
{
  slug: "first-week",
  type: "diary",
  title: "First Week Notes",
  date: "2026-07-10",
  tags: ["Diary"],
  summary: "Short summary shown on the Personal Space page.",
  file: "articles/diary/first-week.md"
},
```

## Preview locally

Because the article page loads Markdown files, do not preview by double-clicking `index.html`. Use a local server.

### Windows

Open Command Prompt in the website folder and run:

```bash
py -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

### macOS or Linux

Open Terminal in the website folder and run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Publish with GitHub Pages

1. Create a GitHub account if you do not have one.
2. Create a new repository named exactly:

```text
your-github-username.github.io
```

For example, if your GitHub username is `alicechen`, the repository should be:

```text
alicechen.github.io
```

3. Upload all files from this folder into that repository.
4. Commit the files.
5. In the repository, go to **Settings → Pages**.
6. Choose deployment from the main branch and root folder if GitHub does not do this automatically.
7. Your website will be available at:

```text
https://your-github-username.github.io/
```

## Basic Markdown syntax for articles

```md
# Main title

## Section title

Normal paragraph text.

- Bullet point one
- Bullet point two

**bold text** and *italic text*

[Link text](https://example.com)

> Quotation or reflection
```

## Notes on privacy

Anything uploaded to GitHub Pages is public unless you use private hosting. Do not publish private diary entries, personal phone numbers, unpublished sensitive data, or confidential research material.
