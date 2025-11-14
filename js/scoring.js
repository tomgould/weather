// All scoring algorithms with profile integration

// Helper: Get ethnicity category percentages
function getEthnicityMatch(cityEthnicity, userEthnicity) {
    const ethnicityMap = {
        'white': ['White', 'White British', 'British/Irish', 'Norwegian', 'Danish', 'Icelandic', 'Spanish', 'Portuguese', 'Polish', 'Russian', 'Ukrainian', 'Georgian', 'Greek Cypriot', 'Other European', 'Western', 'Mestizo'],
        'black': ['Black', 'Black African', 'Coloured'],
        'asian': ['Asian', 'South Asian', 'Chinese', 'Thai', 'Indian/Asian', 'Burmese'],
        'hispanic': ['Hispanic', 'Mestizo'],
        'middleeastern': ['Emirati', 'Other Arab', 'Middle Eastern', 'Egyptian Arab'],
        'mixed': ['Mixed'],
        'other': ['Other', 'Indigenous', 'Yoruba', 'Igbo', 'Hausa', 'Kikuyu', 'Luhya', 'Luo', 'Kalenjin', 'Kamba', 'Khalkha Mongol', 'Kazakh', 'Dorvod', 'Tatar']
    };

    const userCategories = ethnicityMap[userEthnicity] || [];
    let totalPercentage = 0;

    Object.entries(cityEthnicity).forEach(([group, percentage]) => {
        if (userCategories.some(cat => group.includes(cat) || cat.includes(group))) {
            totalPercentage += percentage;
        }
    });

    return totalPercentage;
}

// Helper: Get religion match
function getReligionMatch(cityReligion, userReligion) {
    const religionMap = {
        'christianity': ['Christianity', 'Catholic', 'Orthodox Christianity', 'Protestant', 'Lutheran', 'Greek Catholic', 'Armenian Apostolic'],
        'islam': ['Islam'],
        'judaism': ['Judaism'],
        'hinduism': ['Hinduism'],
        'buddhism': ['Buddhism'],
        'none': ['No Religion'],
        'other': ['Other', 'Traditional', 'Shamanism']
    };

    const userReligions = religionMap[userReligion] || [];
    let totalPercentage = 0;

    Object.entries(cityReligion).forEach(([religion, percentage]) => {
        if (userReligions.some(r => religion.includes(r) || r.includes(religion))) {
            totalPercentage += percentage;
        }
    });

    return totalPercentage;
}

// Calculate demographic compatibility penalty
function calculateDemographicPenalty(city, profile) {
    let penalty = 0;

    // Ethnicity minority penalty (if user's ethnicity < 20% of population)
    const ethnicityPercentage = getEthnicityMatch(city.ethnicity, profile.ethnicity);
    if (ethnicityPercentage < 20) {
        const minorityFactor = (20 - ethnicityPercentage) / 20;
        penalty += minorityFactor * 15; // Up to 15 point penalty
    }

    // Religion conflict penalty (if user's religion < 30% and conflicting majority exists)
    const religionPercentage = getReligionMatch(city.religion, profile.religion);
    if (religionPercentage < 30) {
        // Extra penalty if Islam is majority and user is not Muslim
        const islamPercentage = city.religion['Islam'] || 0;
        if (islamPercentage > 50 && profile.religion !== 'islam') {
            penalty += 10;
        }
        const minorityFactor = (30 - religionPercentage) / 30;
        penalty += minorityFactor * 10; // Up to 10 point penalty
    }

    return penalty;
}

