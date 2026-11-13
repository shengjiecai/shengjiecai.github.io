# Formatting Reading and Diary articles

This guide describes the formatting supported by this website. Write the article in a UTF-8 Markdown file, and use `articles/articles.js` for its title, date, tags, summary, and file path. Chinese and English can be mixed freely. The same formatting works in Reading and Diary articles.

The website includes a local copy of markdown-it, so rendering does not depend on a public CDN. Centering and preservation of additional blank lines are website-specific additions. The examples below match the implemented renderer; unsupported features are listed at the end.

## Where to edit each part

| What you want to change | File or setting |
| --- | --- |
| Personal Space Reading card description | `personal.html`, inside the link to `reading.html` |
| Reading page introduction | `reading.html`, the paragraph under its main heading |
| Diary page introduction | `diary.html`, the paragraph under its main heading |
| Article title, date, tags, list summary, and position in the list | Its record in `articles/articles.js` |
| Full article text, headings, pictures, and captions | The Markdown file named by that record's `file` field |
| Article width | `.article-full` in `assets/css/style.css` |
| Extra blank-line height | `.markdown-spacer` in `assets/css/style.css` |
| Diary photo width and height | The diary-specific `.article-figure` rules in `assets/css/style.css` |

Writing Chinese directly in an HTML paragraph or span is supported. Your Chinese Reading-card description in `personal.html` does not need translation or special encoding escapes.

## Start an article

For example, create `articles/diary/20261113 我的日记.md`:

```markdown
# 20261113 我的日记

这是第一段。

## 第一节

这里写正文，可以混用中文与 English。
```

Then add an object inside `window.ARTICLES = [ ... ];` in `articles/articles.js`:

```js
{
  slug: "20261113-my-diary",
  type: "diary",
  title: "20261113 我的日记",
  date: "2026-11-13",
  tags: ["随笔"],
  summary: "这里写列表中的简短介绍。",
  file: "articles/diary/20261113 我的日记.md"
},
```

Use `type: "reading"` for Reading. Keep a comma between objects. Use ordinary straight quotation marks around JavaScript strings, and save the file as UTF-8. Chinese punctuation can be part of the quoted text; it should not replace the JavaScript quotes or commas outside the text.

The first Markdown `#` title should match the metadata `title` exactly, including spaces. The renderer hides that matching line because the article page already displays the title. The metadata `summary` is plain text, so put formatting in the article body rather than in that field. The order of the records controls the list order. Keep `slug` stable after publishing to preserve existing links.

## Headings

Use a space after the hash marks:

```markdown
# Article title
## Main section
### Subsection
#### Smaller subsection
##### Fifth level
###### Sixth level
```

Use one `#` title at the start, then `##` and `###` for most articles. Headings create structure and are different from simply making a paragraph bold.

## Centered headings and paragraphs

Add `{.center}` at the end of the heading:

```markdown
## 食 {.center}

### 三星堆 {.center}
```

A standalone paragraph can also be centered:

```markdown
写在旅途结束之后 {.center}
```

Leave a space before `{.center}`. The marker is removed from the displayed text. This is a website-specific extension, so another Markdown viewer might display the marker literally. Only `.center` is supported by this extension; it is not a general HTML or CSS attribute system.

## Paragraphs and blank lines

One empty line separates paragraphs:

```markdown
第一段。

第二段。
```

Additional empty lines are now retained. Two consecutive blank lines add one visible blank line beyond normal paragraph spacing; three add two. A line containing only spaces counts as a blank line too.

For example, the following has two empty lines between the sentences:

```markdown
第一段。


第二段。
```

The first empty line is the paragraph separator. Each extra line adds `1.65em` of vertical space. The spacing is in addition to any normal margins around headings and figures. Extra lines can also be used between paragraphs inside a blockquote or a list item. Leading and trailing blank lines do not create padding around the whole article. Blank lines within code blocks remain part of the code.

Blank lines between list items still follow Markdown's list rules; they do not insert extra numbered or bulleted items. For deliberate empty space between sections, put the blank lines outside the list.

## Line breaks inside a paragraph

A single ordinary newline is a soft break and usually displays as a space. For an intentional line break, put a backslash at the end of the line:

```markdown
绿蚁新醅酒\
红泥小火炉\
晚来天欲雪\
能饮一杯无
```

Two spaces at the end of a line also create a line break. A backslash is easier to see and less likely to be removed by an editor. Use blank lines for separate paragraphs and hard breaks for poetry, addresses, or a short signature.

## Bold italics strikethrough and inline code

```markdown
**加粗**
*斜体*
***粗斜体***
~~删除线~~
`行内代码`
```

Keep spaces outside the markers rather than immediately inside them. To print a marker literally, escape it with a backslash, for example `\*` or `\#`. Inline code is useful when explaining filenames or Markdown syntax without activating the formatting.

## Dividing lines

Put three hyphens on a separate line, with blank lines around it:

```markdown
上一节结束。

---

下一节开始。
```

`***` and `___` also make dividing lines. Blank lines matter: a row of hyphens immediately beneath text can instead turn that text into a heading.

## Unordered and ordered lists

