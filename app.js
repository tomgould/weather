// API Configuration
const API_KEY = '9c0e09a72bb01808057ddd72e429269a';
const API_BASE = 'https://api.openweathermap.org/data/2.5';

// Cities to display
const CITIES = [
    { name: 'London', country: 'GB', taxRate: 50 },
    { name: 'Tbilisi', country: 'GE', taxRate: 1 },
    { name: 'Paphos', country: 'CY', taxRate: 12.5 },
    { name: 'Bangkok', country: 'TH', taxRate: 30.5 },
    { name: 'Phuket', country: 'TH', taxRate: 30.5 },
    { name: 'Cancun', country: 'MX', taxRate: 26.5 }
];

// Weather icon mapping
const WEATHER_ICONS = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️'
};

// State
let weatherData = [];
let idealTemp = 30;
let carouselInterval = null;
let currentOffset = 0;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initThemeToggle();
    initIdealTempControl();
    loadWeatherData();

    // Update times every second
    setInterval(updateAllTimes, 1000);
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Ideal Temperature Control
function initIdealTempControl() {
    const input = document.getElementById('idealTemp');
    input.addEventListener('change', (e) => {
        idealTemp = parseInt(e.target.value);
        recalculateScores();
    });
}

// Weather Data Loading
async function loadWeatherData() {
    const carousel = document.getElementById('weatherCarousel');

    try {
        const weatherPromises = CITIES.map(city => fetchCityWeather(city));
        const results = await Promise.all(weatherPromises);

        // Filter out failed requests
        weatherData = results.filter(data => data !== null);

        if (weatherData.length === 0) {
            carousel.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ API Key Error</h3>
                    <p>Unable to fetch weather data. This is usually because:</p>
                    <ul style="text-align: left; margin: 1rem auto; max-width: 500px;">
                        <li>Your OpenWeatherMap API key needs to be activated (check your email)</li>
                        <li>New API keys can take 10-15 minutes to become active</li>
                        <li>The API key may be invalid</li>
                    </ul>
                    <p><strong>Current API Key:</strong> ${API_KEY.substring(0, 8)}...</p>
                    <p style="margin-top: 1rem;">
                        <a href="https://home.openweathermap.org/api_keys" target="_blank" style="color: #3b82f6; text-decoration: underline;">
                            Check your API keys at OpenWeatherMap
                        </a>
                    </p>
                </div>
            `;
            return;
        }

        // Calculate happiness scores
        calculateHappinessScores();

        // Sort by happiness score (highest first)
        weatherData.sort((a, b) => b.happinessScore - a.happinessScore);

        // Render cards
        renderCards();

        // Start carousel
        startCarousel();

    } catch (error) {
        console.error('Error loading weather data:', error);
        carousel.innerHTML = `
            <div class="error-message">
                <h3>❌ Error Loading Weather Data</h3>
                <p>${error.message}</p>
                <p style="margin-top: 1rem;">Please check the console for more details.</p>
            </div>
        `;
    }
}

// Fetch weather data for a city
async function fetchCityWeather(city) {
    try {
        const currentResponse = await fetch(
            `${API_BASE}/weather?q=${city.name},${city.country}&appid=${API_KEY}&units=metric`
        );

        if (!currentResponse.ok) {
            throw new Error(`Failed to fetch weather for ${city.name}`);
        }

        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(
            `${API_BASE}/forecast?q=${city.name},${city.country}&appid=${API_KEY}&units=metric`
        );

        if (!forecastResponse.ok) {
            throw new Error(`Failed to fetch forecast for ${city.name}`);
        }

        const forecastData = await forecastResponse.json();

        return {
            city: currentData.name,
            country: currentData.sys.country,
            timezone: currentData.timezone,
            taxRate: city.taxRate,
            current: {
                temp: Math.round(currentData.main.temp),
                feelsLike: Math.round(currentData.main.feels_like),
                description: currentData.weather[0].description,
                icon: currentData.weather[0].icon,
                humidity: currentData.main.humidity,
                windSpeed: currentData.wind.speed,
                pressure: currentData.main.pressure
            },
            forecast: processForecast(forecastData.list)
        };
    } catch (error) {
        console.error(`Error fetching weather for ${city.name}:`, error);
        return null;
    }
}

// Process forecast data
function processForecast(forecastList) {
    const dailyData = {};

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().split('T')[0];

        if (!dailyData[dateKey]) {
            dailyData[dateKey] = {
                date: date,
                temps: [],
                conditions: [],
                icons: []
            };
        }

        dailyData[dateKey].temps.push(item.main.temp);
        dailyData[dateKey].conditions.push(item.weather[0].description);
        dailyData[dateKey].icons.push(item.weather[0].icon);
    });

    return Object.values(dailyData).map(day => {
        const maxTemp = Math.round(Math.max(...day.temps));
        const minTemp = Math.round(Math.min(...day.temps));
        const mostCommonIcon = getMostCommon(day.icons);
        const mostCommonCondition = getMostCommon(day.conditions);

        return {
            date: day.date,
            maxTemp,
            minTemp,
            icon: mostCommonIcon,
            condition: mostCommonCondition
        };
    });
}

// Helper function
function getMostCommon(arr) {
    const counts = {};
    let maxCount = 0;
    let mostCommon = arr[0];

    arr.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
        if (counts[item] > maxCount) {
            maxCount = counts[item];
            mostCommon = item;
        }
    });

    return mostCommon;
}

// Calculate happiness scores
function calculateHappinessScores() {
    weatherData.forEach(data => {
        const tempScore = calculateTemperatureScore(data.current.temp);
        const taxScore = calculateTaxScore(data.taxRate);

        // 40% weather, 60% tax
        data.happinessScore = Math.round((tempScore * 0.4) + (taxScore * 0.6));
        data.tempScore = tempScore;
        data.taxScore = taxScore;
    });
}

// Calculate temperature score
function calculateTemperatureScore(temp) {
    // Perfect range: 28-32°C
    if (temp >= 28 && temp <= 32) {
        return 100;
    }

    // Below 28°C - linear penalty
    if (temp < 28) {
        // At 0°C = 0 score, at 28°C = 100 score
        return Math.max(0, (temp / 28) * 100);
    }

    // Above 32°C
    if (temp <= 40) {
        // Linear penalty from 32 to 40
        const penalty = ((temp - 32) / 8) * 100;
        return Math.max(0, 100 - penalty);
    }

    // Above 40°C - half rate penalty
    const penalty = ((temp - 32) / 16) * 100;
    return Math.max(0, 100 - penalty);
}

// Calculate tax score
function calculateTaxScore(taxRate) {
    // Intelligent curve
    // 0% = 100, 5% = 95, 15% = 80, 30% = 50, 50%+ = 0
    if (taxRate <= 5) {
        return 100 - taxRate;
    } else if (taxRate <= 15) {
        return 95 - ((taxRate - 5) * 1.5);
    } else if (taxRate <= 30) {
        return 80 - ((taxRate - 15) * 2);
    } else {
        return Math.max(0, 50 - ((taxRate - 30) * 2.5));
    }
}

// Get color for score
function getScoreColor(score) {
    if (score >= 75) {
        // Green range
        const t = (score - 75) / 25;
        return interpolateColor('#84cc16', '#22c55e', t);
    } else if (score >= 50) {
        // Yellow to green
        const t = (score - 50) / 25;
        return interpolateColor('#eab308', '#84cc16', t);
    } else if (score >= 25) {
        // Orange to yellow
        const t = (score - 25) / 25;
        return interpolateColor('#f97316', '#eab308', t);
    } else {
        // Red to orange
        const t = score / 25;
        return interpolateColor('#ef4444', '#f97316', t);
    }
}

// Interpolate between two hex colors
function interpolateColor(color1, color2, t) {
    const hex = (c) => parseInt(c.substring(1), 16);
    const r1 = (hex(color1) >> 16) & 0xff;
    const g1 = (hex(color1) >> 8) & 0xff;
    const b1 = hex(color1) & 0xff;
    const r2 = (hex(color2) >> 16) & 0xff;
    const g2 = (hex(color2) >> 8) & 0xff;
    const b2 = hex(color2) & 0xff;

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Get ordinal suffix
function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Get tax rate color
function getTaxRateColor(rate) {
    if (rate <= 5) return '#10b981';
    if (rate <= 15) return '#3b82f6';
    if (rate <= 30) return '#f59e0b';
    return '#ef4444';
}

// Render cards
function renderCards() {
    const carousel = document.getElementById('weatherCarousel');
    carousel.innerHTML = '';

    weatherData.forEach((data, index) => {
        const card = createCityCard(data, index + 1);
        carousel.appendChild(card);
    });

    createDots();
}

// Create city card
function createCityCard(data, rank) {
    const card = document.createElement('div');
    card.className = 'city-card';
    card.dataset.timezone = data.timezone;

    const scoreColor = getScoreColor(data.happinessScore);
    const taxColor = getTaxRateColor(data.taxRate);

    // Set CSS variables for gradients
    card.style.setProperty('--card-border-gradient', `linear-gradient(135deg, ${scoreColor}, ${scoreColor})`);
    card.style.setProperty('--card-bg-gradient', `linear-gradient(135deg, ${scoreColor}, ${scoreColor})`);

    const forecastHTML = data.forecast.map(day => {
        const dayName = day.date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const icon = WEATHER_ICONS[day.icon] || '🌡️';

        return `
            <div class="forecast-day">
                <div class="forecast-date">
                    <span class="day-name">${dayName}</span>
                    <span class="date">${dateStr}</span>
                </div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-condition">${day.condition}</div>
                <div class="forecast-temp">
                    <span class="temp-high">${day.maxTemp}°</span>
                    <span class="temp-low">${day.minTemp}°</span>
                </div>
            </div>
        `;
    }).join('');

    card.innerHTML = `
        <div class="rank-badge">${getOrdinal(rank)}</div>
        <div class="happiness-score">
            <div class="score-value">${data.happinessScore}</div>
            <div class="score-label">Score</div>
        </div>

        <div class="city-header">
            <div class="city-info">
                <h2>${data.city}, ${data.country}</h2>
                <div class="city-time">
                    <span>🕐</span>
                    <span class="time-display">--:--:--</span>
                </div>
            </div>
            <div class="tax-badge" style="background-color: ${taxColor}">
                <div class="tax-icon">💰</div>
                <div class="tax-info">
                    <div class="tax-rate">${data.taxRate}%</div>
                    <div class="tax-label">Tax Rate</div>
                </div>
            </div>
        </div>

        <div class="current-weather">
            <div class="weather-icon">${WEATHER_ICONS[data.current.icon] || '🌡️'}</div>
            <div class="current-temp">
                <div class="temp-display">${data.current.temp}°C</div>
                <div class="weather-description">${data.current.description}</div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <span>💧</span>
                        <span>${data.current.humidity}%</span>
                    </div>
                    <div class="weather-detail">
                        <span>💨</span>
                        <span>${data.current.windSpeed} m/s</span>
                    </div>
                    <div class="weather-detail">
                        <span>🌡️</span>
                        <span>Feels ${data.current.feelsLike}°</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="forecast-section">
            <h3 class="forecast-title">${data.forecast.length}-Day Forecast</h3>
            <div class="forecast-grid">
                ${forecastHTML}
            </div>
        </div>
    `;

    return card;
}

// Recalculate scores when ideal temp changes
function recalculateScores() {
    calculateHappinessScores();
    weatherData.sort((a, b) => b.happinessScore - a.happinessScore);
    renderCards();
    resetCarousel();
}

// Create dots
function createDots() {
    const dotsContainer = document.getElementById('carouselDots');
    dotsContainer.innerHTML = '';

    weatherData.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => scrollToCard(index));
        dotsContainer.appendChild(dot);
    });
}

// Carousel functionality
function startCarousel() {
    // Auto-scroll every 5 seconds
    carouselInterval = setInterval(() => {
        scrollCarousel();
    }, 5000);
}

function scrollCarousel() {
    const carousel = document.getElementById('weatherCarousel');
    const cardWidth = 450 + 32; // card width + gap

    currentOffset -= cardWidth;
    carousel.style.transform = `translateX(${currentOffset}px)`;

    // Check if we've moved past the first card
    setTimeout(() => {
        if (Math.abs(currentOffset) >= cardWidth) {
            // Remove first card and add to end
            const firstCard = carousel.firstElementChild;
            carousel.appendChild(firstCard);

            // Reset position without animation
            carousel.style.transition = 'none';
            currentOffset += cardWidth;
            carousel.style.transform = `translateX(${currentOffset}px)`;

            // Re-enable animation
            setTimeout(() => {
                carousel.style.transition = 'transform 0.5s ease-out';
            }, 50);
        }
    }, 500);
}

function scrollToCard(index) {
    // Reset carousel and scroll to specific card
    const carousel = document.getElementById('weatherCarousel');
    const cardWidth = 450 + 32;
    currentOffset = -index * cardWidth;
    carousel.style.transform = `translateX(${currentOffset}px)`;
    updateDots(index);
}

function resetCarousel() {
    currentOffset = 0;
    const carousel = document.getElementById('weatherCarousel');
    carousel.style.transform = `translateX(0)`;
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    startCarousel();
}

function updateDots(activeIndex) {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}

// Update times
function updateAllTimes() {
    document.querySelectorAll('.city-card').forEach(card => {
        const timezone = parseInt(card.dataset.timezone);
        const timeDisplay = card.querySelector('.time-display');
        if (timeDisplay && !isNaN(timezone)) {
            const localTime = getLocalTime(timezone);
            timeDisplay.textContent = localTime;
        }
    });
}

function getLocalTime(timezoneOffset) {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityTime = new Date(utc + (timezoneOffset * 1000));

    return cityTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}