# 🌍 Where Should I Live - Profile-Based Location Scoring System

A comprehensive, profile-driven location comparison tool that helps you find the perfect place to live based on your
personal demographics, lifestyle preferences, and priorities.

## 🎯 Overview

This application provides personalized location recommendations by:

- **Analyzing 24+ global cities** with comprehensive metrics
- **Personalizing scores** based on your ethnicity, religion, gender, and preferences
- **Calculating demographic compatibility** to assess cultural fit and safety
- **Weighting factors** according to what matters most to you
- **Exporting data** to CSV for further analysis

## ✨ Key Features

### 👤 Comprehensive Profile System

- **Demographics**: Ethnicity, religion, gender, LGBTQ+ status
- **Lifestyle Preferences**: Cannabis and alcohol attitudes
- **Custom Weights**: Adjust importance of each factor (tax, weather, safety, etc.)
- **Save/Load Profiles**: Export and import your profile configurations

### 📊 Scoring Factors

Each location is scored on:

- **Tax Rate** (0-50%): How much you'll pay
- **Weather** (Temperature): Proximity to your ideal climate
- **Cost of Living**: Rent, food, transport, utilities (in GBP)
- **Safety**: War risk, terrorism, cultural compatibility
- **Healthcare**: Quality + affordability
- **Cannabis Friendly**: Legal status and availability (0-100%)
- **Police Risk**: Legal safety and enforcement patterns
- **Alcohol Friendly**: Availability and cultural acceptance (0-100%)
- **Timezone**: Offset from UK

### 🎨 Advanced Features

- **Demographic Compatibility**: Automatically adjusts scores based on:
    - Ethnic minority status (penalty if <20% representation)
    - Religious compatibility (penalty if <30% representation)
    - LGBTQ+ rights and safety
    - Women's safety considerations

- **Real-time Weather Data**: Current conditions and 6-day forecasts
- **Interactive UI**: Carousel navigation with keyboard support
- **CSV Export**: Full data export for spreadsheet analysis
- **Dark Mode**: Beautiful light/dark theme switching
- **Mobile Responsive**: Perfect on all devices

## 📁 Project Structure

```
/your-project/
├── index.html              # Main HTML structure
├── css/
│   ├── main.css           # Core styles, layout, header
│   ├── cards.css          # City card specific styles
│   ├── profile.css        # Profile panel and settings
│   └── mobile.css         # Mobile responsive styles
├── js/
│   ├── data.js            # City data with all metrics
│   ├── profile.js         # Profile management & storage
│   ├── scoring.js         # Scoring algorithms
│   ├── ui.js              # Card rendering & visualization
│   ├── export.js          # CSV export functionality
│   └── app.js             # Main initialization & coordination
└── README.md              # This file
```

## 🚀 Getting Started

### Quick Start

1. Open `index.html` in your browser
2. Click **⚙️ Profile** to configure your preferences
3. Browse through ranked locations
4. Export to CSV for detailed analysis

### Adding New Cities

Edit `js/data.js` and add a new city object:

```javascript
{
    name: 'City Name',
    country: 'COUNTRY_CODE',
    taxRate: 25,
    weedFriendly: 70,
    alcoholFriendly: 95,
    religion: { 'Christianity': 60, 'Islam': 20, 'No Religion': 20 },
    ethnicity: { 'White': 70, 'Asian': 20, 'Other': 10 },
    safety: { war: 90, terrorism: 85, cultural: 88 },
    healthcare: { quality: 80, cost: 75 },
    policeRisk: 85,
    lgbtqFriendly: 90,
    womenSafety: 85,
    costOfLiving: {
        currency: 'USD',
        exchangeRate: 0.79, // to GBP (optional if USD/GBP)
        items: {
            'Meal at Inexpensive Restaurant': 15.00,
            'Domestic Beer (Pint)': 6.00,
            // ... more items
        }
    }
}
```

### Customizing Weights

Default weights can be changed in `js/profile.js`:

```javascript
weights: {
    tax: 20,
    weather: 15,
    costOfLiving: 14,
    safety: 14,
    healthcare: 10,
    cannabis: 10,
    policeRisk: 7,
    alcohol: 7,
    timezone: 3
}
```

