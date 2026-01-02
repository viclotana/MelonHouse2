// News Loader - Reads markdown files from the news folder
// Each markdown file should have frontmatter with: date, headline, slug, preview
// The slug is used for the URL: index.html#news/slug

let newsArticles = [];

// Markdown parser with frontmatter support
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
    
    // Parse markdown content to HTML using marked.js
    let htmlContent = '';
    if (typeof marked !== 'undefined') {
        // Configure marked options
        marked.setOptions({
            breaks: true, // Convert \n to <br>
            gfm: true // GitHub Flavored Markdown
        });
        htmlContent = marked.parse(content);
    } else {
        // Fallback: basic paragraph splitting if marked.js not loaded
        const paragraphs = content
            .split(/\n\n+/)
            .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
            .filter(p => p.length > 0);
        htmlContent = paragraphs.join('');
    }
    
    return {
        ...metadata,
        content: htmlContent // Now returns HTML string instead of array
    };
}

// Load a single news article
async function loadNewsArticle(slug) {
    try {
        // Always use absolute path from root to avoid path issues
        // This ensures it works regardless of current URL path
        const newsPath = `/news/${slug}.md`;
        
        console.log('Loading article from absolute path:', newsPath);
        const response = await fetch(newsPath);
        if (!response.ok) {
            console.error(`Failed to load ${slug}.md from ${newsPath}: ${response.status} ${response.statusText}`);
            // Try relative path as fallback (for edge cases)
            const altPath = `news/${slug}.md`;
            console.log('Trying relative path fallback:', altPath);
            const altResponse = await fetch(altPath);
            if (altResponse.ok) {
                const markdown = await altResponse.text();
                const parsed = parseMarkdown(markdown);
                return parsed;
            }
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
        'adanne-wraps-photography-december-2025-press-release',
        'melon-house-production-adanne-press-release'
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
    
    // Make sure functions are available before routing
    window.showNewsList = showNewsList;
    window.showNewsArticle = showNewsArticle;
    
    // Check URL path for news routing
    const path = window.location.pathname;
    const hash = window.location.hash;
    const fullPath = window.location.href;
    
    console.log('Initial path:', path, 'hash:', hash, 'fullPath:', fullPath);
    
    // Normalize path - handle both /news and /index.html/news and child routes
    let normalizedPath = path;
    
    console.log('Raw pathname:', path);
    
    // Handle different path formats:
    // - /news/slug
    // - /index.html/news/slug
    // - index.html/news/slug (relative)
    // - /Melon/news/slug (if in a subdirectory)
    
    // Check if path contains index.html/news pattern
    // Pattern: /index.html/news/slug or index.html/news/slug
    const indexHtmlNewsMatch = path.match(/(?:^|\/)(index\.html\/news\/[^\/]+)/);
    if (indexHtmlNewsMatch) {
        // Extract the slug from index.html/news/slug
        const fullMatch = indexHtmlNewsMatch[1];
        const slugMatch = fullMatch.match(/news\/([^\/]+)/);
        if (slugMatch) {
            const slug = slugMatch[1];
            console.log('Found article slug from index.html/news pattern:', slug);
            await showNewsArticle(slug);
            return; // Exit early, we've handled it
        }
    }
    
    // Check for /index.html/news (list page)
    if (path.includes('index.html/news') && !path.match(/index\.html\/news\/[^\/]+/)) {
        console.log('Found index.html/news (list page)');
        showNewsList();
        return; // Exit early
    }
    
    // Remove index.html from path for further processing
    if (normalizedPath.includes('index.html')) {
        normalizedPath = normalizedPath.replace(/index\.html/g, '');
    }
    
    // Remove trailing slash
    normalizedPath = normalizedPath.replace(/\/$/, '');
    
    // Remove leading slash for easier parsing
    normalizedPath = normalizedPath.replace(/^\//, '');
    
    console.log('Normalized path:', normalizedPath);
    
    // Handle clean URLs - check if path contains 'news'
    if (normalizedPath.includes('news')) {
        const pathParts = normalizedPath.split('/').filter(p => p && p !== 'index.html'); // Remove empty parts and index.html
        
        console.log('Path parts after filtering:', pathParts);
        
        // Find the index of 'news' in the path
        const newsIndex = pathParts.indexOf('news');
        
        if (newsIndex !== -1) {
            // Check if there's a slug after 'news'
            if (pathParts.length > newsIndex + 1) {
                // There's a slug after 'news' - it's an article
                const slug = pathParts[newsIndex + 1];
                console.log('Loading article from path, slug:', slug);
                await showNewsArticle(slug);
            } else {
                // 'news' is the last part - it's the news list
                console.log('Showing news list from path');
                showNewsList();
            }
        } else {
            // 'news' not found in path parts, but was in normalizedPath - might be edge case
            console.log('Edge case: news in path but not in parts, showing list');
            showNewsList();
        }
    } 
    // Fallback to hash-based routing
    else if (hash.startsWith('#news/')) {
        const slug = hash.substring(6); // Remove '#news/'
        console.log('Loading article from hash:', slug);
        await showNewsArticle(slug);
    } else if (hash === '#news') {
        console.log('Showing news list from hash');
        showNewsList();
    } else {
        // Default: show home page
        console.log('Showing home page');
        document.getElementById('mainContent').classList.remove('hidden');
        document.getElementById('newsPage').classList.remove('active');
        document.getElementById('newsArticlePage').classList.remove('active');
    }
    
    // Listen for hash changes (fallback)
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
        
        // Store slug in data attribute for reference
        articleCard.setAttribute('data-slug', article.slug);
        
        articleCard.innerHTML = `
            <div class="article-date">${article.date}</div>
            <h2 class="article-headline">${article.headline}</h2>
            <p class="article-preview">${article.preview}</p>
            <div class="article-indicator">
                Read More <span class="article-arrow">→</span>
            </div>
        `;
        
        // Attach click handler after innerHTML is set
        articleCard.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const slug = article.slug;
            console.log('=== ARTICLE CARD CLICKED ===');
            console.log('Slug:', slug);
            console.log('Article object:', article);
            
            // Immediately hide news list and show article page
            document.getElementById('mainContent').classList.add('hidden');
            document.getElementById('newsPage').classList.remove('active');
            document.getElementById('newsArticlePage').classList.add('active');
            console.log('Page visibility updated - newsPage hidden, newsArticlePage shown');
            
            try {
                // Use History API for clean URLs
                if (window.history && window.history.pushState) {
                    const newUrl = `/news/${slug}`;
                    console.log('Pushing state to:', newUrl);
                    window.history.pushState({page: 'news-article', slug: slug}, '', newUrl);
                } else {
                    console.log('Using hash fallback');
                    window.location.hash = `#news/${slug}`;
                }
                
                // Call showNewsArticle - use the function directly since it's in scope
                console.log('About to call showNewsArticle with slug:', slug);
                console.log('showNewsArticle type:', typeof showNewsArticle);
                
                if (typeof showNewsArticle === 'function') {
                    await showNewsArticle(slug);
                    console.log('showNewsArticle completed');
                } else {
                    console.error('showNewsArticle is not a function!', typeof showNewsArticle);
                    // Try window version
                    if (window.showNewsArticle && typeof window.showNewsArticle === 'function') {
                        console.log('Trying window.showNewsArticle');
                        await window.showNewsArticle(slug);
                    }
                }
            } catch (error) {
                console.error('Error in article click handler:', error);
                console.error('Error stack:', error.stack);
            }
        });
        
        newsContainer.appendChild(articleCard);
    });
    
    window.scrollTo(0, 0);
}

