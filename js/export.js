// CSV export functionality

function exportToCSV(weatherData) {
    const profile = userProfile.profile;

    // CSV Headers
    const headers = [
        'Rank', 'City', 'Country', 'Overall Score',
        'Tax Rate', 'Tax Score',
        'Current Temp', 'Weather Score',
        'Cost of Living Score',
        'Safety Score', 'War Risk', 'Terrorism Risk', 'Cultural Safety',
        'Healthcare Score', 'Healthcare Quality', 'Healthcare Cost',
        'Cannabis Friendly', 'Cannabis Score',
        'Alcohol Friendly', 'Alcohol Score',
        'Police Risk Score',
        'Timezone Offset', 'Timezone Score',
        'Monthly Cost (GBP)',
        'LGBTQ Friendly', 'Women Safety',
        'Primary Religion', 'Primary Ethnicity'
    ];

    // Build CSV rows
    const rows = weatherData.map((city, index) => {
        const monthlyCost = calculateTotalMonthlyCost(city);
        const primaryReligion = Object.entries(city.religion).sort((a, b) => b[1] - a[1])[0];
        const primaryEthnicity = Object.entries(city.ethnicity).sort((a, b) => b[1] - a[1])[0];

        return [
            index + 1,
            city.city,
            city.country,
            city.happinessScore,
            city.taxRate,
            Math.round(city.taxScore),
            city.current.temp,
            Math.round(city.tempScore),
            Math.round(city.costScore),
            Math.round(city.safetyScore),
            city.safety.war,
            city.safety.terrorism,
            city.safety.cultural,
            Math.round(city.healthcareScore),
            city.healthcare.quality,
            city.healthcare.cost,
            city.weedFriendly,
            Math.round(city.cannabisScore),
            city.alcoholFriendly,
            Math.round(city.alcoholScore),
            Math.round(city.policeScore),
            city.timezoneOffsetHours.toFixed(1),
            Math.round(city.timezoneScore),
            monthlyCost.toFixed(2),
            city.lgbtqFriendly,
            city.womenSafety,
            `${primaryReligion[0]} (${primaryReligion[1].toFixed(1)}%)`,
            `${primaryEthnicity[0]} (${primaryEthnicity[1].toFixed(1)}%)`
        ];
    });

    // Convert to CSV string
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => {
            // Escape cells containing commas
            if (typeof cell === 'string' && cell.includes(',')) {
                return `"${cell}"`;
            }
            return cell;
        }).join(','))
    ].join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `where-should-i-live-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

