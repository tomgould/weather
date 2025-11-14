// API Configuration
const API_KEY = '9c0e09a72bb01808057ddd72e429269a';
const API_BASE = 'https://api.openweathermap.org/data/2.5';

// Cities with cost of living data (all prices converted to GBP for easy comparison)
// Source: Numbeo (November 2025)
const CITIES = [
    {
        name: 'London',
        country: 'GB',
        taxRate: 50,
        costOfLiving: {
            currency: 'GBP',
            items: {
                'Meal at Inexpensive Restaurant': 20.00,
                'Domestic Beer (Pint)': 6.50,
                'Cappuccino': 4.01,
                'Milk (1L)': 1.28,
                'Bread (Loaf)': 1.42,
                'Cigarettes (Pack of 20)': 16.90,
                '1 Bedroom Apartment (City Centre)': 2346.27,
                'Internet (60 Mbps)': 33.20,
                'Monthly Transport Pass': 180.00,
                'Utilities (Monthly, 85m²)': 256.98
            }
        }
    },
    {
        name: 'Tbilisi',
        country: 'GE',
        taxRate: 1,
        costOfLiving: {
            currency: 'GEL',
            exchangeRate: 0.29,
            items: {
                'Meal at Inexpensive Restaurant': 30.00,
                'Domestic Beer (Pint)': 6.00,
                'Cappuccino': 8.09,
                'Milk (1L)': 5.09,
                'Bread (Loaf)': 1.81,
                'Cigarettes (Pack of 20)': 8.10,
                '1 Bedroom Apartment (City Centre)': 1962.12,
                'Internet (60 Mbps)': 54.53,
                'Monthly Transport Pass': 40.00,
                'Utilities (Monthly, 85m²)': 208.73
            }
        }
    },
    {
        name: 'Paphos',
        country: 'CY',
        taxRate: 12.5,
        costOfLiving: {
            currency: 'EUR',
            exchangeRate: 0.84,
            items: {
                'Meal at Inexpensive Restaurant': 15.00,
                'Domestic Beer (Pint)': 3.00,
                'Cappuccino': 3.24,
                'Milk (1L)': 1.61,
                'Bread (Loaf)': 1.13,
                'Cigarettes (Pack of 20)': 5.00,
                '1 Bedroom Apartment (City Centre)': 955.56,
                'Internet (60 Mbps)': 32.00,
                'Monthly Transport Pass': 50.00,
                'Utilities (Monthly, 85m²)': 163.14
            }
        }
    },
    {
        name: 'Bangkok',
        country: 'TH',
        taxRate: 30.5,
        costOfLiving: {
            currency: 'THB',
            exchangeRate: 0.023,
            items: {
                'Meal at Inexpensive Restaurant': 100.00,
                'Domestic Beer (Pint)': 90.00,
                'Cappuccino': 81.92,
                'Milk (1L)': 58.29,
                'Bread (Loaf)': 42.13,
                'Cigarettes (Pack of 20)': 140.00,
                '1 Bedroom Apartment (City Centre)': 21760.33,
                'Internet (60 Mbps)': 546.78,
                'Monthly Transport Pass': 1200.00,
                'Utilities (Monthly, 85m²)': 2896.97
            }
        }
    },
    {
        name: 'Phuket',
        country: 'TH',
        taxRate: 30.5,
        costOfLiving: {
            currency: 'THB',
            exchangeRate: 0.023,
            items: {
                'Meal at Inexpensive Restaurant': 120.00,
                'Domestic Beer (Pint)': 100.00,
                'Cappuccino': 95.00,
                'Milk (1L)': 65.00,
                'Bread (Loaf)': 48.00,
                'Cigarettes (Pack of 20)': 145.00,
                '1 Bedroom Apartment (City Centre)': 23500.00,
                'Internet (60 Mbps)': 600.00,
                'Monthly Transport Pass': 1300.00,
                'Utilities (Monthly, 85m²)': 3150.00
            }
        }
    },
    {
        name: 'Cancun',
        country: 'MX',
        taxRate: 26.5,
        costOfLiving: {
            currency: 'MXN',
            exchangeRate: 0.041,
            items: {
                'Meal at Inexpensive Restaurant': 231.71,
                'Domestic Beer (Pint)': 57.50,
                'Cappuccino': 63.86,
                'Milk (1L)': 26.87,
                'Bread (Loaf)': 42.51,
                'Cigarettes (Pack of 20)': 80.00,
                '1 Bedroom Apartment (City Centre)': 12285.71,
                'Internet (60 Mbps)': 700.00,
                'Monthly Transport Pass': 500.00,
                'Utilities (Monthly, 85m²)': 3233.33
            }
        }
    }
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
let isMobile = window.innerWidth <= 768;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initThemeToggle();
    initIdealTempControl();
    loadWeatherData();

    setInterval(updateAllTimes, 1000);

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
    });
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

// Get UK timezone offset (accounting for DST)
function getUKTimezoneOffset() {
    const ukTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/London' });
    const ukDate = new Date(ukTime);

    const utcTime = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
    const utcDate = new Date(utcTime);

    const offsetMs = ukDate - utcDate;
    return offsetMs / 1000;
}

