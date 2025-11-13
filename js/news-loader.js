// News Loader - Reads markdown files from the news folder
// Each markdown file should have frontmatter with: date, headline, slug, preview
// The slug is used for the URL: index.html#news/slug

let newsArticles = [];

// Simple markdown parser (basic - handles frontmatter and paragraphs)
function parseMarkdown(markdown) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
        return null;
    }
    
    const frontmatter = match[1];
    const content = match[2];
    
    // Parse frontmatter
    const metadata = {};
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            metadata[key] = value;
        }
    });
    
    // Parse content into paragraphs
    const paragraphs = content
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0);
    
    return {
        ...metadata,
        content: paragraphs
    };
}

// Load a single news article
async function loadNewsArticle(slug) {
    try {
        const response = await fetch(`news/${slug}.md`);
        if (!response.ok) {
            console.error(`Failed to load ${slug}.md: ${response.status} ${response.statusText}`);
            return null;
        }
        const markdown = await response.text();
        const parsed = parseMarkdown(markdown);
        if (!parsed) {
            console.error(`Failed to parse markdown for ${slug}.md`);
        }
        return parsed;
    } catch (error) {
        console.error(`Error loading news article ${slug}:`, error);
        console.error('Note: If viewing locally, you may need to run a local server (e.g., python -m http.server)');
        return null;
    }
}

// Load all news articles
async function loadAllNewsArticles() {
    // List of news article slugs (you can add more here as you create new MD files)
    const slugs = [
        'bood-up-sundance-selection',
        'art-not-fashion-exhibition'
    ];
    
    const articles = [];
    for (const slug of slugs) {
        const article = await loadNewsArticle(slug);
        if (article) {
            articles.push(article);
        }
    }
    
    // Sort by date (newest first) - simple string comparison
    articles.sort((a, b) => {
        // Convert date strings to comparable format (assuming "Month YYYY" format)
        return b.date.localeCompare(a.date);
    });
    
    return articles;
}

// Initialize news system
async function initializeNews() {
    console.log('Initializing news system...');
    newsArticles = await loadAllNewsArticles();
    console.log(`Loaded ${newsArticles.length} news articles:`, newsArticles);
    window.newsArticles = newsArticles; // Make available globally
    
    // Load news list or individual article based on URL hash
    const hash = window.location.hash;
    console.log('Initial hash:', hash);
    if (hash.startsWith('#news/')) {
        const slug = hash.substring(6); // Remove '#news/'
        showNewsArticle(slug);
    } else if (hash === '#news') {
        showNewsList();
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        console.log('Hash changed to:', hash);
        if (hash.startsWith('#news/')) {
            const slug = hash.substring(6);
            showNewsArticle(slug);
        } else if (hash === '#news') {
            showNewsList();
        } else if (hash === '' || hash === '#') {
            // Home page - handled by main.js
            document.getElementById('mainContent').classList.remove('hidden');
            document.getElementById('newsPage').classList.remove('active');
            document.getElementById('newsArticlePage').classList.remove('active');
        }
    });
}

// Show news list
function showNewsList() {
    console.log('Showing news list, articles:', newsArticles);
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('newsPage').classList.add('active');
    document.getElementById('newsArticlePage').classList.remove('active');
    
    const newsContainer = document.getElementById('newsArticles');
    if (!newsContainer) {
        console.error('News container not found!');
        return;
    }
    
    newsContainer.innerHTML = '';
    
    if (newsArticles.length === 0) {
        newsContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 48px;">No news articles found. Please check the browser console for errors.</p>';
        return;
    }
    
    newsArticles.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.className = 'article-card';
        articleCard.onclick = () => {
            window.location.hash = `#news/${article.slug}`;
        };
        
        articleCard.innerHTML = `
            <div class="article-date">${article.date}</div>
            <h2 class="article-headline">${article.headline}</h2>
            <p class="article-preview">${article.preview}</p>
            <div class="article-indicator">
                Read More <span class="article-arrow">→</span>
            </div>
        `;
        
        newsContainer.appendChild(articleCard);
    });
    
    window.scrollTo(0, 0);
}

// Show individual news article
async function showNewsArticle(slug) {
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('newsPage').classList.remove('active');
    document.getElementById('newsArticlePage').classList.add('active');
    
    const article = await loadNewsArticle(slug);
    if (!article) {
        // Article not found, show list instead
        window.location.hash = '#news';
        return;
    }
    
    const articleContainer = document.getElementById('newsArticleContent');
    if (!articleContainer) return;
    
    articleContainer.innerHTML = `
        <div class="article-back">
            <a href="#news" class="back-link">← Back to News</a>
        </div>
        <div class="article-date">${article.date}</div>
        <h1 class="article-headline-full">${article.headline}</h1>
        <div class="article-body">
            ${article.content.map(para => `<p>${para}</p>`).join('')}
        </div>
    `;
    
    window.scrollTo(0, 0);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNews);
} else {
    initializeNews();
}

