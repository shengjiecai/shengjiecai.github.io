/* Article Markdown: local markdown-it, image captions, centering, and blank lines. */
(function () {
  const parser = window.markdownit({ html: false, breaks: false, linkify: true });
  const escape = parser.utils.escapeHtml;

  // Keep the site's original behavior: an image on its own source line is a figure,
  // even when the following paragraph has no intervening blank line.
  parser.block.ruler.before("paragraph", "article_image", (state, startLine, endLine, silent) => {
    const line = state.src.slice(state.bMarks[startLine] + state.tShift[startLine], state.eMarks[startLine]).trim();
    if (!line.startsWith("![")) return false;
    const children = [];
    state.md.inline.parse(line, state.md, state.env, children);
    if (children.length !== 1 || children[0].type !== "image") return false;
    if (silent) return true;
    const open = state.push("paragraph_open", "p", 1);
    open.map = [startLine, startLine + 1];
    const inline = state.push("inline", "", 0);
    inline.content = line;
    inline.map = open.map;
    inline.children = [];
    state.push("paragraph_close", "p", -1);
    state.line = startLine + 1;
    return true;
  }, { alt: ["paragraph"] });

  parser.core.ruler.after("inline", "article_headings", (state) => {
    const ids = new Set();
    state.tokens.forEach((token, index) => {
      if (!["heading_open", "paragraph_open"].includes(token.type)) return;
      const inline = state.tokens[index + 1];
      if (!inline || inline.type !== "inline") return;
      if (/\s+\{\.center\}\s*$/.test(inline.content)) {
        token.attrJoin("class", "text-center");
        inline.content = inline.content.replace(/\s+\{\.center\}\s*$/, "");
        inline.children = [];
        state.md.inline.parse(inline.content, state.md, state.env, inline.children);
      }
      if (token.type === "heading_open") {
        const text = state.md.renderer.renderInlineAsText(inline.children, state.md.options, state.env);
        const base = text.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").trim().replace(/\s+/g, "-") || "section";
        let id = base;
        let count = 2;
        while (ids.has(id)) id = `${base}-${count++}`;
        ids.add(id);
        token.attrSet("id", id);
      }
    });
  });

  parser.core.ruler.after("block", "article_blank_lines", (state) => {
    const lines = state.src.split("\n");
    const ends = new Map();
    const blocks = new Set(["paragraph_open", "heading_open", "blockquote_open", "bullet_list_open", "ordered_list_open", "fence", "code_block", "hr", "table_open"]);
    const tokens = [];
    state.tokens.forEach((token) => {
      if (token.block && token.map && token.type !== "inline") {
        const previousEnd = ends.get(token.level);
        if (previousEnd !== undefined && blocks.has(token.type)) {
          let blankCount = 0;
          for (let line = token.map[0] - 1; line >= previousEnd; line -= 1) {
            if (lines[line].replace(/^(?: {0,3}> ?)+/, "").trim()) break;
            blankCount += 1;
          }
          // The first blank line separates blocks; retain each additional line.
          for (let index = 1; index < blankCount; index += 1) {
            const spacer = new state.Token("blank_spacer", "div", 0);
            spacer.block = true;
            spacer.level = token.level;
            tokens.push(spacer);
          }
        }
        ends.set(token.level, token.map[1]);
      }
      tokens.push(token);
      if (token.block && token.nesting === -1) {
        for (const level of ends.keys()) {
          if (level > token.level) ends.delete(level);
        }
      }
    });
    state.tokens = tokens;
  });

  parser.renderer.rules.blank_spacer = () => '<div class="markdown-spacer" aria-hidden="true"></div>\n';

  function standaloneImage(token) {
    return token && token.type === "inline" && token.children.length === 1 && token.children[0].type === "image";
  }

  parser.renderer.rules.paragraph_open = (tokens, index, options, env, self) => {
    env.figure = standaloneImage(tokens[index + 1]);
    return env.figure ? '<figure class="article-figure">\n' : self.renderToken(tokens, index, options);
  };
  parser.renderer.rules.paragraph_close = (tokens, index, options, env, self) => {
    const figure = standaloneImage(tokens[index - 1]);
    env.figure = false;
    return figure ? '</figure>\n' : self.renderToken(tokens, index, options);
  };

  function assetUrl(url, env) {
    return new URL(url, new URL(env.file || "article.html", window.location.href)).href;
  }

  const defaultImage = parser.renderer.rules.image;
  parser.renderer.rules.image = (tokens, index, options, env, self) => {
    const token = tokens[index];
    token.attrSet("src", assetUrl(token.attrGet("src"), env));
    token.attrSet("loading", "lazy");
    const image = defaultImage(tokens, index, options, env, self);
    const caption = token.attrGet("title") || token.attrGet("alt");
    return image + (env.figure && caption ? `<figcaption>${escape(caption)}</figcaption>` : "");
  };

  parser.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const href = token.attrGet("href");
    if (href && !href.startsWith("#")) token.attrSet("href", assetUrl(href, env));
    if (/^https?:/.test(token.attrGet("href") || "")) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noopener noreferrer");
    }
    return self.renderToken(tokens, index, options);
  };
  parser.renderer.rules.table_open = () => '<div class="markdown-table-wrap"><table>\n';
  parser.renderer.rules.table_close = () => '</table></div>\n';

  window.ArticleMarkdown = {
    render(markdown, article = {}) {
      const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
      const first = lines.findIndex((line) => line.trim());
      if (first >= 0 && lines[first].trim() === `# ${article.title || ""}`.trim()) lines.splice(first, 1);
      return parser.render(lines.join("\n"), { file: article.file || "", figure: false });
    }
  };
})();
