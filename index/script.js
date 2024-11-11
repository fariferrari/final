document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles-container');
    const popularArticlesContainer = document.getElementById('popular-articles');
    const sortOptions = document.getElementById('sort-options');
    const themeToggle = document.getElementById('theme-toggle');

    let articlesData = [];

    fetch('articles.json')
        .then(response => {
            if (!response.ok) throw new Error('Error fetching articles');
            return response.json();
        })
        .then(data => {
            articlesData = data.articles;
            applySortingAndDisplay();
            renderPopularArticles();
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            articlesContainer.innerHTML = `<p>Error loading articles: ${error.message}</p>`;
        });

    function calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const words = content.split(" ").length;
        return `${Math.ceil(words / wordsPerMinute)} min read`;
    }

    function renderArticles(sortedArticles) {
        articlesContainer.innerHTML = '';
        sortedArticles.forEach(article => {
            const readingTime = calculateReadingTime(article.content);
            articlesContainer.innerHTML += `
                <div class="col">
                    <a href="page${article.id}.html?id=${article.id}" style="text-decoration: none; color: inherit;">
                        <div class="card">
                            <div class="card-body" style="background-image: url('${article.image}');">
                                <div style="background: rgba(0, 0, 0, 0.5); padding: 10px;">
                                    <h5>${article.title}</h5>
                                    <p>${article.date} | ${article.category}</p>
                                    <small><i class="fas fa-eye"></i> ${article.views} | ${readingTime}</small>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        });
    }

    function renderPopularArticles() {
        const mostPopularArticles = [...articlesData].sort((a, b) => b.views - a.views).slice(0, 3);
        popularArticlesContainer.innerHTML = '';
        mostPopularArticles.forEach(article => {
            popularArticlesContainer.innerHTML += `
                <li class="list-group-item">
                    <a href="page${article.id}.html?id=${article.id}" class="popular-article-link">${article.title}</a>
                </li>
            `;
        });
    }

    function applySortingAndDisplay() {
        const sortedArticles = sortArticles();
        renderArticles(sortedArticles);
    }

    function sortArticles() {
        const sortedArticles = [...articlesData];
        if (sortOptions.value === 'popularity') {
            sortedArticles.sort((a, b) => b.views - a.views);
        } else {
            sortedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        return sortedArticles;
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.body.classList.add(savedTheme);

    themeToggle.addEventListener('click', toggleTheme);
    sortOptions.addEventListener('change', applySortingAndDisplay);
});
