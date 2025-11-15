// Main application logic

let weatherData = [];
let currentOffset = 0;
let isMobile = window.innerWidth <= 768;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initProfilePanel();
    initThemeToggle();
    initIdealTempControl();
    initKeyboardNavigation();
    initExportButton();
    loadWeatherData();

    setInterval(updateAllTimes, 1000);

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
    });
});

// Theme management
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

// Profile panel
function initProfilePanel() {
    const panel = document.getElementById('profilePanel');
    const toggleBtn = document.getElementById('profileToggle');
    const closeBtn = document.getElementById('closeProfile');
    const applyBtn = document.getElementById('applyProfile');
    const resetBtn = document.getElementById('resetProfile');
    const saveBtn = document.getElementById('saveProfile');
    const loadBtn = document.getElementById('loadProfile');

    // Load current profile into UI
    loadProfileToUI();

    // Toggle panel
    toggleBtn.addEventListener('click', () => {
        panel.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('open');
    });

    // Weight sliders
    const weightSliders = ['tax', 'weather', 'cost', 'safety', 'healthcare', 'police', 'alcohol', 'cannabis', 'timezone', 'corruption'];
    weightSliders.forEach(name => {
        const slider = document.getElementById(`${name}Weight`);
        const valueDisplay = document.getElementById(`${name}WeightValue`);

        slider.addEventListener('input', () => {
            valueDisplay.textContent = `${slider.value}%`;
            updateWeightTotal();
        });
    });

    // Apply changes
    applyBtn.addEventListener('click', () => {
        saveProfileFromUI();
        panel.classList.remove('open');
        recalculateAndRender();
    });

    // Reset to defaults
    resetBtn.addEventListener('click', () => {
        if (confirm('Reset to default profile settings?')) {
            userProfile.reset();
            loadProfileToUI();
            recalculateAndRender();
        }
    });

    // Save profile
    saveBtn.addEventListener('click', () => {
        saveProfileFromUI();
        userProfile.exportProfile();
    });

    // Load profile
    loadBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (userProfile.importProfile(event.target.result)) {
                    loadProfileToUI();
                    recalculateAndRender();
                    alert('Profile loaded successfully!');
                } else {
                    alert('Error loading profile file.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });
}

function loadProfileToUI() {
    const profile = userProfile.profile;

    document.getElementById('ethnicity').value = profile.ethnicity;
    document.getElementById('religion').value = profile.religion;
    document.getElementById('gender').value = profile.gender;
    document.getElementById('lgbtq').checked = profile.lgbtq;
    document.getElementById('alcoholPreference').value = profile.alcoholPreference;
    document.getElementById('cannabisPreference').value = profile.cannabisPreference;
    document.getElementById('idealTemp').value = profile.idealTemp;

    // Load weights
    Object.entries(profile.weights).forEach(([key, value]) => {
        const mappedKey = key === 'costOfLiving' ? 'cost' : key === 'policeRisk' ? 'police' : key;
        const slider = document.getElementById(`${mappedKey}Weight`);
        const valueDisplay = document.getElementById(`${mappedKey}WeightValue`);
        if (slider) {
            slider.value = value;
            valueDisplay.textContent = `${value}%`;
        }
    });

    updateWeightTotal();
}

function saveProfileFromUI() {
    const updates = {
        ethnicity: document.getElementById('ethnicity').value,
        religion: document.getElementById('religion').value,
        gender: document.getElementById('gender').value,
        lgbtq: document.getElementById('lgbtq').checked,
        alcoholPreference: document.getElementById('alcoholPreference').value,
        cannabisPreference: document.getElementById('cannabisPreference').value,
        idealTemp: parseInt(document.getElementById('idealTemp').value),
        weights: {
            tax: parseInt(document.getElementById('taxWeight').value),
            weather: parseInt(document.getElementById('weatherWeight').value),
            costOfLiving: parseInt(document.getElementById('costWeight').value),
            safety: parseInt(document.getElementById('safetyWeight').value),
            healthcare: parseInt(document.getElementById('healthcareWeight').value),
            policeRisk: parseInt(document.getElementById('policeWeight').value),
            alcohol: parseInt(document.getElementById('alcoholWeight').value),
            cannabis: parseInt(document.getElementById('cannabisWeight').value),
            timezone: parseInt(document.getElementById('timezoneWeight').value),
            corruption: parseInt(document.getElementById('corruptionWeight').value)
        }
    };

    userProfile.update(updates);
}

function updateWeightTotal() {
    const total = ['tax', 'weather', 'cost', 'safety', 'healthcare', 'police', 'alcohol', 'cannabis', 'timezone', 'corruption']
        .reduce((sum, name) => {
            const slider = document.getElementById(`${name}Weight`);
            return sum + parseInt(slider.value);
        }, 0);

    document.getElementById('totalWeight').textContent = total;
    const warning = document.getElementById('weightWarning');

    if (total !== 100) {
        warning.style.display = 'inline';
    } else {
        warning.style.display = 'none';
    }
}

// Ideal temperature control
function initIdealTempControl() {
    const input = document.getElementById('idealTemp');
    input.addEventListener('change', () => {
        userProfile.update({ idealTemp: parseInt(input.value) });
        recalculateAndRender();
    });
}

// Keyboard navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

        const currentIndex = Math.round(Math.abs(currentOffset) / (getCardWidth() + (isMobile ? 16 : 32)));

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollToCard(Math.max(currentIndex - 1, 0));
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollToCard(Math.min(currentIndex + 1, weatherData.length - 1));
        }
    });
}

