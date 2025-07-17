// GitHub интеграция
async function loadGitHubRepos() {
    try {
        const username = 'Sokol41'; // Ваш GitHub username
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        const container = document.getElementById('repos-container');
        container.innerHTML = '';
        
        repos.forEach(repo => {
            if (!repo.fork && !repo.private) {
                createRepoCard(repo);
            }
        });
    } catch (error) {
        console.log('GitHub API недоступен');
        document.getElementById('repos-container').innerHTML = 
            '<div class="loading">GitHub projects temporarily unavailable</div>';
    }
}

function createRepoCard(repo) {
    const html = `
        <div class="repo-card">
            <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
            <p>${repo.description || 'No description provided'}</p>
            <div class="repo-stats">
                <span>⭐ ${repo.stargazers_count}</span>
                <span>🍴 ${repo.forks_count}</span>
                <span>💻 ${repo.language || 'Mixed'}</span>
            </div>
        </div>
    `;
    document.getElementById('repos-container').innerHTML += html;
}

// Плавная прокрутка для навигации
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Загрузка GitHub репозиториев при загрузке страницы
    loadGitHubRepos();
});

// Анимация прогресс-баров
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Запуск анимации при скролле к секции
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id === 'progress') {
            animateProgressBars();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const progressSection = document.getElementById('progress');
    if (progressSection) {
        observer.observe(progressSection);
    }
});