// Apply demographic adjustments to safety scores
function adjustSafetyForDemographics(city, profile) {
    const adjusted = { ...city.safety,
        quality: city.healthcare.quality,
        policeRisk: city.policeRisk
    };

    const ethnicityPercentage = getEthnicityMatch(city.ethnicity, profile.ethnicity);
    const religionPercentage = getReligionMatch(city.religion, profile.religion);

    // Cultural safety adjustment for minorities
    if (ethnicityPercentage < 20) {
        const reduction = (20 - ethnicityPercentage) * 0.5; // Up to 10 points
        adjusted.cultural = Math.max(0, adjusted.cultural - reduction);
    }

    // Religion-based cultural safety adjustment
    if (religionPercentage < 30) {
        const reduction = (30 - religionPercentage) * 0.3; // Up to 9 points
        adjusted.cultural = Math.max(0, adjusted.cultural - reduction);
    }

    // LGBTQ+ safety adjustment
    if (profile.lgbtq) {
        const lgbtqSafety = city.lgbtqFriendly;
        if (lgbtqSafety < 50) {
            adjusted.cultural = Math.max(0, adjusted.cultural * (lgbtqSafety / 100));
            adjusted.policeRisk = Math.max(0, adjusted.policeRisk * (lgbtqSafety / 100));
        }
    }

    // Women's safety adjustment
    if (profile.gender === 'female') {
        const womenSafety = city.womenSafety;
        if (womenSafety < 70) {
            adjusted.cultural = Math.max(0, (adjusted.cultural + womenSafety) / 2);
        }
    }

    // Healthcare quality adjustment for ethnic minorities (access issues)
    if (ethnicityPercentage < 20) {
        const reduction = (20 - ethnicityPercentage) * 0.4; // Up to 8 points
        adjusted.quality = Math.max(0, adjusted.quality - reduction);
    }

    return adjusted;
}

// Calculate average temperature from forecast and score it
function calculateForecastTemperatureScore(forecast, idealTemp) {
    if (!forecast || forecast.length === 0) {
        return { score: 50, avgTemp: idealTemp }; // Fallback
    }

    // Collect all min and max temps from forecast
    const allTemps = [];
    const allScores = [];

    forecast.forEach(day => {
        allTemps.push(day.minTemp);
        allTemps.push(day.maxTemp);

        // Score each temperature
        allScores.push(calculateTemperatureScore(day.minTemp, idealTemp));
        allScores.push(calculateTemperatureScore(day.maxTemp, idealTemp));
    });

    // Calculate average temperature
    const avgTemp = Math.round(allTemps.reduce((sum, temp) => sum + temp, 0) / allTemps.length);

    // Calculate average score
    const avgScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;

    return { score: avgScore, avgTemp: avgTemp };
}

// Calculate temperature score for a single temperature value
function calculateTemperatureScore(temp, idealTemp) {
    const diff = Math.abs(temp - idealTemp);

    if (diff <= 2) return 100;
    if (diff <= 5) return 90 - (diff - 2) * 10;
    if (diff <= 10) return 60 - (diff - 5) * 8;
    if (diff <= 15) return 20 - (diff - 10) * 4;

    return Math.max(0, 20 - (diff - 15) * 2);
}

// Calculate tax score
function calculateTaxScore(taxRate) {
    if (taxRate <= 5) return 100 - taxRate;
    if (taxRate <= 15) return 95 - ((taxRate - 5) * 1.5);
    if (taxRate <= 30) return 80 - ((taxRate - 15) * 2);
    return Math.max(0, 50 - ((taxRate - 30) * 2.5));
}

// Calculate timezone score
function calculateTimezoneScore(hoursDifference) {
    const absHours = Math.abs(hoursDifference);
    if (absHours >= 12) return 0;
    return Math.round(100 - (absHours / 12 * 100));
}

// Calculate safety score with demographic adjustments
function calculateSafetyScore(city, profile) {
    const adjusted = adjustSafetyForDemographics(city, profile);
    return Math.round((adjusted.war + adjusted.terrorism + adjusted.cultural) / 3);
}

// Calculate healthcare score with demographic adjustments
function calculateHealthcareScore(city, profile) {
    const adjusted = adjustSafetyForDemographics(city, profile);
    return Math.round((adjusted.quality + city.healthcare.cost) / 2);
}

// Calculate police risk with demographic adjustments
function calculatePoliceScore(city, profile) {
    const adjusted = adjustSafetyForDemographics(city, profile);
    return adjusted.policeRisk;
}

