# News Articles

This folder contains markdown files for news articles. Each article should be a `.md` file with the following structure:

## File Format

Each markdown file should have:

1. **Frontmatter** (YAML format at the top, between `---` markers):
   - `date`: The date of the article (e.g., "January 2025")
   - `headline`: The article headline
   - `slug`: A URL-friendly identifier (e.g., "my-article-title")
   - `preview`: A brief preview text shown in the news list

2. **Content**: The main article content in markdown format (paragraphs separated by blank lines)

## Example

```markdown
---
date: "January 2025"
headline: "My Article Title"
slug: "my-article-title"
preview: "This is a brief preview of the article that appears in the news list."
---

This is the first paragraph of the article.

This is the second paragraph.

This is the third paragraph.
```

## Adding New Articles

1. Create a new `.md` file in this folder
2. Use a descriptive filename (e.g., `my-article-title.md`)
3. Add the frontmatter with all required fields
4. Write your article content below
5. Add the slug to the `slugs` array in `js/news-loader.js`

## URL Structure

Articles are accessible via:
- `index.html#news` - News list page
- `index.html#news/your-slug` - Individual article page

The slug in the URL must match the `slug` field in the frontmatter and the filename (without `.md`).

