// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeClocks();
    initializeCharts();
    setupNavigation();
    startRealTimeUpdates();
});

// Мировое время
function initializeClocks() {
    updateWorldTime();
    setInterval(updateWorldTime, 1000);
}

function updateWorldTime() {
    const now = new Date();
    
    // GMT
    const gmtTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    document.getElementById('gmt-time').textContent = formatTime(gmtTime);
    
    // Москва (GMT+3)
    const moscowTime = new Date(gmtTime.getTime() + (3 * 3600000));
    document.getElementById('moscow-time').textContent = formatTime(moscowTime);
    
    // Вашингтон (GMT-5)
    const washingtonTime = new Date(gmtTime.getTime() - (5 * 3600000));
    document.getElementById('washington-time').textContent = formatTime(washingtonTime);
    
    // Пекин (GMT+8)
    const beijingTime = new Date(gmtTime.getTime() + (8 * 3600000));
    document.getElementById('beijing-time').textContent = formatTime(beijingTime);
    
    // Обновляем часы судного дня
    updateDoomsdayClock();
}

function formatTime(date) {
    return date.toTimeString().slice(0, 8);
}

// Часы судного дня
function updateDoomsdayClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    
    // Имитация времени близкого к полуночи
    const doomsdayMinutes = 23;
    const doomsdaySeconds = 58 + (seconds % 2); // Мерцание между 58 и 59
    
    const doomsdayTime = `${doomsdayMinutes}:${doomsdaySeconds.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('doomsday-display').textContent = doomsdayTime;
    
    // Обновляем положение стрелки
    const totalSeconds = (doomsdayMinutes * 60) + doomsdaySeconds + (seconds / 60);
    const angle = (totalSeconds / 3600) * 360 - 90; // -90 для начала с 12 часов
    document.getElementById('doomsday-hand').style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

// Инициализация графиков
function initializeCharts() {
    const radioCanvas = document.getElementById('radioChart');
    const tensionCanvas = document.getElementById('tensionChart');
    
    if (radioCanvas) {
        const radioCtx = radioCanvas.getContext('2d');
        window.radioChart = new Chart(radioCtx, radioCanvas);
    }
    
    if (tensionCanvas) {
        const tensionCtx = tensionCanvas.getContext('2d');
        window.tensionChart = new Chart(tensionCtx, tensionCanvas);
    }
}

// Простая реализация Chart класса
class Chart {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.data = [];
        this.maxPoints = 50;
        this.animationId = null;
        
        // Генерируем начальные данные
        for (let i = 0; i < this.maxPoints; i++) {
            this.data.push(Math.random() * 100);
        }
        
        this.draw();
        this.startAnimation();
    }
    
    draw() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Настройки
        const padding = 20;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;
        
        // Рисуем сетку
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Горизонтальные линии
        for (let i = 0; i <= 4; i++) {
            const y = padding + (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
        
        // Вертикальные линии
        for (let i = 0; i <= 10; i++) {
            const x = padding + (width / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, canvas.height - padding);
            ctx.stroke();
        }
        
        // Рисуем график
        if (this.data.length > 1) {
            ctx.strokeStyle = this.getLineColor();
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let i = 0; i < this.data.length; i++) {
                const x = padding + (width / (this.maxPoints - 1)) * i;
                const y = canvas.height - padding - (this.data[i] / 100) * height;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            
            // Добавляем свечение
            ctx.shadowColor = this.getLineColor();
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
    
    getLineColor() {
        // Разные цвета для разных графиков
        if (this.canvas.id === 'radioChart') {
            const lastValue = this.data[this.data.length - 1];
            if (lastValue > 80) return '#ff4444';
            if (lastValue > 60) return '#ffaa00';
            return '#00ff88';
        } else {
            return '#4488ff';
        }
    }
    
    startAnimation() {
        const animate = () => {
            // Добавляем новую точку
            this.data.push(this.generateNewPoint());
            
            // Удаляем старые точки
            if (this.data.length > this.maxPoints) {
                this.data.shift();
            }
            
            this.draw();
            
            // Обновляем индикаторы
            this.updateIndicators();
            
            // Следующий кадр через случайное время
            setTimeout(() => {
                this.animationId = requestAnimationFrame(animate);
            }, 200 + Math.random() * 800);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    generateNewPoint() {
        const lastValue = this.data[this.data.length - 1];
        const change = (Math.random() - 0.5) * 20;
        let newValue = lastValue + change;
        
        // Ограничиваем значения
        newValue = Math.max(0, Math.min(100, newValue));
        
        // Добавляем случайные всплески
        if (Math.random() < 0.05) {
            newValue = Math.random() * 100;
        }
        
        return newValue;
    }
    
    updateIndicators() {
        const lastValue = this.data[this.data.length - 1];
        
        if (this.canvas.id === 'radioChart') {
            const indicator = document.getElementById('radio-status');
            if (lastValue > 70) {
                indicator.style.background = '#ff4444';
                indicator.style.boxShadow = '0 0 15px rgba(255, 68, 68, 0.8)';
            } else if (lastValue > 40) {
                indicator.style.background = '#ffaa00';
                indicator.style.boxShadow = '0 0 15px rgba(255, 170, 0, 0.8)';
            } else {
                indicator.style.background = '#00ff88';
                indicator.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.8)';
            }
        } else {
            const indicator = document.getElementById('tension-status');
            if (lastValue > 60) {
                indicator.style.background = '#ff8844';
                indicator.style.boxShadow = '0 0 15px rgba(255, 136, 68, 0.8)';
            } else {
                indicator.style.background = '#4488ff';
                indicator.style.boxShadow = '0 0 15px rgba(68, 136, 255, 0.8)';
            }
        }
    }
}

// Плавная навигация
function setupNavigation() {
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
}

// Запуск обновлений в реальном времени
function startRealTimeUpdates() {
    // Случайные изменения статуса индикаторов
    setInterval(() => {
        const systemStatus = document.getElementById('system-status');
        if (Math.random() < 0.1) {
            systemStatus.classList.toggle('active');
            setTimeout(() => {
                systemStatus.classList.add('active');
            }, 100);
        }
    }, 2000);
    
    // Случайные мерцания элементов
    setInterval(() => {
        const elements = document.querySelectorAll('.time-display, #doomsday-display');
        elements.forEach(element => {
            if (Math.random() < 0.05) {
                element.style.textShadow = '0 0 20px currentColor';
                setTimeout(() => {
                    element.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
                }, 100);
            }
        });
    }, 500);
}

// Функция для случайного изменения значений прогресса (если нужно)
function updateRandomProgress() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const currentWidth = parseInt(bar.style.width);
        const change = (Math.random() - 0.5) * 10;
        let newWidth = currentWidth + change;
        
        newWidth = Math.max(0, Math.min(100, newWidth));
        bar.style.width = newWidth + '%';
        
        // Обновляем текст
        const progressText = bar.parentElement.nextElementSibling;
        if (progressText && progressText.classList.contains('progress-text')) {
            progressText.textContent = Math.round(newWidth) + '%';
        }
    });
}

// Запускаем обновления прогресса каждые 30 секунд
setInterval(updateRandomProgress, 30000);