// Calculate lifestyle preference scores
function calculateLifestyleScore(cityValue, preference) {
    if (preference === 'prefer') {
        return cityValue;
    } else if (preference === 'avoid') {
        return 100 - cityValue;
    } else { // neutral
        return 75; // Neutral doesn't penalize or reward
    }
}

// Calculate cost of living score
function calculateCostOfLivingScore(city, allCities) {
    const costs = allCities.map(c => calculateTotalMonthlyCost(c));
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const currentCost = calculateTotalMonthlyCost(city);

    if (maxCost === minCost) return 100;
    const score = 100 - ((currentCost - minCost) / (maxCost - minCost) * 100);
    return Math.max(0, Math.min(100, score));
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
    return rentGBP + utilitiesGBP + transportGBP + internetGBP + monthlyFood;
}

// Convert cost to GBP
function convertToGBP(amount, currency, exchangeRate) {
    if (currency === 'GBP') return amount;
    return amount * exchangeRate;
}

// Get UK timezone offset
function getUKTimezoneOffset() {
    const ukTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/London' });
    const ukDate = new Date(ukTime);
    const utcTime = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
    const utcDate = new Date(utcTime);
    return (ukDate - utcDate) / 1000;
}

// Calculate timezone offset from UK
function getTimezoneOffsetFromUK(cityTimezoneOffset) {
    const ukOffset = getUKTimezoneOffset();
    return (cityTimezoneOffset - ukOffset) / 3600;
}

// Format timezone offset for display
function formatTimezoneOffset(hours) {
    const absHours = Math.abs(hours);
    const wholeHours = Math.floor(absHours);
    const minutes = Math.round((absHours - wholeHours) * 60);

    if (hours === 0) return 'Same as UK';

    const sign = hours > 0 ? '+' : '';
    if (minutes === 0) return `${sign}${wholeHours}h from UK`;
    return `${sign}${wholeHours}h ${minutes}m from UK`;
}

// Main scoring function
function calculateHappinessScore(city, profile, allCities) {
    const weights = profile.weights;

    // Calculate forecast-based temperature score
    const forecastTempResult = calculateForecastTemperatureScore(city.forecast, profile.idealTemp);
    const tempScore = forecastTempResult.score;
    const avgTemp = forecastTempResult.avgTemp;

    // Calculate other scores
    const taxScore = calculateTaxScore(city.taxRate);
    const timezoneOffsetHours = getTimezoneOffsetFromUK(city.timezone);
    const timezoneScore = calculateTimezoneScore(timezoneOffsetHours);
    const costScore = calculateCostOfLivingScore(city, allCities);
    const safetyScore = calculateSafetyScore(city, profile);
    const healthcareScore = calculateHealthcareScore(city, profile);
    const policeScore = calculatePoliceScore(city, profile);
    const cannabisScore = calculateLifestyleScore(city.weedFriendly, profile.cannabisPreference);
    const alcoholScore = calculateLifestyleScore(city.alcoholFriendly, profile.alcoholPreference);

    // Store individual scores
    city.tempScore = tempScore;
    city.avgTemp = avgTemp; // Store calculated average temperature
    city.taxScore = taxScore;
    city.timezoneScore = timezoneScore;
    city.costScore = costScore;
    city.safetyScore = safetyScore;
    city.healthcareScore = healthcareScore;
    city.policeScore = policeScore;
    city.cannabisScore = cannabisScore;
    city.alcoholScore = alcoholScore;
    city.timezoneOffsetHours = timezoneOffsetHours;

    // Calculate weighted score (normalized to 100)
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const baseScore = (
        (taxScore * weights.tax) +
        (tempScore * weights.weather) +
        (costScore * weights.costOfLiving) +
        (safetyScore * weights.safety) +
        (healthcareScore * weights.healthcare) +
        (cannabisScore * weights.cannabis) +
        (policeScore * weights.policeRisk) +
        (alcoholScore * weights.alcohol) +
        (timezoneScore * weights.timezone)
    ) / totalWeight * 100;

    // Apply demographic penalty
    const demographicPenalty = calculateDemographicPenalty(city, profile);

    return Math.round(Math.max(0, baseScore - demographicPenalty));
}