// Calculate timezone difference from UK in hours
function getTimezoneOffsetFromUK(cityTimezoneOffset) {
    const ukOffset = getUKTimezoneOffset();
    const differenceSeconds = cityTimezoneOffset - ukOffset;
    return differenceSeconds / 3600;
}

// Format timezone difference for display
function formatTimezoneOffset(hours) {
    const absHours = Math.abs(hours);
    const wholeHours = Math.floor(absHours);
    const minutes = Math.round((absHours - wholeHours) * 60);

    if (hours === 0) {
        return 'Same as UK';
    }

    const sign = hours > 0 ? '+' : '';
    if (minutes === 0) {
        return `${sign}${wholeHours}h from UK`;
    }
    return `${sign}${wholeHours}h ${minutes}m from UK`;
}

// Convert cost to GBP for comparison
function convertToGBP(amount, currency, exchangeRate) {
    if (currency === 'GBP') {
        return amount;
    }
    return amount * exchangeRate;
}

// Calculate total monthly cost in GBP
function calculateTotalMonthlyCost(city) {
    const items = city.costOfLiving.items;
    const exchangeRate = city.costOfLiving.exchangeRate || 1;

    const rentGBP = convertToGBP(items['1 Bedroom Apartment (City Centre)'], city.costOfLiving.currency, exchangeRate);
    const utilitiesGBP = convertToGBP(items['Utilities (Monthly, 85m²)'], city.costOfLiving.currency, exchangeRate);
    const transportGBP = convertToGBP(items['Monthly Transport Pass'], city.costOfLiving.currency, exchangeRate);
    const internetGBP = convertToGBP(items['Internet (60 Mbps)'], city.costOfLiving.currency, exchangeRate);
    const mealGBP = convertToGBP(items['Meal at Inexpensive Restaurant'], city.costOfLiving.currency, exchangeRate);

    const monthlyFood = mealGBP * 30 * 2;
    const monthlyTotal = rentGBP + utilitiesGBP + transportGBP + internetGBP + monthlyFood;

    return monthlyTotal;
}

// Calculate cost of living score (0-100, lower cost = higher score)
function calculateCostOfLivingScore(city, allCities) {
    const costs = allCities.map(c => calculateTotalMonthlyCost(c));
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const currentCost = calculateTotalMonthlyCost(city);

    if (maxCost === minCost) return 100;
    const score = 100 - ((currentCost - minCost) / (maxCost - minCost) * 100);
    return Math.max(0, Math.min(100, score));
}

// Weather Data Loading
async function loadWeatherData() {
    const carousel = document.getElementById('weatherCarousel');

    try {
        const weatherPromises = CITIES.map(city => fetchCityWeather(city));
        const results = await Promise.all(weatherPromises);

        weatherData = results.filter(data => data !== null);

        if (weatherData.length === 0) {
            carousel.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ API Key Error</h3>
                    <p>Unable to fetch weather data.</p>
                </div>
            `;
            return;
        }

        calculateHappinessScores();
        weatherData.sort((a, b) => b.happinessScore - a.happinessScore);
        renderCards();
        // startCarousel();

    } catch (error) {
        console.error('Error loading weather data:', error);
        carousel.innerHTML = `
            <div class="error-message">
                <h3>❌ Error Loading Weather Data</h3>
                <p>${error.message}</p>
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
            costOfLiving: city.costOfLiving,
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
        const timezoneOffsetHours = getTimezoneOffsetFromUK(data.timezone);
        const timezoneScore = calculateTimezoneScore(timezoneOffsetHours);
        const costScore = calculateCostOfLivingScore(data, weatherData);

        data.tempScore = tempScore;
        data.taxScore = taxScore;
        data.timezoneScore = timezoneScore;
        data.costScore = costScore;
        data.timezoneOffsetHours = timezoneOffsetHours;

        // Weighting: 50% tax, 20% weather, 15% timezone, 15% cost of living
        data.happinessScore = Math.round(
            (taxScore * 0.5) + (tempScore * 0.2) + (timezoneScore * 0.15) + (costScore * 0.15)
        );
    });
}

// Calculate temperature score
function calculateTemperatureScore(temp) {
    if (temp >= 28 && temp <= 32) {
        return 100;
    }

    if (temp < 28) {
        return Math.max(0, (temp / 28) * 100);
    }

    if (temp <= 40) {
        const penalty = ((temp - 32) / 8) * 100;
        return Math.max(0, 100 - penalty);
    }

    const penalty = ((temp - 32) / 16) * 100;
    return Math.max(0, 100 - penalty);
}

