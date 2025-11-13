// Navigation Functions
function showNews() {
    // Use History API for clean URLs
    if (window.history && window.history.pushState) {
        window.history.pushState({page: 'news'}, '', 'news');
    } else {
        window.location.hash = '#news';
    }
    // Trigger news display
    if (window.showNewsList) {
        window.showNewsList();
    }
}

function showHome() {
    // Use History API for clean URLs
    if (window.history && window.history.pushState) {
        window.history.pushState({page: 'home'}, '', window.location.pathname.replace('/news', ''));
    } else {
        window.location.hash = '';
    }
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('newsPage').classList.remove('active');
    document.getElementById('newsArticlePage').classList.remove('active');
    window.scrollTo(0, 0);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    const path = window.location.pathname;
    let normalizedPath = path;
    if (normalizedPath.includes('index.html')) {
        normalizedPath = normalizedPath.replace(/index\.html/g, '');
    }
    normalizedPath = normalizedPath.replace(/\/$/, '');
    
    if (normalizedPath.includes('/news')) {
        const pathParts = normalizedPath.split('/').filter(p => p);
        const lastPart = pathParts[pathParts.length - 1];
        
        // Check if it's a specific article or news list
        if (lastPart && lastPart !== 'news' && lastPart !== 'index.html' && lastPart !== '') {
            // It's an article slug
            if (window.showNewsArticle) {
                window.showNewsArticle(lastPart);
            }
        } else {
            // It's the news list
            if (window.showNewsList) {
                window.showNewsList();
            }
        }
    } else {
        showHome();
    }
});

// Handle hash changes for navigation (fallback)
window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    if (hash === '' || hash === '#') {
        showHome();
    } else if (hash === '#news') {
        // Handled by news-loader.js
    } else if (hash.startsWith('#news/')) {
        // Handled by news-loader.js
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Handle initial hash on page load
    const hash = window.location.hash;
    if (hash === '' || hash === '#') {
        showHome();
    }
});

