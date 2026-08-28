// Blog Loader - Reads markdown files from the blog folder
// Each markdown file should have frontmatter with: date, headline, slug, preview

let blogArticles = [];

// Markdown parser with frontmatter support
function parseMarkdown(markdown) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
        return null;
    }
    
    const frontmatter = match[1];
    const content = match[2];
    
    const metadata = {};
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            metadata[key] = value;
        }
    });
    
    let htmlContent = '';
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true
        });
        htmlContent = marked.parse(content);
    } else {
        const paragraphs = content
            .split(/\n\n+/)
            .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
            .filter(p => p.length > 0);
        htmlContent = paragraphs.join('');
    }
    
    return {
        ...metadata,
        content: htmlContent
    };
}

async function loadBlogArticle(slug) {
    try {
        const blogPath = `/blog/${slug}.md`;
        
        console.log('Loading article from absolute path:', blogPath);
        const response = await fetch(blogPath);
        if (!response.ok) {
            console.error(`Failed to load ${slug}.md from ${blogPath}: ${response.status} ${response.statusText}`);
            const altPath = `blog/${slug}.md`;
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
        console.error(`Error loading blog article ${slug}:`, error);
        return null;
    }
}

async function loadAllBlogArticles() {
    const slugs = [
        'adanne-wraps-photography-december-2025-press-release',
        'melon-house-production-adanne-press-release'
    ];
    
    const articles = [];
    for (const slug of slugs) {
        const article = await loadBlogArticle(slug);
        if (article) {
            articles.push(article);
        }
    }
    
    articles.sort((a, b) => {
        function parseDate(dateStr) {
            const monthNames = {
                'january': 0, 'february': 1, 'march': 2, 'april': 3,
                'may': 4, 'june': 5, 'july': 6, 'august': 7,
                'september': 8, 'october': 9, 'november': 10, 'december': 11
            };
            
            const parts = dateStr.toLowerCase().trim().split(/\s+/);
            if (parts.length >= 2) {
                const month = monthNames[parts[0]];
                const year = parseInt(parts[1], 10);
                if (month !== undefined && !isNaN(year)) {
                    return new Date(year, month, 1).getTime();
                }
            }
            return 0;
        }
        
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA;
    });
    
    return articles;
}

async function initializeBlog() {
    console.log('Initializing blog system...');
    blogArticles = await loadAllBlogArticles();
    console.log(`Loaded ${blogArticles.length} blog articles:`, blogArticles);
    window.blogArticles = blogArticles;
    
    window.showBlogList = showBlogList;
    window.showBlogArticle = showBlogArticle;
    
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    console.log('Initial path:', path, 'hash:', hash);
    
    let normalizedPath = path;
    
    const indexHtmlBlogMatch = path.match(/(?:^|\/)(index\.html\/blog\/[^\/]+)/);
    if (indexHtmlBlogMatch) {
        const fullMatch = indexHtmlBlogMatch[1];
        const slugMatch = fullMatch.match(/blog\/([^\/]+)/);
        if (slugMatch) {
            const slug = slugMatch[1];
            console.log('Found article slug from index.html/blog pattern:', slug);
            await showBlogArticle(slug);
            return;
        }
    }
    
    if (path.includes('index.html/blog') && !path.match(/index\.html\/blog\/[^\/]+/)) {
        console.log('Found index.html/blog (list page)');
        showBlogList();
        return;
    }
    
    if (normalizedPath.includes('index.html')) {
        normalizedPath = normalizedPath.replace(/index\.html/g, '');
    }
    
    normalizedPath = normalizedPath.replace(/\/$/, '');
    normalizedPath = normalizedPath.replace(/^\//, '');
    
    console.log('Normalized path:', normalizedPath);
    
    if (normalizedPath === 'press') {
        console.log('Showing press page from path');
        if (window.showPressList) {
            window.showPressList();
        }
        return;
    }

    if (normalizedPath.includes('blog')) {
        const pathParts = normalizedPath.split('/').filter(p => p && p !== 'index.html');
        
        const blogIndex = pathParts.indexOf('blog');
        
        if (blogIndex !== -1) {
            if (pathParts.length > blogIndex + 1) {
                const slug = pathParts[blogIndex + 1];
                console.log('Loading article from path, slug:', slug);
                await showBlogArticle(slug);
            } else {
                console.log('Showing blog list from path');
                showBlogList();
            }
        } else {
            console.log('Edge case: blog in path but not in parts, showing list');
            showBlogList();
        }
    } 
    else if (hash.startsWith('#blog/')) {
        const slug = hash.substring(6);
        console.log('Loading article from hash:', slug);
        await showBlogArticle(slug);
    } else if (hash === '#blog') {
        console.log('Showing blog list from hash');
        showBlogList();
    } else {
        console.log('Showing home page');
        document.getElementById('mainContent').classList.remove('hidden');
        document.getElementById('newsPage').classList.remove('active');
        document.getElementById('newsArticlePage').classList.remove('active');
    }
    
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        console.log('Hash changed to:', hash);
        if (hash.startsWith('#blog/')) {
            const slug = hash.substring(6);
            showBlogArticle(slug);
        } else if (hash === '#blog') {
            showBlogList();
        } else if (hash === '' || hash === '#') {
            document.getElementById('mainContent').classList.remove('hidden');
            document.getElementById('newsPage').classList.remove('active');
            document.getElementById('newsArticlePage').classList.remove('active');
        }
    });
}

