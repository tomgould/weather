// ==========================================
// CONFIGURATION: Adjust scoring impact
// ==========================================
// Change this value to adjust how much corruption affects the total score
// Current: 5% (was 10% previously)
const CORRUPTION_WEIGHT_PERCENT = 5;

// Multipliers for safety factors (higher = more impact from bad scores)
// Default: 1.0 = normal impact
// Increase to 1.5 or 2.0 to make poor safety scores penalize more heavily
const WAR_RISK_MULTIPLIER = 50;
const TERRORISM_RISK_MULTIPLIER = 25;
const CULTURAL_SAFETY_MULTIPLIER = 2;

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

// Calculate kidnap risk penalty (significantly increased)
function calculateKidnapPenalty(kidnapRisk) {
    // Much more severe penalties to properly reflect danger
    const penalties = {
        1: 0,   // Low - no penalty
        2: 3,   // Moderate - small penalty
        3: 5,  // Medium - noticeable penalty
        4: 15,  // High - major penalty
        5: 25   // Extreme - severe penalty (pushes cities way down)
    };
    return penalties[kidnapRisk] || 0;
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
    const adjusted = {
        ...city.safety,
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
        return {score: 50, avgTemp: idealTemp}; // Fallback
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

    return {score: avgScore, avgTemp: avgTemp};
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

// Calculate corruption score (CPI: 0-100, higher is better) - uses CORRUPTION_WEIGHT_PERCENT
function calculateCorruptionScore(cpiScore) {
    return cpiScore || 50; // Direct use of CPI score
}

// Calculate timezone score
function calculateTimezoneScore(hoursDifference) {
    const absHours = Math.abs(hoursDifference);
    if (absHours >= 12) return 0;
    return Math.round(100 - (absHours / 12 * 100));
}

// Calculate safety score with demographic adjustments and multipliers
function calculateSafetyScore(city, profile) {
    const adjusted = adjustSafetyForDemographics(city, profile);

    // All three scores are already in "safety" format where higher = safer
    // Apply multipliers to amplify the impact of both good and bad scores
    const warScore = adjusted.war >= 50
        ? Math.min(100, adjusted.war * WAR_RISK_MULTIPLIER)
        : Math.max(0, adjusted.war / WAR_RISK_MULTIPLIER);

    const terrorismScore = adjusted.terrorism >= 50
        ? Math.min(100, adjusted.terrorism * TERRORISM_RISK_MULTIPLIER)
        : Math.max(0, adjusted.terrorism / TERRORISM_RISK_MULTIPLIER);

    const culturalScore = adjusted.cultural >= 50
        ? Math.min(100, adjusted.cultural * CULTURAL_SAFETY_MULTIPLIER)
        : Math.max(0, adjusted.cultural / CULTURAL_SAFETY_MULTIPLIER);

    return Math.round((warScore + terrorismScore + culturalScore) / 3);
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
    const ukTime = new Date().toLocaleString('en-US', {timeZone: 'Europe/London'});
    const ukDate = new Date(ukTime);
    const utcTime = new Date().toLocaleString('en-US', {timeZone: 'UTC'});
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

// Get section ordering based on weights - keep weather items together
function getSectionOrder(weights) {
    const sections = [
        {name: 'breakdown', weight: 100}, // Always show breakdown first
        {name: 'weatherGroup', weight: weights.weather}, // Weather + Forecast together
        {name: 'lifestyle', weight: Math.max(weights.cannabis, weights.alcohol)},
        {name: 'corruption', weight: 50}, // Fixed mid-priority (not weighted by user)
        {name: 'safety', weight: weights.safety},
        {name: 'healthcare', weight: weights.healthcare},
        {name: 'cost', weight: weights.costOfLiving},
        {name: 'religion', weight: 0}, // Demographics lower priority
        {name: 'ethnicity', weight: 0}
    ];

    return sections.sort((a, b) => b.weight - a.weight).map(s => s.name);
}

// Main scoring function
function calculateHappinessScore(city, profile, allCities) {
    const weights = profile.weights;

    // Ensure all weights exist with defaults (corruption removed from user weights)
    const safeWeights = {
        tax: weights.tax || 0,
        weather: weights.weather || 0,
        costOfLiving: weights.costOfLiving || 0,
        safety: weights.safety || 0,
        healthcare: weights.healthcare || 0,
        cannabis: weights.cannabis || 0,
        policeRisk: weights.policeRisk || 0,
        alcohol: weights.alcohol || 0,
        timezone: weights.timezone || 0
    };

    // Calculate forecast-based temperature score
    const forecastTempResult = calculateForecastTemperatureScore(city.forecast, profile.idealTemp);
    const tempScore = forecastTempResult.score;
    const avgTemp = forecastTempResult.avgTemp;

    // Calculate other scores
    const taxScore = calculateTaxScore(city.taxRate);
    const corruptionScore = calculateCorruptionScore(city.corruption);
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
    city.avgTemp = avgTemp;
    city.taxScore = taxScore;
    city.corruptionScore = corruptionScore;
    city.timezoneScore = timezoneScore;
    city.costScore = costScore;
    city.safetyScore = safetyScore;
    city.healthcareScore = healthcareScore;
    city.policeScore = policeScore;
    city.cannabisScore = cannabisScore;
    city.alcoholScore = alcoholScore;
    city.timezoneOffsetHours = timezoneOffsetHours;

    // Calculate weighted score (user-weighted factors = (100 - CORRUPTION_WEIGHT_PERCENT)% of score)
    const totalWeight = Object.values(safeWeights).reduce((sum, w) => sum + w, 0);

    // Prevent division by zero
    if (totalWeight === 0) {
        return 50; // Default neutral score
    }

    const weightedScore = (
        (taxScore * safeWeights.tax) +
        (tempScore * safeWeights.weather) +
        (costScore * safeWeights.costOfLiving) +
        (safetyScore * safeWeights.safety) +
        (healthcareScore * safeWeights.healthcare) +
        (cannabisScore * safeWeights.cannabis) +
        (policeScore * safeWeights.policeRisk) +
        (alcoholScore * safeWeights.alcohol) +
        (timezoneScore * safeWeights.timezone)
    ) / totalWeight;

    // Combine: (100-CORRUPTION_WEIGHT_PERCENT)% weighted factors + CORRUPTION_WEIGHT_PERCENT% corruption (always)
    const userFactorsPercent = (100 - CORRUPTION_WEIGHT_PERCENT) / 100;
    const corruptionPercent = CORRUPTION_WEIGHT_PERCENT / 100;
    const baseScore = (weightedScore * userFactorsPercent) + (corruptionScore * corruptionPercent);

    // Apply demographic penalty
    const demographicPenalty = calculateDemographicPenalty(city, profile);

    // Apply kidnap risk penalty (significantly increased impact)
    const kidnapPenalty = calculateKidnapPenalty(city.kidnapRisk);

    return Math.round(Math.max(0, baseScore - demographicPenalty - kidnapPenalty));
}