// Navigation Functions
function showBlog() {
    if (window.history && window.history.pushState) {
        window.history.pushState({page: 'blog'}, '', '/blog');
    } else {
        window.location.hash = '#blog';
    }
    if (window.showBlogList) {
        window.showBlogList();
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
    } else if (normalizedPath.includes('blog')) {
        const pathParts = normalizedPath.split('/').filter(p => p && p !== 'index.html');
        const blogIndex = pathParts.indexOf('blog');

        if (blogIndex !== -1) {
            if (pathParts.length > blogIndex + 1) {
                const slug = pathParts[blogIndex + 1];
                if (window.showBlogArticle) {
                    window.showBlogArticle(slug);
                }
            } else {
                if (window.showBlogList) {
                    window.showBlogList();
                }
            }
        } else {
            if (window.showBlogList) {
                window.showBlogList();
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
    } else if (hash === '#blog') {
        if (window.showBlogList) {
            window.showBlogList();
        }
    } else if (hash.startsWith('#blog/')) {
        const slug = hash.substring(6);
        if (window.showBlogArticle) {
            window.showBlogArticle(slug);
        }
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

    if (hash === '#blog' || path.includes('/blog')) {
        return;
    }

    if (hash === '' && !path.includes('blog') && !path.includes('press')) {
        const isRoot = path === '/' || path === '/index.html' || path.endsWith('/index.html');
        if (isRoot) {
            showHome();
        }
    }
});
