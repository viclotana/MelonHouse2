const pressArticles = [
    {
        title: "Gold Gerry Unpacks Creative and Production Decisions Behind 'Adanne'",
        source: "The Nollywood Reporter",
        date: "March 2026",
        summary: "In an exclusive interview, Gold Gerry opens up about building Melon House Production, her culturally inspired storytelling rooted in Igbo culture, and the creative vision behind her debut feature Adanne — from casting decisions to the choice to shoot in Ibadan and her collaboration with director Orobosa Ikponmwen.",
        url: "https://thenollywoodreporter.com/film/gold-gerry-on-creative-and-production-decisions-behind-adanne/",
        slug: "nollywoodreporter-gold-gerry-interview"
    },
    {
        title: "What Does It Take to Shoot Adanne, A Movie About Three Generations of Nigerian Women?",
        source: "BellaNaija",
        date: "March 2026",
        summary: "Gold Gerry reflects on the deeply personal inspiration behind Adanne, the challenges of building Melon House Production from the ground up, navigating independent funding, and shooting a feature about three generations of Nigerian women with a 40-person crew over eight intense days in Ibadan.",
        url: "https://www.bellanaija.com/2026/03/what-does-it-take-to-shoot-adanne/",
        slug: "bellanaija-shooting-adanne"
    },
    {
        title: "Adanne: Cast Reflections on New Melon House Movie",
        source: "NollyCritic",
        date: "January 2026",
        summary: "With production wrapped in December, the cast of Adanne — Kelvinmary Ndukwe, Onyinye Odokoro, Jennifer Umenwa, and Mmesomachi Chilaka — reflect on bringing to life a story about family, inheritance, and the quiet negotiations that shape women's lives across generations within a three-generation Igbo household.",
        url: "https://nollycritic.com/adanne-cast-reflections-on-new-melon-house-movie/",
        slug: "nollycritic-adanne-cast-reflections"
    },
    {
        title: "Onyinye Odokoro to Star in Melon House's Debut Feature 'Adanne', A Story Across Three Igbo Generations",
        source: "What Kept Me Up",
        date: "November 2025",
        summary: "Melon House Production announced its first feature film, Adanne, a family drama written and produced by Gold Gerry and directed by Orobosa Ikponmwen. The film follows three generations of Igbo women as they navigate love, duty, and the ties that bind them, with Onyinye Odokoro, Kelvinmary Ndukwe, and Mmesomachi Chilaka leading the cast.",
        url: "https://whatkeptmeup.com/nigerian-film-news/onyinye-odokoro-to-star-in-melon-houses-debut-feature-adanne-a-story-across-three-igbo-generations/",
        slug: "whatkeptmeup-adanne-announcement"
    },
    {
        title: "Onyinye Odokoro to Star in Melon House's Debut Feature 'Adanne', A Story Across Three Igbo Generations",
        source: "PartyJollof TV",
        date: "November 2025",
        summary: "Written and produced by Gold Gerry and directed by Orobosa Ikponmwen, Adanne follows a young woman torn between her creative ambitions and the rigid traditions she's expected to uphold. Her fight to define her identity becomes a journey toward healing and reclaiming the legacy of her lineage.",
        url: "https://www.partyjolloftv.com/industry-news/onyinye-odokoro-to-star-in-melon-houses-debut-feature-adanne-a-story-across-three-igbo-generations---what-kept-me-up#google_vignette",
        slug: "partyjolloftv-adanne-announcement"
    },
    {
        title: "Onyinye Odokoro Star Adanne Intergenerational Drama Melon House",
        source: "Afrocritik",
        date: "November 2025",
        summary: "Afrocritik covers the announcement of Adanne, Melon House Production's debut feature that positions itself as a story deeply concerned with inheritance — not only of bloodlines, but of silence, expectation, and survival strategies passed quietly from one generation to the next.",
        url: "https://afrocritik.com/onyinye-odokoro-star-adanne-intergenerational-drama-melon-house/",
        slug: "afrocritik-adanne-announcement"
    }
];

// Render press mentions list page
function showPressList() {
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('newsPage').classList.remove('active');
    document.getElementById('newsArticlePage').classList.remove('active');
    document.getElementById('pressPage').classList.add('active');

    const container = document.getElementById('pressArticles');
    if (!container) return;

    container.innerHTML = '';

    pressArticles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'article-card press-card';

        card.innerHTML = `
            <div class="press-source-tag">${article.source}</div>
            <div class="article-date">${article.date}</div>
            <h2 class="article-headline">${article.title}</h2>
            <p class="article-preview">${article.summary}</p>
            <div class="article-indicator">
                Read on ${article.source} <span class="article-arrow">→</span>
            </div>
        `;

        card.addEventListener('click', function () {
            window.open(article.url, '_blank', 'noopener,noreferrer');
        });

        container.appendChild(card);
    });

    window.scrollTo(0, 0);
}

window.showPressList = showPressList;

// --- Carousel Logic ---

let carouselIndex = 0;
let carouselInterval = null;

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    if (slides.length === 0) return;

    dots.forEach(dot => {
        dot.addEventListener('click', function () {
            goToSlide(parseInt(this.dataset.index));
        });
    });

    const carouselSection = document.getElementById('pressCarousel');
    if (carouselSection) {
        carouselSection.style.cursor = 'pointer';
        carouselSection.addEventListener('click', function (e) {
            if (e.target.classList.contains('carousel-dot')) return;
            if (window.showPressList) {
                if (window.history && window.history.pushState) {
                    window.history.pushState({page: 'press'}, '', '/press');
                }
                window.showPressList();
            }
        });
    }

    startCarousel();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const images = document.querySelectorAll('.carousel-image');

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    images.forEach(img => img.style.display = 'none');

    carouselIndex = index;
    slides[carouselIndex].classList.add('active');
    dots[carouselIndex].classList.add('active');

    const imgIndex = carouselIndex % images.length;
    if (images[imgIndex]) {
        images[imgIndex].style.display = 'block';
    }

    resetCarousel();
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const nextIndex = (carouselIndex + 1) % slides.length;
    goToSlide(nextIndex);
}

function startCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 3000);
}

function resetCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 3000);
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}
