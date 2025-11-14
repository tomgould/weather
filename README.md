# 🌍 Weather Dashboard

A beautiful, interactive weather dashboard that helps you compare cities based on weather conditions and tax rates. Find your perfect location with our intelligent happiness scoring system!

## 🎯 Features

- **Real-time Weather Data** - Current conditions and 6-day forecasts for multiple cities
- **Happiness Score** - Intelligent scoring combining weather (40%) and tax rates (60%)
- **Interactive Carousel** - Smooth infinite scrolling through cities
- **Customizable Preferences** - Adjust your ideal temperature to personalize scores
- **City Rankings** - Automatically ranked by happiness score (1st, 2nd, 3rd...)
- **Dark Mode** - Beautiful theme switching for day and night
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- **Live Time Display** - Shows current local time for each city

## 🌐 Live Demo

**[View on GitHub Pages](https://tomgould.github.io/weather/)**

> 📱 Perfect for viewing on your phone!

## 📍 Cities Included

- 🇬🇧 London, UK
- 🇬🇪 Tbilisi, Georgia
- 🇨🇾 Paphos, Cyprus
- 🇹🇭 Bangkok, Thailand
- 🇹🇭 Phuket, Thailand
- 🇲🇽 Cancun, Mexico

## 🚀 Setup

1. **Clone the repository**
```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - No build process required!

## 🔑 API Key

This project uses the [OpenWeatherMap API](https://openweathermap.org/api). The current key is included but you can get your own free API key:

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your API key
3. Replace the `API_KEY` in `app.js`

## 🎨 Customization

### Add More Cities
Edit the `CITIES` array in `app.js`:
```javascript
const CITIES = [
    { name: 'CityName', country: 'CountryCode', taxRate: 20 },
    // Add more cities...
];
```

### Change Ideal Temperature
Use the temperature input in the header or modify the default in `app.js`:
```javascript
let idealTemp = 30; // Change default here
```

### Adjust Scoring Weights
Modify the happiness score calculation in `calculateHappinessScores()`:
```javascript
// Current: 40% weather, 60% tax
data.happinessScore = Math.round((tempScore * 0.4) + (taxScore * 0.6));
```

## 📱 Mobile Experience

The app is fully responsive and includes:
- Touch-friendly carousel navigation
- Optimized card layouts
- Smooth swipe gestures
- Mobile-optimized typography

## 🌙 Dark Mode

Toggle between light and dark themes using the button in the top right corner. Your preference is automatically saved.

## 🏗️ Built With

- **HTML5** - Structure
- **CSS3** - Styling with custom properties and animations
- **Vanilla JavaScript** - No frameworks needed!
- **OpenWeatherMap API** - Weather data
- **Google Fonts** - Inter typeface

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Contact

Created with ❤️ for finding the perfect place to live

---

**Tip:** Bookmark the GitHub Pages link on your phone's home screen for quick access!