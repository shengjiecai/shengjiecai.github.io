const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { URL, window: { location: { href: 'https://example.test/article.html?slug=entry' } } };
vm.createContext(context);
for (const file of ['assets/vendor/markdown-it/markdown-it.min.js', 'assets/js/markdown.js']) {
  if (context.markdownit) context.window.markdownit = context.markdownit;
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const render = (text, metadata) => context.window.ArticleMarkdown.render(text, metadata);

test('Chinese, standard Markdown, and centered headings', () => {
  const html = render('## 寻章摘句 {.center}\n\n**中文**与*English*，~~删除~~，`code`。\n\n---\n\n1. 第一项\n2. 第二项\n\n- 项目\n  - 子项');
  assert.match(html, /<h2 class="text-center" id="寻章摘句">寻章摘句<\/h2>/);
  for (const tag of ['strong', 'em', 's', 'code', 'hr', 'ol', 'ul']) assert.match(html, new RegExp(`<${tag}[ >]`));
  assert(!html.includes('{.center}'));
});

test('blank lines survive as additional spacers, including whitespace-only lines', () => {
  assert(!render('第一段\n\n第二段').includes('markdown-spacer'));
  assert.equal((render('第一段\n\n \n\n第二段').match(/class="markdown-spacer"/g) || []).length, 2);
  assert(!render('\n\n第一段\n\n').includes('markdown-spacer'));
  const quote = render('> 第一段\n>\n>\n> 第二段\n\n正文');
  assert.equal((quote.match(/markdown-spacer/g) || []).length, 1);
  assert.equal((quote.match(/<blockquote>/g) || []).length, 1);
  assert(!quote.includes('&gt;'));
});

test('line breaks, code-block whitespace, tables, and repeated heading anchors', () => {
  const html = render('第一行  \n第二行\n\n```text\na\n\n\nb\n```\n\n| A | B |\n| :-- | --: |\n| 甲 | 乙 |\n\n## 重复\n\n## 重复');
  assert.match(html, /第一行<br>\n第二行/);
  assert.match(html, /a\n\n\nb\n/);
  assert.match(html, /class="markdown-table-wrap"><table>/);
  assert.match(html, /id="重复-2"/);
});

test('standalone image captions and relative paths stay compatible', () => {
  const html = render('![菜名](../../assets/img/菜名.webp "图片说明")', { file: 'articles/diary/entry.md' });
  assert.match(html, /<figure class="article-figure">/);
  assert.match(html, /src="https:\/\/example.test\/assets\/img\/%E8%8F%9C%E5%90%8D.webp"/);
  assert.match(html, /alt="菜名"/);
  assert.match(html, /<figcaption>图片说明<\/figcaption>/);
  assert(!html.includes('<p><figure'));
  assert.match(render('![替代说明](photo.webp)'), /<figcaption>替代说明<\/figcaption>/);
  const adjacent = render('![包子](photo.webp "包子")\n紧接图片的原有正文。');
  assert.match(adjacent, /<figcaption>包子<\/figcaption>/);
  assert.match(adjacent, /<\/figure>\n<p>紧接图片的原有正文。<\/p>/);
});

test('article title is not duplicated, HTML and unsafe URLs stay inert', () => {
  assert(!render('# 相同标题\n\n正文', { title: '相同标题' }).includes('<h1'));
  const html = render('<script>alert(1)</script>\n\n[危险链接](javascript:alert(1))\n\n[章节](#研究动机)\n\n[网站](https://example.org)');
  assert(!html.includes('<script>'));
  assert(!html.includes('href="javascript:'));
  assert.match(html, /href="#%E7%A0%94%E7%A9%B6%E5%8A%A8%E6%9C%BA"/);
  assert.match(html, /rel="noopener noreferrer"/);
});

test('existing articles retain all images and valid local asset paths', () => {
  vm.runInContext(fs.readFileSync(path.join(root, 'articles/articles.js'), 'utf8'), context);
  let imageCount = 0;
  for (const article of context.window.ARTICLES) {
    const html = render(fs.readFileSync(path.join(root, article.file), 'utf8'), article);
    assert(!html.includes('<p>&gt;</p>'));
    for (const match of html.matchAll(/<img [^>]*src="([^"]+)"/g)) {
      const url = new URL(match[1]);
      assert(fs.existsSync(path.join(root, decodeURIComponent(url.pathname))), url.pathname);
      imageCount += 1;
    }
  }
  assert(imageCount > 0);
});