function showBlogList() {
    console.log('Showing blog list, articles:', blogArticles);
    document.title = 'Blog \u2014 Melon House Production';
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('newsPage').classList.add('active');
    document.getElementById('newsArticlePage').classList.remove('active');
    var pressEl = document.getElementById('pressPage');
    if (pressEl) pressEl.classList.remove('active');
    
    const blogContainer = document.getElementById('newsArticles');
    if (!blogContainer) {
        console.error('Blog container not found!');
        return;
    }
    
    blogContainer.innerHTML = '';
    
    if (blogArticles.length === 0) {
        blogContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 48px;">No blog articles found. Please check the browser console for errors.</p>';
        return;
    }
    
    blogArticles.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.className = 'article-card';
        
        articleCard.setAttribute('data-slug', article.slug);
        
        articleCard.innerHTML = `
            <div class="article-date">${article.date}</div>
            <h2 class="article-headline">${article.headline}</h2>
            <p class="article-preview">${article.preview}</p>
            <div class="article-indicator">
                Read More <span class="article-arrow">→</span>
            </div>
        `;
        
        articleCard.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const slug = article.slug;
            
            document.getElementById('mainContent').classList.add('hidden');
            document.getElementById('newsPage').classList.remove('active');
            document.getElementById('newsArticlePage').classList.add('active');
            
            try {
                if (window.history && window.history.pushState) {
                    const newUrl = `/blog/${slug}`;
                    window.history.pushState({page: 'blog-article', slug: slug}, '', newUrl);
                } else {
                    window.location.hash = `#blog/${slug}`;
                }
                
                if (typeof showBlogArticle === 'function') {
                    await showBlogArticle(slug);
                } else if (window.showBlogArticle && typeof window.showBlogArticle === 'function') {
                    await window.showBlogArticle(slug);
                }
            } catch (error) {
                console.error('Error in article click handler:', error);
            }
        });
        
        blogContainer.appendChild(articleCard);
    });
    
    window.scrollTo(0, 0);
}

async function showBlogArticle(slug) {
    console.log('=== showBlogArticle CALLED ===');
    console.log('Slug:', slug);
    
    if (!slug) {
        console.error('No slug provided to showBlogArticle');
        return;
    }
    
    try {
        const mainContent = document.getElementById('mainContent');
        const newsPage = document.getElementById('newsPage');
        const newsArticlePage = document.getElementById('newsArticlePage');
        
        if (mainContent) mainContent.classList.add('hidden');
        if (newsPage) newsPage.classList.remove('active');
        if (newsArticlePage) newsArticlePage.classList.add('active');
        var pressEl = document.getElementById('pressPage');
        if (pressEl) pressEl.classList.remove('active');
        
        const article = await loadBlogArticle(slug);
        
        if (!article) {
            console.error('Article not found or failed to load:', slug);
            const articleContainer = document.getElementById('newsArticleContent');
            if (articleContainer) {
                articleContainer.innerHTML = `
                    <div class="article-back">
                        <a href="/blog" class="back-link" onclick="event.preventDefault(); if(window.history && window.history.pushState) { window.history.pushState({page: 'blog'}, '', '/blog'); } else { window.location.hash = '#blog'; } if(window.showBlogList) { window.showBlogList(); } return false;">← Back to Blog</a>
                    </div>
                    <p style="color: #C41E3A; padding: 48px; text-align: center;">Article not found. Please check the console for errors.</p>
                `;
            }
            return;
        }
        
        const articleContainer = document.getElementById('newsArticleContent');
        if (!articleContainer) {
            console.error('Article container not found!');
            return;
        }
        
        document.title = article.headline + ' \u2014 Melon House Production';
        articleContainer.innerHTML = `
            <div class="article-back">
                <a href="/blog" class="back-link" onclick="event.preventDefault(); if(window.history && window.history.pushState) { window.history.pushState({page: 'blog'}, '', '/blog'); } else { window.location.hash = '#blog'; } if(window.showBlogList) { window.showBlogList(); } return false;">← Back to Blog</a>
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
        console.error('Error in showBlogArticle:', error);
    }
}

window.showBlogList = showBlogList;
window.showBlogArticle = showBlogArticle;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlog);
} else {
    initializeBlog();
}
