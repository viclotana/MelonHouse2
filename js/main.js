// Navigation Functions
function showNews() {
    if (window.history && window.history.pushState) {
        window.history.pushState({page: 'news'}, '', '/news');
    } else {
        window.location.hash = '#news';
    }
    if (window.showNewsList) {
        window.showNewsList();
    }
}

function showPress() {
    if (window.history && window.history.pushState) {
        window.history.pushState({page: 'press'}, '', '/press');
    } else {
        window.location.hash = '#press';
    }
    if (window.showPressList) {
        window.showPressList();
    }
}

function showHome() {
    if (window.history && window.history.pushState) {
        window.history.pushState({page: 'home'}, '', '/');
    } else {
        window.location.hash = '';
    }
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('newsPage').classList.remove('active');
    document.getElementById('newsArticlePage').classList.remove('active');
    document.getElementById('pressPage').classList.remove('active');
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
    normalizedPath = normalizedPath.replace(/^\//, '');

    if (normalizedPath === 'press') {
        if (window.showPressList) {
            window.showPressList();
        }
    } else if (normalizedPath.includes('news')) {
        const pathParts = normalizedPath.split('/').filter(p => p && p !== 'index.html');
        const newsIndex = pathParts.indexOf('news');

        if (newsIndex !== -1) {
            if (pathParts.length > newsIndex + 1) {
                const slug = pathParts[newsIndex + 1];
                if (window.showNewsArticle) {
                    window.showNewsArticle(slug);
                }
            } else {
                if (window.showNewsList) {
                    window.showNewsList();
                }
            }
        } else {
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
    } else if (hash === '#press') {
        if (window.showPressList) {
            window.showPressList();
        }
    } else if (hash === '#news') {
        // Handled by news-loader.js
    } else if (hash.startsWith('#news/')) {
        // Handled by news-loader.js
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const hash = window.location.hash;

    if (hash === '#press' || path === '/press') {
        if (window.showPressList) {
            window.showPressList();
        }
        return;
    }

    if (hash === '' && !path.includes('news') && !path.includes('press')) {
        const isRoot = path === '/' || path === '/index.html' || path.endsWith('/index.html');
        if (isRoot) {
            showHome();
        }
    }
});
