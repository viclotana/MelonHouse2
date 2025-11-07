// Navigation Functions
function showNews() {
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('newsPage').classList.add('active');
    window.scrollTo(0, 0);
}

function showHome() {
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('newsPage').classList.remove('active');
    window.scrollTo(0, 0);
}

// Toggle article expansion
function toggleArticle(card) {
    card.classList.toggle('expanded');
}

// Load news articles dynamically
function loadNewsArticles() {
    const newsContainer = document.getElementById('newsArticles');
    
    if (!newsContainer || !window.newsArticles) {
        return;
    }

    // Clear existing content
    newsContainer.innerHTML = '';

    // Create article cards
    window.newsArticles.forEach((article, index) => {
        const articleCard = document.createElement('div');
        articleCard.className = 'article-card';
        articleCard.onclick = function() { toggleArticle(this); };

        // Create article date
        const date = document.createElement('div');
        date.className = 'article-date';
        date.textContent = article.date;

        // Create headline
        const headline = document.createElement('h2');
        headline.className = 'article-headline';
        headline.textContent = article.headline;

        // Create preview
        const preview = document.createElement('p');
        preview.className = 'article-preview';
        preview.textContent = article.preview;

        // Create read more indicator
        const indicator = document.createElement('div');
        indicator.className = 'article-indicator';
        indicator.innerHTML = 'Read More <span class="article-arrow">→</span>';

        // Create content section
        const content = document.createElement('div');
        content.className = 'article-content';
        
        // Add content paragraphs
        article.content.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            content.appendChild(p);
        });

        // Assemble article card
        articleCard.appendChild(date);
        articleCard.appendChild(headline);
        articleCard.appendChild(preview);
        articleCard.appendChild(indicator);
        articleCard.appendChild(content);

        // Add to container
        newsContainer.appendChild(articleCard);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Make newsArticles available globally
    window.newsArticles = newsArticles;
    
    // Load news articles
    loadNewsArticles();
});