```markdown
- 第一项
- 第二项
    - 第二项中的子项
    - 另一个子项

1. 第一步
2. 第二步
3. 第三步
```

Indent nested items consistently; four spaces is a straightforward convention. Keep one space after the bullet or number. Numbered lists are automatically numbered when displayed. An empty line between items makes a looser list with more spacing.

To continue a list item with another paragraph, indent that paragraph beneath the item's text:

```markdown
- 一个较长的项目。

    这一段仍然属于同一个项目。
```

## Quotations

Put `>` at the start of quoted lines. A line containing only `>` separates paragraphs within the same quote:

```markdown
> 这是引用的第一段。
>
> 这是第二段。
```

For nested quotations, use `>>`. The site displays quoted text in a shaded block. Include attribution in the text when appropriate.

## Links

```markdown
[链接文字](https://example.com)
[发邮件](mailto:name@example.com)
[回到日记列表](../../diary.html)
[另一篇文章](../../article.html?slug=20211122-xiaoxue)
```

Relative file links are resolved from the Markdown file's folder. From `articles/diary/` or `articles/reading/`, `../../` returns to the website root. Full HTTP and HTTPS links open in a new tab. A bare web address can also become a link automatically.

## Links to sections in the same article

Headings get automatic anchor IDs:

```markdown
[跳到研究动机](#研究动机)

## 研究动机
```

For English headings, use lowercase words joined with hyphens: `## Research Motivation` becomes `#research-motivation`. Punctuation is removed. Chinese characters are retained. Repeated IDs receive `-2`, `-3`, and so on to stay unique. `{.center}` is not part of the ID.

## Pictures and captions

Place an image on its own line and separate it from nearby text with blank lines:

```markdown
![替代说明](../../assets/img/Diary_20261105_成都之行/行/IMG_0649.webp "图片下方的说明")
```

The three parts control different things:

| Part | Purpose |
| --- | --- |
| Text in `[ ... ]` | Alternative text, including a description for readers using a screen reader |
| Path in `( ... )` | The image file to display |
| Text in `" ... "` after the path | The caption below the image |

Without a quoted caption, the alternative text is used as the caption. Keep captions to one line in the Markdown source. Captions are plain text, so emphasis markers in a caption are printed as text.

Keep an article's images together, for example in `assets/img/Diary_20261113_我的日记/`. Chinese filenames are supported. For a path with spaces, wrap only the path in angle brackets:

```markdown
![图片说明](<../../assets/img/my trip/photo 01.webp> "旅行照片")
```

Reading images fit the article width. Diary photos remain centered and capped at 560 pixels in width and height. Display size does not reduce the file size on disk; resize or compress the actual asset for storage savings.

## Tables

```markdown
| 项目 | 数值 | 备注 |
| :--- | ---: | :---: |
| 甲 | 10 | 居中 |
| 乙 | 20 | 居中 |
```

Colons set column alignment: `:---` is left, `---:` is right, and `:---:` is centered. Include the separator row beneath the header. Keep each row on one source line. On a narrow screen, wide tables scroll within their own area rather than widening the whole page. Escape a literal pipe in a cell as `\|`.

## Code blocks

Use three backticks on separate lines. A language label is optional:

````markdown
```python
def example():
    return "中文也可以"
```
````

Indentation, newlines, and empty lines inside the fence are preserved. Code blocks scroll horizontally if necessary. A language label is stored in the output, but automatic syntax coloring is not currently enabled.

## Reference links

You can keep long URLs out of the main sentence:

```markdown
可以查看[项目资料][project]。

[project]: https://example.com
```

The reference definition does not appear as a paragraph on the page.

## Features that are not enabled

Raw HTML is displayed as text. Use `## 标题 {.center}` instead of `<h2 align="center">`; use a Markdown hard break instead of `<br>`. Arbitrary HTML, CSS styles, and scripts in article Markdown are not executed.

LaTeX math, Mermaid diagrams, footnotes, task-checkbox rendering, and an automatically generated table of contents are not enabled. Dollar signs and custom plugin notation do not activate those features. A manual contents list made of section links works. YAML front matter does not set this website's article metadata; use `articles/articles.js` instead.

## Preview and troubleshoot

Run a local server from the repository root, for example:

```text
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/diary.html` or `reading.html`, then click the article. Loading the HTML file directly from disk does not allow the normal Markdown fetch workflow.

If a change is missing, save the file and reload. Use `Ctrl+F5` if the browser has an old copy. If the title repeats, compare the metadata `title` with the first `#` heading. If an image is missing, verify its exact path, capitalization, extension, and relative folder depth. If an article does not appear in the list, check its metadata record, `type`, and JavaScript commas.

The article card is now capped at 1,000 pixels and shrinks to the available screen width. Long code lines and wide tables scroll locally. Ordinary paragraphs wrap automatically; there is no need to insert manual newlines to match a particular screen.

See [markdown-examples.md](markdown-examples.md) for a short sample using these features. Open `docs/markdown-preview.html` through the local server to see that sample rendered with the website's actual styles. Core Markdown behavior is documented by the [markdown-it project](https://github.com/markdown-it/markdown-it); the centering and blank-line rules above are specific to this website.