// Show individual news article
async function showNewsArticle(slug) {
    console.log('=== showNewsArticle CALLED ===');
    console.log('Slug:', slug);
    
    if (!slug) {
        console.error('No slug provided to showNewsArticle');
        return;
    }
    
    try {
        // Ensure page visibility is correct
        const mainContent = document.getElementById('mainContent');
        const newsPage = document.getElementById('newsPage');
        const newsArticlePage = document.getElementById('newsArticlePage');
        
        if (mainContent) mainContent.classList.add('hidden');
        if (newsPage) newsPage.classList.remove('active');
        if (newsArticlePage) newsArticlePage.classList.add('active');
        
        console.log('Page visibility set:');
        console.log('- mainContent hidden:', mainContent?.classList.contains('hidden'));
        console.log('- newsPage active:', newsPage?.classList.contains('active'));
        console.log('- newsArticlePage active:', newsArticlePage?.classList.contains('active'));
        
        console.log('Loading article markdown file:', slug);
        const article = await loadNewsArticle(slug);
        
        if (!article) {
            console.error('Article not found or failed to load:', slug);
            // Don't redirect - just show error message
            const articleContainer = document.getElementById('newsArticleContent');
            if (articleContainer) {
                articleContainer.innerHTML = `
                    <div class="article-back">
                        <a href="/news" class="back-link" onclick="event.preventDefault(); if(window.history && window.history.pushState) { window.history.pushState({page: 'news'}, '', '/news'); } else { window.location.hash = '#news'; } if(window.showNewsList) { window.showNewsList(); } return false;">← Back to News</a>
                    </div>
                    <p style="color: #C41E3A; padding: 48px; text-align: center;">Article not found. Please check the console for errors.</p>
                `;
            }
            return;
        }
        
        console.log('Article loaded successfully:', article);
        
        const articleContainer = document.getElementById('newsArticleContent');
        if (!articleContainer) {
            console.error('Article container not found!');
            return;
        }
        
        articleContainer.innerHTML = `
            <div class="article-back">
                <a href="/news" class="back-link" onclick="event.preventDefault(); if(window.history && window.history.pushState) { window.history.pushState({page: 'news'}, '', '/news'); } else { window.location.hash = '#news'; } if(window.showNewsList) { window.showNewsList(); } return false;">← Back to News</a>
            </div>
            <div class="article-date">${article.date}</div>
            <h1 class="article-headline-full">${article.headline}</h1>
            <div class="article-body">
                ${article.content}
            </div>
        `;
        
        window.scrollTo(0, 0);
        console.log('Article displayed successfully');
    } catch (error) {
        console.error('Error in showNewsArticle:', error);
    }
}

// Make functions available globally (after they're defined)
window.showNewsList = showNewsList;
window.showNewsArticle = showNewsArticle;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNews);
} else {
    initializeNews();
}

