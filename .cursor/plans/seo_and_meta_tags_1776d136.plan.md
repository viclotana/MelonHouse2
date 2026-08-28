---
name: SEO and Meta Tags
overview: Add comprehensive SEO meta tags, Open Graph, Twitter Cards, structured data, favicon, canonical URL, sitemap, robots.txt, and dynamic page titles to improve how the site appears in search results and social shares.
todos:
  - id: meta-tags
    content: Add meta description, OG tags, Twitter Card tags, canonical URL, and theme-color to index.html <head>
    status: completed
  - id: title-fix
    content: Update <title> tag to 'Melon House Production — Independent African Cinema'
    status: completed
  - id: json-ld
    content: Add Organization structured data JSON-LD script to <head>
    status: completed
  - id: favicon
    content: Generate favicon.png and apple-touch-icon.png, add link tags to <head>
    status: completed
  - id: dynamic-titles
    content: Add document.title updates in main.js, news-loader.js, and press-loader.js for each route
    status: completed
  - id: robots-sitemap
    content: Create robots.txt and sitemap.xml at project root
    status: completed
isProject: false
---

# SEO and Search Appearance Improvements

All changes target `[index.html](index.html)` `<head>` section plus a few new root files.

---

## 1. Fix the page title

Change the current `<title>` from "Adanne - MelonHouse Productions" to:

```
Melon House Production — Independent Entertainment Company
```

## 2. Add meta description

```html
<meta name="description" content="Melon House Production is an independent studio telling culturally rooted African stories for global audiences. Home of the debut feature Adanne.">
```

## 3. Add Open Graph tags

```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://melonhouse.co/">
<meta property="og:title" content="Melon House Production — — Independent Entertainment Company">
<meta property="og:description" content="Melon House Production is an independent studio telling culturally rooted African stories for global audiences. Home of the debut feature Adanne.">
<meta property="og:image" content="https://melonhouse.co/images/img2.JPEG">
<meta property="og:site_name" content="Melon House Production">
```

## 4. Add Twitter Card tags

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Melon House Production — Independent African Cinema">
<meta name="twitter:description" content="Melon House Production is an independent studio telling culturally rooted African stories for global audiences. Home of the debut feature Adanne.">
<meta name="twitter:image" content="https://melonhouse.co/images/img2.JPEG">
```

## 5. Add canonical URL

```html
<link rel="canonical" href="https://melonhouse.co/">
```

## 6. Add favicon

- Use an existing image or generate a simple favicon from the logo text
- Add to `<head>`:

```html
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

- Create a simple 32x32 and 180x180 favicon (can be generated from existing assets or a simple "M" lettermark)

## 7. Add structured data (JSON-LD)

Add a `<script type="application/ld+json">` block in `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Melon House Production",
  "url": "https://melonhouse.co",
  "logo": "https://melonhouse.co/favicon.png",
  "description": "Independent studio telling culturally rooted African stories for global audiences.",
  "sameAs": [
    "https://instagram.com/melonhouseproduction"
  ],
  "email": "hello@melonhouse.co"
}
```

## 8. Add dynamic page titles

In `[js/news-loader.js](js/news-loader.js)` and `[js/press-loader.js](js/press-loader.js)` and `[js/main.js](js/main.js)`, update `document.title` when navigating:

- Home: "Melon House Production — Independent African Cinema"
- Blog: "Blog — Melon House Production"
- Blog article: "[Headline] — Melon House Production"
- Press: "Press Mentions — Melon House Production"

## 9. Create robots.txt

New file at root: `[robots.txt](robots.txt)`

```
User-agent: *
Allow: /
Sitemap: https://melonhouse.co/sitemap.xml
```

## 10. Create sitemap.xml

New file at root: `[sitemap.xml](sitemap.xml)`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemapns.org/schemas/sitemap/0.9">
  <url><loc>https://melonhouse.co/</loc><priority>1.0</priority></url>
  <url><loc>https://melonhouse.co/blog</loc><priority>0.8</priority></url>
  <url><loc>https://melonhouse.co/press</loc><priority>0.8</priority></url>
</urlset>
```

## 11. Add theme-color meta

```html
<meta name="theme-color" content="#000000">
```

## 12. Add lang and charset confirmation (already present, just verify)

Already has `lang="en"` and `charset="UTF-8"` -- no change needed.

---

## Files modified/created

- `[index.html](index.html)` -- All meta tags, JSON-LD, favicon links, title update
- `[js/main.js](js/main.js)` -- Dynamic title on `showHome()`
- `[js/news-loader.js](js/news-loader.js)` -- Dynamic title on `showBlogList()` and `showBlogArticle()`
- `[js/press-loader.js](js/press-loader.js)` -- Dynamic title on `showPressList()`
- New: `robots.txt`
- New: `sitemap.xml`
- New: `favicon.png` (simple "M" lettermark, 32x32)
- New: `apple-touch-icon.png` (180x180)