// Export button
function initExportButton() {
    document.getElementById('exportCsv').addEventListener('click', () => {
        exportToCSV(weatherData);
    });
}

// Weather data loading
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

        recalculateAndRender();

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
            ...city,
            city: currentData.name,
            country: currentData.sys.country,
            timezone: currentData.timezone,
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

        const getMostCommon = (arr) => {
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
        };

        return {
            date: day.date,
            maxTemp,
            minTemp,
            icon: getMostCommon(day.icons),
            condition: getMostCommon(day.conditions)
        };
    });
}

// Recalculate scores and render
function recalculateAndRender() {
    const profile = userProfile.profile;

    weatherData.forEach(city => {
        city.happinessScore = calculateHappinessScore(city, profile, weatherData);
    });

    weatherData.sort((a, b) => b.happinessScore - a.happinessScore);
    renderCards();
    resetCarousel();
}

// Render cards
function renderCards() {
    const carousel = document.getElementById('weatherCarousel');
    carousel.innerHTML = '';

    // Get all scores for emoji calculation
    const allScores = weatherData.map(d => d.happinessScore);

    weatherData.forEach((data, index) => {
        const cardHTML = createCityCard(data, index + 1, allScores);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHTML;
        carousel.appendChild(tempDiv.firstElementChild);
    });

    createDots();
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
function getCardWidth() {
    return isMobile ? window.innerWidth - 32 : 450;
}

function scrollToCard(index) {
    const carousel = document.getElementById('weatherCarousel');
    const cardWidth = getCardWidth();
    const gap = isMobile ? 16 : 32;
    currentOffset = -index * (cardWidth + gap);
    carousel.style.transform = `translateX(${currentOffset}px)`;
    updateDots(index);
}

function resetCarousel() {
    currentOffset = 0;
    const carousel = document.getElementById('weatherCarousel');
    carousel.style.transform = `translateX(0)`;
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
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const cityTime = new Date(utc + (timezone * 1000));

            timeDisplay.textContent = cityTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        }
    });
}

// Touch/Swipe support
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistanceX = touchEndX - touchStartX;
    const swipeDistanceY = Math.abs(touchEndY - touchStartY);

    if (Math.abs(swipeDistanceX) > swipeThreshold && Math.abs(swipeDistanceX) > swipeDistanceY) {
        const cardWidth = getCardWidth();
        const gap = isMobile ? 16 : 32;
        const currentIndex = Math.round(Math.abs(currentOffset) / (cardWidth + gap));

        if (swipeDistanceX < 0) {
            scrollToCard(Math.min(currentIndex + 1, weatherData.length - 1));
        } else {
            scrollToCard(Math.max(currentIndex - 1, 0));
        }
    }
}

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

