/* Personal Space is intentionally omitted from navigation; direct URL only. */

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
      if (href === current) {
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
      img.src = SITE.profileImage || "assets/img/photo.jpg";
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
    applyPersonalContrast();
  }

  function relativeLuminance(red, green, blue) {
    const channels = [red, green, blue].map((value) => {
      const channel = value / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    });

    return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
  }

  function contrastRatio(first, second) {
    const lighter = Math.max(first, second);
    const darker = Math.min(first, second);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function applyPersonalContrast() {
    const page = $('body[data-page="personal"]');
    if (!page || typeof Image === "undefined" || !document.createElement) return;

    const backgroundPath = page.dataset.background;
    if (!backgroundPath) return;

    const opacityValue = Number(page.dataset.backgroundOpacity);
    const backgroundOpacity = Number.isFinite(opacityValue)
      ? Math.min(1, Math.max(0, opacityValue))
      : 0.72;
    page.style.setProperty("--personal-bg-opacity", String(backgroundOpacity));

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 48;
        canvas.height = 24;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const sampleWidth = Math.round(canvas.width * 0.64);
        const pixels = context.getImageData(0, 0, sampleWidth, canvas.height).data;
        let imageLuminance = 0;
        let sampleCount = 0;

        for (let index = 0; index < pixels.length; index += 4) {
          imageLuminance += relativeLuminance(pixels[index], pixels[index + 1], pixels[index + 2]);
          sampleCount += 1;
        }

        imageLuminance /= Math.max(sampleCount, 1);
        const baseLuminance = relativeLuminance(43, 35, 34);
        const effectiveLuminance = (imageLuminance * backgroundOpacity) + (baseLuminance * (1 - backgroundOpacity));
        const lightLuminance = relativeLuminance(255, 255, 255);
        const darkLuminance = relativeLuminance(31, 24, 25);
        const useLightText = contrastRatio(lightLuminance, effectiveLuminance) >= contrastRatio(darkLuminance, effectiveLuminance);

        page.style.setProperty("--personal-text", useLightText ? "#ffffff" : "#1f1819");
        page.style.setProperty("--personal-muted", useLightText ? "#f0e9e7" : "#423638");
        page.style.setProperty("--personal-line", useLightText ? "rgba(255, 255, 255, 0.28)" : "rgba(31, 24, 25, 0.28)");
        page.style.setProperty(
          "--personal-text-shadow",
          useLightText ? "0 1px 5px rgba(0, 0, 0, 0.65)" : "0 1px 4px rgba(255, 255, 255, 0.55)"
        );
      } catch (error) {
        // Retain the accessible light-text fallback if the image cannot be sampled.
      }
    };
    image.src = new URL(backgroundPath, window.location.href).href;
  }

  function renderWritingIndex() {
    const page = document.body.dataset.page;
    if (!['reading', 'diary'].includes(page)) return;

    const articles = ARTICLES.filter((item) => item.type === page);
    const html = articles.map((item) => `
      <article class="card writing-card">
        <div class="eyebrow">${formatDate(item.date)}${item.tags && item.tags.length ? ` · ${item.tags.map(escapeHTML).join(", ")}` : ""}</div>
        <h3><a href="article.html?slug=${encodeURIComponent(item.slug)}">${escapeHTML(item.title)}</a></h3>
        <p class="writing-summary">${escapeHTML(item.summary || "")}</p>
      </article>
    `).join("");

    setHTML("#writing-list", html || `<p class="muted">No articles yet.</p>`);
  }

  function resolveArticleAssetUrl(assetUrl, articleFile) {
    try {
      const articleUrl = new URL(articleFile, window.location.href);
      return new URL(assetUrl, articleUrl).href;
    } catch (error) {
      return assetUrl;
    }
  }

  function simpleMarkdownToHTML(markdown, articleTitle = "", articleFile = "") {
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

      const imageMatch = line.match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/);
      if (imageMatch) {
        flushParagraph();
        closeList();
        const alt = imageMatch[1];
        const imageUrl = resolveArticleAssetUrl(imageMatch[2], articleFile);
        const caption = imageMatch[3] || alt;
        html += `
          <figure class="article-figure">
            <img src="${escapeHTML(imageUrl)}" alt="${escapeHTML(alt)}" loading="lazy">
            ${caption ? `<figcaption>${escapeHTML(caption)}</figcaption>` : ""}
          </figure>
        `;
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
          <p>The article slug is missing or incorrect. Return to the <a href="index.html">homepage</a>.</p>
        </section>
      `);
      return;
    }

    document.title = `${article.title} | ${SITE.name || "Personal Website"}`;
    const collectionPage = article.type === "reading" ? "reading.html" : "diary.html";
    const collectionLabel = article.type === "reading" ? "Reading" : "Diary";
    setHTML("#article-container", `
      <article class="card article-full">
        <a class="back-link" href="${collectionPage}">← Back to ${collectionLabel}</a>
        <div class="eyebrow">${article.type === "reading" ? "Reading" : "Diary"} · ${formatDate(article.date)}${article.tags && article.tags.length ? ` · ${article.tags.map(escapeHTML).join(", ")}` : ""}</div>
        <h1>${escapeHTML(article.title)}</h1>
        <div id="article-body" class="markdown-body"><p class="muted">Loading article...</p></div>
      </article>
    `);

    try {
      const response = await fetch(article.file);
      if (!response.ok) throw new Error("File not found");
      const markdown = await response.text();
      setHTML("#article-body", simpleMarkdownToHTML(markdown, article.title, article.file));
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
    renderWritingIndex();
    renderArticle();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
