// Navigation Functions
function showNews() {
    window.location.hash = '#news';
}

function showHome() {
    window.location.hash = '';
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('newsPage').classList.remove('active');
    document.getElementById('newsArticlePage').classList.remove('active');
    window.scrollTo(0, 0);
}

// Handle hash changes for navigation
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