// Calculate tax score
function calculateTaxScore(taxRate) {
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

// Calculate timezone score
function calculateTimezoneScore(hoursDifference) {
    const absHours = Math.abs(hoursDifference);

    if (absHours >= 12) {
        return 0;
    }

    return Math.round(100 - (absHours / 12 * 100));
}

// Get color for score
function getScoreColor(score) {
    if (score >= 75) {
        const t = (score - 75) / 25;
        return interpolateColor('#84cc16', '#22c55e', t);
    } else if (score >= 50) {
        const t = (score - 50) / 25;
        return interpolateColor('#eab308', '#84cc16', t);
    } else if (score >= 25) {
        const t = (score - 25) / 25;
        return interpolateColor('#f97316', '#eab308', t);
    } else {
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

// Format currency
function formatCurrency(amount, currency) {
    const symbols = {
        'GBP': '£',
        'EUR': '€',
        'USD': '$',
        'THB': '฿',
        'GEL': '₾',
        'MXN': '$'
    };
    return `${symbols[currency] || ''}${amount.toFixed(2)}`;
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

    card.style.setProperty('--card-border-gradient', `linear-gradient(135deg, ${scoreColor}, ${scoreColor})`);
    card.style.setProperty('--card-bg-gradient', `linear-gradient(135deg, ${scoreColor}, ${scoreColor})`);

    // Cost of living items HTML
    const costItemsHTML = Object.entries(data.costOfLiving.items).map(([item, price]) => {
        const priceGBP = convertToGBP(price, data.costOfLiving.currency, data.costOfLiving.exchangeRate || 1);
        return `
            <div class="cost-item">
                <span class="cost-label">${item}</span>
                <span class="cost-value">${formatCurrency(price, data.costOfLiving.currency)} <span class="cost-gbp">(£${priceGBP.toFixed(2)})</span></span>
            </div>
        `;
    }).join('');

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
                <div class="timezone-offset">
                    <span>🌍</span>
                    <span>${formatTimezoneOffset(data.timezoneOffsetHours)}</span>
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

        <div class="score-breakdown">
            <h3 class="breakdown-title">Score Breakdown</h3>
            <div class="breakdown-grid">
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <span class="breakdown-icon">💰</span>
                        <span>Tax (50%)</span>
                    </div>
                    <div class="breakdown-score" style="color: ${getScoreColor(data.taxScore)}">${Math.round(data.taxScore)}</div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <span class="breakdown-icon">🌡️</span>
                        <span>Weather (20%)</span>
                    </div>
                    <div class="breakdown-score" style="color: ${getScoreColor(data.tempScore)}">${Math.round(data.tempScore)}</div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <span class="breakdown-icon">🌍</span>
                        <span>Timezone (15%)</span>
                    </div>
                    <div class="breakdown-score" style="color: ${getScoreColor(data.timezoneScore)}">${Math.round(data.timezoneScore)}</div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <span class="breakdown-icon">💷</span>
                        <span>Cost of Living (15%)</span>
                    </div>
                    <div class="breakdown-score" style="color: ${getScoreColor(data.costScore)}">${Math.round(data.costScore)}</div>
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

        <div class="cost-of-living-section">
            <h3 class="cost-title">💷 Cost of Living</h3>
            <div class="cost-grid">
                ${costItemsHTML}
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

// Recalculate scores
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
    carouselInterval = setInterval(() => {
        scrollCarousel();
    }, 5000);
}

function getCardWidth() {
    if (isMobile) {
        return window.innerWidth - 16;
    }
    return 450 + 32;
}

function scrollCarousel() {
    const carousel = document.getElementById('weatherCarousel');
    const cardWidth = getCardWidth();

    currentOffset -= (cardWidth + (isMobile ? 16 : 0));
    carousel.style.transform = `translateX(${currentOffset}px)`;

    setTimeout(() => {
        if (Math.abs(currentOffset) >= cardWidth) {
            const firstCard = carousel.firstElementChild;
            carousel.appendChild(firstCard);

            carousel.style.transition = 'none';
            currentOffset += (cardWidth + (isMobile ? 16 : 0));
            carousel.style.transform = `translateX(${currentOffset}px)`;

            requestAnimationFrame(() => {
                setTimeout(() => {
                    carousel.style.transition = 'transform 0.5s ease-out';
                }, 50);
            });
        }
    }, 500);
}

function scrollToCard(index) {
    const carousel = document.getElementById('weatherCarousel');
    const cardWidth = getCardWidth();
    currentOffset = -index * (cardWidth + (isMobile ? 16 : 0));
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
    // startCarousel();  // Auto-pagination disabled
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

// Touch/Swipe support for carousel
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistanceX = touchEndX - touchStartX;
    const swipeDistanceY = Math.abs(touchEndY - touchStartY);

    // Only trigger if horizontal swipe is greater than vertical (to avoid interfering with scrolling)
    if (Math.abs(swipeDistanceX) > swipeThreshold && Math.abs(swipeDistanceX) > swipeDistanceY) {
        const currentIndex = Math.round(Math.abs(currentOffset) / getCardWidth());

        if (swipeDistanceX < 0) {
            // Swipe left - go to next card
            const nextIndex = Math.min(currentIndex + 1, weatherData.length - 1);
            scrollToCard(nextIndex);
        } else {
            // Swipe right - go to previous card
            const prevIndex = Math.max(currentIndex - 1, 0);
            scrollToCard(prevIndex);
        }
    }
}

// Add touch event listeners to carousel
const carousel = document.getElementById('weatherCarousel');

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });


