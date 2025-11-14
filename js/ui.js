// UI rendering and DOM manipulation

// Color interpolation for score visualization
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

// Get emoji for score
function getScoreEmoji(score) {
    if (score >= 90) return '😍';
    if (score >= 80) return '😊';
    if (score >= 70) return '🙂';
    if (score >= 60) return '😐';
    if (score >= 50) return '😕';
    if (score >= 40) return '😟';
    if (score >= 30) return '😢';
    if (score >= 20) return '😭';
    return '😡';
}

// Get lifestyle indicator display
function getLifestyleDisplay(score, type) {
    let icon, text, color;

    if (type === 'cannabis') {
        if (score >= 80) {
            icon = '✅'; text = 'Legal'; color = '#22c55e';
        } else if (score >= 60) {
            icon = '🟢'; text = 'Friendly'; color = '#84cc16';
        } else if (score >= 40) {
            icon = '⚠️'; text = 'Neutral'; color = '#eab308';
        } else if (score >= 20) {
            icon = '🟠'; text = 'Risky'; color = '#f97316';
        } else {
            icon = '🚫'; text = 'Illegal'; color = '#ef4444';
        }
    } else { // alcohol
        if (score >= 80) {
            icon = '🍺'; text = 'Widely Available'; color = '#22c55e';
        } else if (score >= 60) {
            icon = '🍻'; text = 'Available'; color = '#84cc16';
        } else if (score >= 40) {
            icon = '⚠️'; text = 'Limited'; color = '#eab308';
        } else if (score >= 20) {
            icon = '🚫'; text = 'Restricted'; color = '#f97316';
        } else {
            icon = '❌'; text = 'Illegal'; color = '#ef4444';
        }
    }

    return { icon, text, color, percentage: score };
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
        'GBP': '£', 'EUR': '€', 'USD': '$', 'THB': '฿',
        'GEL': '₾', 'MXN': '$', 'AED': 'د.إ', 'NOK': 'kr',
        'DKK': 'kr', 'ISK': 'kr', 'MNT': '₮', 'RUB': '₽',
        'UAH': '₴', 'PLN': 'zł', 'CAD': '$', 'AUD': '$',
        'EGP': 'E£', 'ZAR': 'R', 'KES': 'KSh', 'NGN': '₦'
    };
    return `${symbols[currency] || ''}${amount.toFixed(2)}`;
}

// Create bar chart HTML
function createBarChart(data, maxEntries = 5) {
    const sortedEntries = Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxEntries);

    return sortedEntries.map(([label, percentage]) => {
        const color = getScoreColor(percentage);
        return `
            <div class="bar-chart-item">
                <div class="bar-chart-label">${label}</div>
                <div class="bar-chart-container">
                    <div class="bar-chart-bar" style="width: ${percentage}%; background-color: ${color};"></div>
                    <div class="bar-chart-value">${percentage.toFixed(1)}%</div>
                </div>
            </div>
        `;
    }).join('');
}

// Create city card
function createCityCard(data, rank) {
    const scoreColor = getScoreColor(data.happinessScore);
    const taxColor = getTaxRateColor(data.taxRate);
    const scoreEmoji = getScoreEmoji(data.happinessScore);
    const weedDisplay = getLifestyleDisplay(data.weedFriendly, 'cannabis');
    const alcoholDisplay = getLifestyleDisplay(data.alcoholFriendly, 'alcohol');
    const profile = userProfile.profile;

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

    return `
        <div class="city-card" data-timezone="${data.timezone}">
            <div class="rank-badge">${getOrdinal(rank)}</div>
            <div class="happiness-score">
                <div class="score-value">
                    <span class="score-number">${data.happinessScore}</span>
                    <span class="score-emoji">${scoreEmoji}</span>
                </div>
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

            <div class="lifestyle-indicators">
                <div class="lifestyle-indicator" style="background-color: ${weedDisplay.color}">
                    <span class="lifestyle-icon">${weedDisplay.icon}</span>
                    <span class="lifestyle-text">Cannabis: ${weedDisplay.text} (${weedDisplay.percentage}%)</span>
                </div>
                <div class="lifestyle-indicator" style="background-color: ${alcoholDisplay.color}">
                    <span class="lifestyle-icon">${alcoholDisplay.icon}</span>
                    <span class="lifestyle-text">Alcohol: ${alcoholDisplay.text} (${alcoholDisplay.percentage}%)</span>
                </div>
            </div>

            <div class="score-breakdown">
                <h3 class="breakdown-title">Score Breakdown</h3>
                <div class="breakdown-grid">
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">💰</span>
                            <span>Tax (${profile.weights.tax}%)</span>
                        </div>
                        <div class="breakdown-score" style="color: ${getScoreColor(data.taxScore)}">${Math.round(data.taxScore)}</div>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">🌡️</span>
                            <span>Weather (${profile.weights.weather}%)</span>
                        </div>
                        <div class="breakdown-score" style="color: ${getScoreColor(data.tempScore)}">${Math.round(data.tempScore)}</div>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">💷</span>
                            <span>Cost (${profile.weights.costOfLiving}%)</span>
                        </div>
                        <div class="breakdown-score" style="color: ${getScoreColor(data.costScore)}">${Math.round(data.costScore)}</div>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">🛡️</span>
                            <span>Safety (${profile.weights.safety}%)</span>
                        </div>
                        <div class="breakdown-score" style="color: ${getScoreColor(data.safetyScore)}">${Math.round(data.safetyScore)}</div>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">🏥</span>
                            <span>Healthcare (${profile.weights.healthcare}%)</span>
                        </div>
                        <div class="breakdown-score" style="color: ${getScoreColor(data.healthcareScore)}">${Math.round(data.healthcareScore)}</div>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">🌿</span>
                            <span>Cannabis (${profile.weights.cannabis}%)</span>
                        </div>
                        <div class="breakdown-score" style="color: ${getScoreColor(data.cannabisScore)}">${Math.round(data.cannabisScore)}</div>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">👮</span>
                            <span>Police (${profile.weights.policeRisk}%)</span>
                        </div>
                        <div class="breakdown-score" style="color: ${getScoreColor(data.policeScore)}">${Math.round(data.policeScore)}</div>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">🍺</span>
                            <span>Alcohol (${profile.weights.alcohol}%)</span>
                        </div>
                        <div class="breakdown-score" style="color: ${getScoreColor(data.alcoholScore)}">${Math.round(data.alcoholScore)}</div>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">🌍</span>
                            <span>Timezone (${profile.weights.timezone}%)</span>
                        </div>
                        <div class="breakdown-score" style="color: ${getScoreColor(data.timezoneScore)}">${Math.round(data.timezoneScore)}</div>
                    </div>
                </div>
            </div>

            <div class="demographics-section">
                <h3 class="demographics-title">🛡️ Safety Breakdown</h3>
                <div class="safety-grid">
                    <div class="safety-item">
                        <div class="safety-label">
                            <span class="safety-icon">⚔️</span>
                            <span>War Risk</span>
                        </div>
                        <div class="safety-score" style="color: ${getScoreColor(data.safety.war)}">${data.safety.war}</div>
                    </div>
                    <div class="safety-item">
                        <div class="safety-label">
                            <span class="safety-icon">💣</span>
                            <span>Terrorism Risk</span>
                        </div>
                        <div class="safety-score" style="color: ${getScoreColor(data.safety.terrorism)}">${data.safety.terrorism}</div>
                    </div>
                    <div class="safety-item">
                        <div class="safety-label">
                            <span class="safety-icon">🤝</span>
                            <span>Cultural Safety</span>
                        </div>
                        <div class="safety-score" style="color: ${getScoreColor(data.safety.cultural)}">${data.safety.cultural}</div>
                    </div>
                </div>
            </div>

            <div class="demographics-section">
                <h3 class="demographics-title">🏥 Healthcare</h3>
                <div class="healthcare-grid">
                    <div class="healthcare-item">
                        <div class="healthcare-label">
                            <span class="healthcare-icon">⭐</span>
                            <span>Quality</span>
                        </div>
                        <div class="healthcare-score" style="color: ${getScoreColor(data.healthcare.quality)}">${data.healthcare.quality}</div>
                    </div>
                    <div class="healthcare-item">
                        <div class="healthcare-label">
                            <span class="healthcare-icon">💵</span>
                            <span>Affordability</span>
                        </div>
                        <div class="healthcare-score" style="color: ${getScoreColor(data.healthcare.cost)}">${data.healthcare.cost}</div>
                    </div>
                </div>
            </div>

            <div class="demographics-section">
                <h3 class="demographics-title">🙏 Religion</h3>
                <div class="bar-chart">
                    ${createBarChart(data.religion)}
                </div>
            </div>

            <div class="demographics-section">
                <h3 class="demographics-title">👥 Ethnicity</h3>
                <div class="bar-chart">
                    ${createBarChart(data.ethnicity)}
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
        </div>
    `;
}

