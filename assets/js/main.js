/* 
隐藏了personal section
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="research.html">Research</a>
      <a href="teaching.html">Teaching Assistantship</a> 
      <a href="personal.html">Personal Space</a>
    `;
*/

(function () {
  const SITE = window.SITE || {};
  const ARTICLES = window.ARTICLES || [];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function escapeHTML(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value || "";
  }

  function setHTML(selector, html) {
    const el = $(selector);
    if (el) el.innerHTML = html || "";
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function makeLink(label, url, className = "text-link") {
    if (!url || url === "#") return "";
    return `<a class="${className}" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`;
  }

  function renderNav() {
    $$(".site-title").forEach((el) => { el.textContent = SITE.name || "Personal Academic Website"; });
    const nav = $("#site-nav");
    if (!nav) return;
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="research.html">Research</a>
      <a href="teaching.html">Teaching Assistantship</a> 
    `;

    const current = window.location.pathname.split("/").pop() || "index.html";
    $$("#site-nav a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === current || (current === "article.html" && href === "personal.html")) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  function renderFooter() {
    setText("#footer-note", SITE.footerNote || `© ${SITE.name || "Your Name"}`);
  }

  function contactHTML() {
    const contact = SITE.contact || {};
    const items = [];
    if (contact.email) items.push(`<li><strong>Email:</strong> <a href="mailto:${escapeHTML(contact.email)}">${escapeHTML(contact.email)}</a></li>`);
    if (contact.office) items.push(`<li><strong>Office:</strong> ${escapeHTML(contact.office)}</li>`);
    if (contact.phone) items.push(`<li><strong>Phone:</strong> ${escapeHTML(contact.phone)}</li>`);
    if (SITE.location) items.push(`<li><strong>Location:</strong> ${escapeHTML(SITE.location)}</li>`);
    return `<ul class="contact-list">${items.join("")}</ul>`;
  }

  function linkBarHTML() {
    const contact = SITE.contact || {};
    const links = [];
    if (SITE.cvUrl) links.push({ label: "CV", url: SITE.cvUrl });
    if (contact.googleScholar) links.push({ label: "Google Scholar", url: contact.googleScholar });
    if (contact.github) links.push({ label: "GitHub", url: contact.github });
    if (contact.linkedin) links.push({ label: "LinkedIn", url: contact.linkedin });

    return links
      .map((link) => makeLink(link.label, link.url, "button-link"))
      .filter(Boolean)
      .join("");
  }

  function renderHome() {
    if (!$('body[data-page="home"]')) return;

    setText("#person-name", [SITE.name, SITE.chineseName].filter(Boolean).join(" | "));
    setText("#current-position", SITE.currentPosition);
    setText("#affiliation", SITE.affiliation);

    const img = $("#profile-photo");
    if (img) {
      img.src = SITE.profileImage || "assets/img/profile-placeholder.svg";
      img.alt = `${SITE.name || "Profile"} photo`;
    }

    setHTML("#contact-details", contactHTML());
    setHTML("#profile-links", linkBarHTML());

    const intro = (SITE.introduction || [])
      .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
      .join("");
    setHTML("#intro-text", intro);

    setText("#research-summary", SITE.researchSummary);
    setText("#teaching-summary", SITE.teachingSummary);
    setText("#personal-summary", SITE.personalSummary);

    const latestReading = ARTICLES.filter((a) => a.type === "reading").slice(0, 2);
    const latestDiary = ARTICLES.filter((a) => a.type === "diary").slice(0, 2);
    setHTML("#home-latest-reading", articleListHTML(latestReading, true));
    setHTML("#home-latest-diary", articleListHTML(latestDiary, true));
  }

function renderResearch() {
  if (!$('body[data-page="research"]')) return;

  setText("#research-page-summary", SITE.researchSummary);

  const research = SITE.research || [];

  const categories = [
    {
      key: "published",
      title: "Published Journal Articles"
    },
    {
      key: "working",
      title: "Working Papers"
    },
    {
      key: "progress",
      title: "Work in Progress"
    }
  ];

  function coauthorsHTML(coauthors) {
    if (!coauthors) return "";
    if (!Array.isArray(coauthors)) return escapeHTML(coauthors);

    const names = coauthors.map((coauthor) => {
      if (typeof coauthor === "string") return escapeHTML(coauthor);
      return coauthor.url
        ? makeLink(coauthor.name, coauthor.url, "coauthor-link")
        : escapeHTML(coauthor.name);
    });

    return `with ${names.join(", ")}`;
  }

  function paperHTML(item) {
    const links = (item.links || [])
      .map((link) => makeLink(link.label, link.url, "small-link"))
      .filter(Boolean)
      .join("");

    const journal = item.journal
      ? `
        <p class="journal">
          <strong>${escapeHTML(item.journalStatus || "Journal")}:</strong>
          <em>${escapeHTML(item.journal)}</em>
        </p>
      `
      : "";

    const conferences =
      item.conferences && item.conferences.length
        ? `
          <div class="paper-conferences">
            <strong>Presented at:</strong>
            <ul>
              ${item.conferences
                .map(
                  (conference) =>
                    `<li>${escapeHTML(conference)}</li>`
                )
                .join("")}
            </ul>
          </div>
        `
        : "";

    return `
      <article class="card paper-card">
        <div class="eyebrow">
          ${escapeHTML(item.status || "Research")}
          ${item.year ? ` · ${escapeHTML(item.year)}` : ""}
        </div>

        <h3>${escapeHTML(item.title)}</h3>

        ${
          item.coauthors
            ? `<p class="paper-coauthors">${coauthorsHTML(item.coauthors)}</p>`
            : ""
        }

        ${journal}

        <p class="paper-abstract">${escapeHTML(item.abstract || "")}</p>

        ${conferences}

        ${links ? `<div class="link-row">${links}</div>` : ""}
      </article>
    `;
  }

  const html = categories
    .map((category) => {
      const papers = research.filter(
        (item) => item.category === category.key
      );

      if (!papers.length) return "";

      return `
        <section class="research-group"
                 aria-labelledby="research-${category.key}">
          <h2 id="research-${category.key}"
              class="research-group-title">
            ${category.title}
          </h2>

          ${papers.map(paperHTML).join("")}
        </section>
      `;
    })
    .join("");

  setHTML(
    "#research-list",
    html || `<p class="muted">No research items yet.</p>`
  );
}

  function renderTeaching() {
    if (!$('body[data-page="teaching"]')) return;
    setText("#teaching-page-summary", SITE.teachingSummary);

    const teaching = SITE.teaching || [];
    const html = teaching.map((item) => `
      <article class="card teaching-card">
        <div class="eyebrow">${escapeHTML(item.term || "")}</div>
        <h2>${escapeHTML(item.course)}</h2>
        <p class="teaching-meta">${escapeHTML(item.role || "Teaching Assistant")}${item.institution ? ` · ${escapeHTML(item.institution)}` : ""}</p>
        ${item.instructor ? `<p class="teaching-instructor"><strong>Instructor:</strong> ${escapeHTML(item.instructor)}</p>` : ""}
        <p class="teaching-description">${escapeHTML(item.description || "")}</p>
      </article>
    `).join("");

    setHTML("#teaching-list", html || `<p class="muted">No teaching records yet.</p>`);
  }

  function articleListHTML(items, compact = false) {
    if (!items.length) return `<p class="muted">No articles yet.</p>`;
    return items.map((item) => `
      <article class="article-card ${compact ? "compact" : ""}">
        <div class="eyebrow">${formatDate(item.date)}${item.tags && item.tags.length ? ` · ${item.tags.map(escapeHTML).join(", ")}` : ""}</div>
        <h3><a href="article.html?slug=${encodeURIComponent(item.slug)}">${escapeHTML(item.title)}</a></h3>
        <p>${escapeHTML(item.summary || "")}</p>
      </article>
    `).join("");
  }

  function renderPersonal() {
    if (!$('body[data-page="personal"]')) return;
    setText("#personal-page-summary", SITE.personalSummary);

    const reading = ARTICLES.filter((item) => item.type === "reading");
    const diary = ARTICLES.filter((item) => item.type === "diary");
    setHTML("#reading-list", articleListHTML(reading));
    setHTML("#diary-list", articleListHTML(diary));
  }

  function simpleMarkdownToHTML(markdown, articleTitle = "") {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const firstContentLine = lines.findIndex((rawLine) => rawLine.trim() !== "");
    if (
      firstContentLine >= 0 &&
      lines[firstContentLine].trim().startsWith("# ") &&
      lines[firstContentLine].trim().slice(2).trim() === articleTitle.trim()
    ) {
      lines.splice(firstContentLine, 1);
    }
    let html = "";
    let paragraph = [];
    let inList = false;

    function inline(text) {
      return escapeHTML(text)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, "<code>$1</code>")
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    function flushParagraph() {
      if (paragraph.length) {
        html += `<p>${inline(paragraph.join(" "))}</p>`;
        paragraph = [];
      }
    }

    function closeList() {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
    }

    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) {
        flushParagraph();
        closeList();
        return;
      }

      if (line.startsWith("### ")) {
        flushParagraph();
        closeList();
        html += `<h3>${inline(line.slice(4))}</h3>`;
      } else if (line.startsWith("## ")) {
        flushParagraph();
        closeList();
        html += `<h2>${inline(line.slice(3))}</h2>`;
      } else if (line.startsWith("# ")) {
        flushParagraph();
        closeList();
        html += `<h2>${inline(line.slice(2))}</h2>`;
      } else if (line.startsWith("- ")) {
        flushParagraph();
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${inline(line.slice(2))}</li>`;
      } else if (line.startsWith("> ")) {
        flushParagraph();
        closeList();
        html += `<blockquote>${inline(line.slice(2))}</blockquote>`;
      } else {
        paragraph.push(line);
      }
    });

    flushParagraph();
    closeList();
    return html;
  }

  async function renderArticle() {
    if (!$('body[data-page="article"]')) return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const article = ARTICLES.find((item) => item.slug === slug);

    if (!article) {
      setHTML("#article-container", `
        <section class="card">
          <h1>Article not found</h1>
          <p>The article slug is missing or incorrect. Return to <a href="personal.html">Personal Space</a>.</p>
        </section>
      `);
      return;
    }

    document.title = `${article.title} | ${SITE.name || "Personal Website"}`;
    setHTML("#article-container", `
      <article class="card article-full">
        <a class="back-link" href="personal.html">← Back to Personal Space</a>
        <div class="eyebrow">${article.type === "reading" ? "Reading" : "Diary"} · ${formatDate(article.date)}${article.tags && article.tags.length ? ` · ${article.tags.map(escapeHTML).join(", ")}` : ""}</div>
        <h1>${escapeHTML(article.title)}</h1>
        <div id="article-body" class="markdown-body"><p class="muted">Loading article...</p></div>
      </article>
    `);

    try {
      const response = await fetch(article.file);
      if (!response.ok) throw new Error("File not found");
      const markdown = await response.text();
      setHTML("#article-body", simpleMarkdownToHTML(markdown, article.title));
    } catch (error) {
      setHTML("#article-body", `
        <p>This article could not be loaded.</p>
        <p class="muted">For local preview, open the folder through a local server rather than double-clicking the HTML file. See README.md for instructions.</p>
      `);
    }
  }

  function init() {
    if (SITE.name && !(document.title || "").includes(SITE.name)) {
      const pageName = (document.title || "").split("|")[0].trim();
      document.title = `${pageName} | ${SITE.name}`;
    }
    renderNav();
    renderFooter();
    renderHome();
    renderResearch();
    renderTeaching();
    renderPersonal();
    renderArticle();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
