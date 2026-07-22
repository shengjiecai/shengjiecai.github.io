# Personal Academic Website Starter

## Prompts Flow for Codex

### 1

This is my local website repository.

Before doing any work:

1. Read AGENTS.md completely and follow it.
2. Confirm the Git repository root and current branch.
3. Run git status.
4. Identify the website framework, package manager, build command, test command, and local preview command from the repository files.
5. Report any existing uncommitted changes and explain whether they appear unrelated.

This is inspection only. Do not edit, stage, commit, push, install dependencies, or change branches.



### 2

Read and follow AGENTS.md.

I want the following website change:

[Describe the change clearly here.]

Requirements:

- Inspect the relevant existing files before editing.
- Preserve the current visual style and existing functionality unless the request requires otherwise.
- Do not overwrite unrelated uncommitted changes.
- Make the smallest coherent set of changes.
- Run the appropriate available checks after editing.
- If visual appearance changes, preview or visually inspect the result when practical.
- Report modified files, validation results, and any remaining concerns.

Do not stage, commit, push, or deploy yet.



### 3

Review the complete uncommitted Git diff.

Check for:

- accidental or unrelated changes;
- broken links or asset paths;
- HTML, CSS, or JavaScript errors;
- mobile responsiveness problems;
- accessibility problems;
- unnecessary generated files;
- sensitive information.

Run any appropriate validation that has not already been run. Fix issues clearly caused by this task, then summarize the final diff.

Do not stage, commit, or push.



----



This is a simple static website for an academic homepage with a personal writing section. It has no build system and no paid hosting requirement.

## What is included

- Home page: name, photo, position, contact information, introduction, and section previews
- Research page: working papers, projects, and links
- Teaching Assistantship page: course records and responsibilities
- Personal Space page: an unlisted gateway to the Reading and Diary sections
- Reading and Diary pages: dated, clickable article summaries
- Article page: each Reading or Diary title opens a complete article

## File structure

```text
personal-academic-website/
├── index.html                  # Home page
├── research.html               # Research page
├── teaching.html               # Teaching Assistantship page
├── personal.html               # Unlisted Personal Space gateway
├── reading.html                # Reading article index
├── diary.html                  # Diary article index
├── article.html                # Full article display page
├── assets/
│   ├── css/style.css           # Visual design
│   ├── js/site-data.js         # Your academic profile, research, teaching
│   ├── js/main.js              # Website logic; usually do not edit
│   ├── img/                       # Profile, background, and article images
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
profileImage: "assets/img/photo.jpg",
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

Create a Markdown file in the Reading folder, for example:

```text
articles/reading/asset-pricing-note.md
```

Keep that article's images in a matching, dated folder:

```text
assets/img/Reading_20260710_asset-pricing-note/
```

From the article's Markdown file, insert an image like this:

```markdown
![Descriptive alternative text](../../assets/img/Reading_20260710_asset-pricing-note/figure.png "Figure caption")
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
  summary: "Short summary shown on the Reading page.",
  file: "articles/reading/asset-pricing-note.md"
},
```

The title will automatically appear under Reading. Clicking it will open the full article.

## Add a new Diary article

Create a Markdown file in the Diary folder, for example:

```text
articles/diary/first-week.md
```

Keep that entry's images in its own matching folder:

```text
assets/img/Diary_20260710_first-week/
```

Then add this item to `articles/articles.js`:

```js
{
  slug: "first-week",
  type: "diary",
  title: "First Week Notes",
  date: "2026-07-10",
  tags: ["Diary"],
  summary: "Short summary shown on the Diary page.",
  file: "articles/diary/first-week.md"
},
```

## Preview locally

Because the article page loads Markdown files, do not preview by double-clicking `index.html`. Use a local server.

### Windows

Open Command Prompt in the website folder and run:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000/
```

Press `Ctrl+C` in Command Prompt when you are finished previewing the site.

### macOS or Linux

Open Terminal in the website folder and run:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000/
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

Alternatively, publish by using Github Desktop.



## Notes on privacy

Anything uploaded to GitHub Pages is public unless you use private hosting. Hiding Personal Space from navigation and adding `noindex` discourages casual discovery, but it is not access control. Do not publish private diary entries, personal phone numbers, unpublished sensitive data, or confidential research material.