Or adjust them live in the Profile panel!

## 🧮 How Scoring Works

### Base Scores (0-100 each)

Each city gets scored on individual factors, then weighted:

```
Final Score = (Tax × 20%) + (Weather × 15%) + (Cost × 14%) +
              (Safety × 14%) + (Healthcare × 10%) + (Cannabis × 10%) +
              (Police × 7%) + (Alcohol × 7%) + (Timezone × 3%)
```

### Demographic Adjustments

The system applies penalties/adjustments for:

1. **Ethnic Minority Penalty**: If your ethnicity <20% of population
    - Reduces cultural safety
    - May reduce healthcare access quality
    - Up to -15 points total

2. **Religious Minority Penalty**: If your religion <30% of population
    - Extra penalty if Islam >50% and you're not Muslim
    - Up to -10 points

3. **LGBTQ+ Adjustment**: If you identify as LGBTQ+
    - Scales cultural safety by city's LGBTQ+ friendliness
    - Reduces police risk in unfriendly locations

4. **Women's Safety**: If you identify as female
    - Adjusts cultural safety based on women's safety score

### Lifestyle Preferences

- **Prefer**: Uses city's actual score (e.g., 80% weed-friendly = 80 points)
- **Neutral**: Gets default 75 points (no penalty/reward)
- **Avoid**: Inverts score (e.g., 80% weed-friendly = 20 points)

## 📤 CSV Export

Click **📊 Export CSV** to download a spreadsheet with:

- All city rankings and scores
- Individual factor breakdowns
- Cost of living data in GBP
- Demographics summaries
- Raw data for your own analysis

## 🔒 Privacy

All data is stored locally in your browser:

- No data sent to external servers
- Profile saved in localStorage
- Weather data from OpenWeatherMap API only

## 🛠️ Technical Details

### Dependencies

- **OpenWeatherMap API**: Real-time weather data
- **Google Fonts**: Inter typeface
- **Pure Vanilla JS**: No frameworks!

### Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

### API Configuration

Weather API key is included. To use your own:

1. Get free key at [OpenWeatherMap](https://openweathermap.org/api)
2. Replace `API_KEY` in `js/data.js`

## 🎓 Use Cases

### Personal Migration Planning

Configure your profile and find cities that match your lifestyle and safety needs.

### Travel Planning

See which cities align with your preferences for extended stays or digital nomading.

### Comparative Research

Export data to analyze patterns across regions, tax havens, or climate zones.

### Investment Location Research

Evaluate cities for business expansion or property investment based on multiple factors.

## 📊 Data Sources

All metrics are estimated and should be verified:

- **Cost of Living**: Based on Numbeo data (November 2025)
- **Demographics**: Various sources including census data
- **Safety**: Composite of multiple indices
- **Weather**: Real-time from OpenWeatherMap

**⚠️ Important**: This tool provides estimates. Always verify critical information from authoritative sources before
making life decisions.

## 🤝 Contributing

Want to add more cities or factors? The modular structure makes it easy:

1. **Add Cities**: Edit `js/data.js`
2. **Add Scoring Factors**: Edit `js/scoring.js`
3. **Add UI Elements**: Edit `js/ui.js` and appropriate CSS
4. **Add Export Fields**: Edit `js/export.js`

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- Numbeo for cost of living estimates
- Various demographic data sources

---

**Made with ❤️ for finding the perfect place to call home**

## 🗺️ Roadmap

Future enhancements could include:

- More cities (target: 100+)
- More factors (infrastructure, internet speed, freedom indices)
- Visual maps and charts
- Comparison mode (side-by-side cities)
- Community data contributions
- Mobile app version

---

### Quick Tips

💡 **Start Fresh**: Click "Reset to Defaults" to clear your profile
💡 **Experiment**: Try different weight distributions to see how rankings change
💡 **Export Often**: Save your profile configurations for different scenarios
💡 **Keyboard Navigation**: Use ← → arrow keys to browse cities quickly

**Happy location hunting! 🌍✈️**