# MelonHouse Productions Website

A clean, maintainable 2-page film production website with a landing page and a News page for announcements and press releases.

## Project Structure

```
Melon/
├── index.html          # Main HTML file
├── css/
│   └── styles.css     # All styles
├── js/
│   ├── main.js        # Navigation and interactions
│   └── news-data.js   # News articles data (easy to edit)
└── README.md          # This file
```

## How to Add or Edit News Articles

To add a new news article or edit an existing one, simply open `js/news-data.js` and modify the `newsArticles` array.

### Adding a New Article

Add a new object to the `newsArticles` array with the following structure:

```javascript
{
    date: "January 2025",  // Date of the article
    headline: "Your Article Headline",
    preview: "A brief preview text that appears before expanding the article...",
    content: [
        "First paragraph of the full article content.",
        "Second paragraph of the full article content.",
        "Third paragraph...",
        // Add as many paragraphs as needed
    ]
}
```

**Example:**

```javascript
{
    date: "January 2025",
    headline: "New Film Festival Selection",
    preview: "We're thrilled to announce that Adanne has been selected for the Sundance Film Festival.",
    content: [
        "This is a significant milestone for our production team...",
        "The festival will take place in Park City, Utah...",
        "We look forward to sharing this story with audiences..."
    ]
}
```

### Editing an Existing Article

1. Open `js/news-data.js`
2. Find the article you want to edit in the `newsArticles` array
3. Modify the `date`, `headline`, `preview`, or `content` fields as needed
4. Save the file

### Article Order

Articles are displayed in the order they appear in the array. To change the order, simply rearrange the objects in the `newsArticles` array. The newest articles typically appear first.

## Customization

### Changing Colors

The main accent color is `#C41E3A` (red). To change it, search and replace this color code in `css/styles.css`.

### Updating Content

- **Hero Section**: Edit the hero section in `index.html` (lines with class `hero-title`, `hero-subtitle`, etc.)
- **Projects**: Edit the projects section in `index.html` (class `projects-section`)
- **About Section**: Edit the about section in `index.html` (class `about-section`)
- **Footer**: Edit the footer in `index.html` (class `footer`)

### Updating Images

Replace the image URLs in `index.html` with your own image URLs. The images are referenced in:
- Hero section: `hero-image` class
- Project cards: `project-image` class
- About section: `about-image` class

### Updating Social Links

Edit the social links in the footer section of `index.html`. Replace the `#` placeholders with your actual social media URLs.

## Running the Website

Simply open `index.html` in a web browser. No build process or server is required - it's a static website that works locally.

For production deployment, upload all files to your web hosting service maintaining the same folder structure.

## Browser Support

This website works in all modern browsers (Chrome, Firefox, Safari, Edge).

## Notes

- The website uses a single-page application (SPA) approach for navigation between the landing page and news page
- All styles are in one CSS file for easy maintenance
- News articles are stored in a JavaScript data file for easy editing without touching HTML
- The design is responsive and works on mobile devices

