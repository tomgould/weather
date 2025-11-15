// City data with all metrics
const CITIES = [
    {
        name: 'London',
        country: 'GB',
        corruption: 71,
        kidnapRisk: 2, // Updated from PDF: Moderate
        taxRate: 50,
        weedFriendly: 50,
        alcoholFriendly: 95,
        religion: { 'Christianity': 46.3, 'Islam': 6.7, 'Hinduism': 1.8, 'No Religion': 37.2, 'Other': 8.0 },
        ethnicity: { 'White British': 59.8, 'Asian': 18.0, 'Black': 13.5, 'Mixed': 5.0, 'Other': 3.7 },
        safety: { war: 95, terrorism: 75, cultural: 90 },
        healthcare: { quality: 85, cost: 40 },
        policeRisk: 85,
        lgbtqFriendly: 95,
        womenSafety: 90,
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
        corruption: 56,
        kidnapRisk: 3, // Confirmed from PDF: Medium
        taxRate: 1,
        weedFriendly: 70,
        alcoholFriendly: 100,
        religion: { 'Orthodox Christianity': 83.4, 'Islam': 10.7, 'Armenian Apostolic': 2.9, 'Other': 3.0 },
        ethnicity: { 'Georgian': 86.8, 'Azerbaijani': 6.3, 'Armenian': 4.5, 'Other': 2.4 },
        safety: { war: 70, terrorism: 85, cultural: 85 },
        healthcare: { quality: 65, cost: 85 },
        policeRisk: 75,
        lgbtqFriendly: 40,
        womenSafety: 75,
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
        corruption: 57,
        kidnapRisk: 3, // Updated from PDF: Medium
        taxRate: 12.5,
        weedFriendly: 60,
        alcoholFriendly: 95,
        religion: { 'Orthodox Christianity': 78.0, 'Islam': 18.0, 'Other': 4.0 },
        ethnicity: { 'Greek Cypriot': 71.8, 'Turkish': 9.5, 'Other European': 12.0, 'Other': 6.7 },
        safety: { war: 85, terrorism: 90, cultural: 88 },
        healthcare: { quality: 80, cost: 75 },
        policeRisk: 85,
        lgbtqFriendly: 75,
        womenSafety: 85,
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
        corruption: 39,
        kidnapRisk: 3, // Confirmed from PDF: Medium
        taxRate: 30.5,
        weedFriendly: 80,
        alcoholFriendly: 90,
        religion: { 'Buddhism': 94.6, 'Islam': 4.3, 'Christianity': 0.7, 'Other': 0.4 },
        ethnicity: { 'Thai': 95.9, 'Burmese': 2.0, 'Chinese': 0.9, 'Other': 1.2 },
        safety: { war: 92, terrorism: 80, cultural: 85 },
        healthcare: { quality: 85, cost: 90 },
        policeRisk: 70,
        lgbtqFriendly: 85,
        womenSafety: 70,
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
        corruption: 39,
        kidnapRisk: 3, // Confirmed from PDF: Medium
        taxRate: 30.5,
        weedFriendly: 80,
        alcoholFriendly: 90,
        religion: { 'Buddhism': 93.0, 'Islam': 5.5, 'Christianity': 1.0, 'Other': 0.5 },
        ethnicity: { 'Thai': 93.0, 'Chinese': 3.5, 'Malay': 2.0, 'Other': 1.5 },
        safety: { war: 92, terrorism: 82, cultural: 88 },
        healthcare: { quality: 80, cost: 90 },
        policeRisk: 70,
        lgbtqFriendly: 85,
        womenSafety: 70,
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
        corruption: 31,
        kidnapRisk: 4, // Confirmed from PDF: High
        taxRate: 26.5,
        weedFriendly: 70,
        alcoholFriendly: 95,
        religion: { 'Catholic': 78.0, 'Protestant': 11.0, 'No Religion': 8.0, 'Other': 3.0 },
        ethnicity: { 'Mestizo': 62.0, 'Indigenous': 21.0, 'White': 12.0, 'Other': 5.0 },
        safety: { war: 88, terrorism: 85, cultural: 80 },
        healthcare: { quality: 70, cost: 80 },
        policeRisk: 60,
        lgbtqFriendly: 75,
        womenSafety: 65,
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
    },
    {
        name: 'Marbella',
        country: 'ES',
        corruption: 60,
        kidnapRisk: 2, // Updated from PDF: Moderate
        taxRate: 43,
        weedFriendly: 65,
        alcoholFriendly: 100,
        religion: { 'Catholic': 67.0, 'No Religion': 27.0, 'Islam': 4.0, 'Other': 2.0 },
        ethnicity: { 'Spanish': 72.0, 'Other European': 18.0, 'North African': 6.0, 'Other': 4.0 },
        safety: { war: 95, terrorism: 88, cultural: 90 },
        healthcare: { quality: 88, cost: 70 },
        policeRisk: 85,
        lgbtqFriendly: 85,
        womenSafety: 90,
        costOfLiving: {
            currency: 'EUR',
            exchangeRate: 0.84,
            items: {
                'Meal at Inexpensive Restaurant': 12.50,
                'Domestic Beer (Pint)': 2.00,
                'Cappuccino': 1.88,
                'Milk (1L)': 0.99,
                'Bread (Loaf)': 1.19,
                'Cigarettes (Pack of 20)': 5.60,
                '1 Bedroom Apartment (City Centre)': 1313.75,
                'Internet (60 Mbps)': 28.75,
                'Monthly Transport Pass': 70.00,
                'Utilities (Monthly, 85m²)': 94.86
            }
        }
    },
    {
        name: 'Lisbon',
        country: 'PT',
        corruption: 63,
        kidnapRisk: 2, // Updated from PDF: Moderate
        taxRate: 46,
        weedFriendly: 90,
        alcoholFriendly: 100,
        religion: { 'Catholic': 81.0, 'No Religion': 14.0, 'Other': 5.0 },
        ethnicity: { 'Portuguese': 86.0, 'Brazilian': 4.0, 'African': 6.0, 'Other': 4.0 },
        safety: { war: 95, terrorism: 90, cultural: 92 },
        healthcare: { quality: 82, cost: 75 },
        policeRisk: 90,
        lgbtqFriendly: 90,
        womenSafety: 90,
        costOfLiving: {
            currency: 'EUR',
            exchangeRate: 0.84,
            items: {
                'Meal at Inexpensive Restaurant': 14.00,
                'Domestic Beer (Pint)': 3.00,
                'Cappuccino': 2.41,
                'Milk (1L)': 0.99,
                'Bread (Loaf)': 1.40,
                'Cigarettes (Pack of 20)': 5.80,
                '1 Bedroom Apartment (City Centre)': 1431.45,
                'Internet (60 Mbps)': 33.99,
                'Monthly Transport Pass': 40.00,
                'Utilities (Monthly, 85m²)': 126.98
            }
        }
    },
    {
        name: 'Dubai',
        country: 'AE',
        corruption: 68,
        kidnapRisk: 2, // Updated from PDF: Moderate
        taxRate: 0,
        weedFriendly: 0,
        alcoholFriendly: 20,
        religion: { 'Islam': 76.0, 'Christianity': 12.6, 'Hinduism': 6.6, 'Buddhism': 2.0, 'Other': 2.8 },
        ethnicity: { 'South Asian': 58.0, 'Emirati': 11.0, 'Other Arab': 14.0, 'Western': 8.0, 'Other': 9.0 },
        safety: { war: 92, terrorism: 85, cultural: 70 },
        healthcare: { quality: 90, cost: 40 },
        policeRisk: 45,
        lgbtqFriendly: 10,
        womenSafety: 85,
        costOfLiving: {
            currency: 'AED',
            exchangeRate: 0.21,
            items: {
                'Meal at Inexpensive Restaurant': 40.00,
                'Domestic Beer (Pint)': 50.00,
                'Cappuccino': 20.68,
                'Milk (1L)': 7.12,
                'Bread (Loaf)': 4.66,
                'Cigarettes (Pack of 20)': 23.00,
                '1 Bedroom Apartment (City Centre)': 8880.95,
                'Internet (60 Mbps)': 353.12,
                'Monthly Transport Pass': 340.00,
                'Utilities (Monthly, 85m²)': 799.55
            }
        }
    },
    {
        name: 'Longyearbyen',
        country: 'NO',
        corruption: 84,
        kidnapRisk: 1, // Confirmed from PDF: Low
        taxRate: 38,
        weedFriendly: 50,
        alcoholFriendly: 85,
        religion: { 'Lutheran': 75.0, 'No Religion': 20.0, 'Other': 5.0 },
        ethnicity: { 'Norwegian': 60.0, 'Russian/Ukrainian': 20.0, 'Thai': 10.0, 'Other': 10.0 },
        safety: { war: 98, terrorism: 98, cultural: 95 },
        healthcare: { quality: 90, cost: 50 },
        policeRisk: 95,
        lgbtqFriendly: 95,
        womenSafety: 98,
        costOfLiving: {
            currency: 'NOK',
            exchangeRate: 0.073,
            items: {
                'Meal at Inexpensive Restaurant': 300.00,
                'Domestic Beer (Pint)': 120.00,
                'Cappuccino': 60.00,
                'Milk (1L)': 20.00,
                'Bread (Loaf)': 35.00,
                'Cigarettes (Pack of 20)': 160.00,
                '1 Bedroom Apartment (City Centre)': 12000.00,
                'Internet (60 Mbps)': 800.00,
                'Monthly Transport Pass': 0.00,
                'Utilities (Monthly, 85m²)': 1500.00
            }
        }
    },
    {
        name: 'Copenhagen',
        country: 'DK',
        corruption: 90,
        kidnapRisk: 2, // Updated from PDF: Moderate
        taxRate: 42,
        weedFriendly: 85,
        alcoholFriendly: 100,
        religion: { 'Lutheran': 74.0, 'Islam': 5.3, 'No Religion': 18.0, 'Other': 2.7 },
        ethnicity: { 'Danish': 86.0, 'Other European': 7.0, 'Middle Eastern': 4.0, 'Other': 3.0 },
        safety: { war: 98, terrorism: 92, cultural: 95 },
        healthcare: { quality: 95, cost: 55 },
        policeRisk: 95,
        lgbtqFriendly: 98,
        womenSafety: 98,
        costOfLiving: {
            currency: 'DKK',
            exchangeRate: 0.12,
            items: {
                'Meal at Inexpensive Restaurant': 180.00,
                'Domestic Beer (Pint)': 60.00,
                'Cappuccino': 43.54,
                'Milk (1L)': 14.73,
                'Bread (Loaf)': 28.33,
                'Cigarettes (Pack of 20)': 65.00,
                '1 Bedroom Apartment (City Centre)': 13515.59,
                'Internet (60 Mbps)': 273.21,
                'Monthly Transport Pass': 800.00,
                'Utilities (Monthly, 85m²)': 1140.56
            }
        }
    },
    {
        name: 'Reykjavik',
        country: 'IS',
        corruption: 72,
        kidnapRisk: 1, // Confirmed from PDF: Low
        taxRate: 40,
        weedFriendly: 70,
        alcoholFriendly: 90,
        religion: { 'Lutheran': 62.0, 'No Religion': 31.0, 'Other': 7.0 },
        ethnicity: { 'Icelandic': 89.0, 'Polish': 3.5, 'Other European': 5.0, 'Other': 2.5 },
        safety: { war: 99, terrorism: 98, cultural: 96 },
        healthcare: { quality: 92, cost: 50 },
        policeRisk: 98,
        lgbtqFriendly: 98,
        womenSafety: 98,
        costOfLiving: {
            currency: 'ISK',
            exchangeRate: 0.0056,
            items: {
                'Meal at Inexpensive Restaurant': 3350.00,
                'Domestic Beer (Pint)': 1600.00,
                'Cappuccino': 753.16,
                'Milk (1L)': 243.48,
                'Bread (Loaf)': 502.90,
                'Cigarettes (Pack of 20)': 1699.00,
                '1 Bedroom Apartment (City Centre)': 275476.19,
                'Internet (60 Mbps)': 10275.00,
                'Monthly Transport Pass': 10800.00,
                'Utilities (Monthly, 85m²)': 9925.90
            }
        }
    },
    {
        name: 'Ulaanbaatar',
        country: 'MN',
        corruption: 35,
        kidnapRisk: 2, // Updated from PDF: Moderate
        taxRate: 20,
        weedFriendly: 30,
        alcoholFriendly: 95,
        religion: { 'Buddhism': 53.0, 'No Religion': 38.6, 'Islam': 3.0, 'Shamanism': 2.9, 'Other': 2.5 },
        ethnicity: { 'Khalkha Mongol': 81.9, 'Kazakh': 3.8, 'Dorvod': 2.7, 'Other': 11.6 },
        safety: { war: 88, terrorism: 90, cultural: 80 },
        healthcare: { quality: 55, cost: 85 },
        policeRisk: 75,
        lgbtqFriendly: 50,
        womenSafety: 70,
        costOfLiving: {
            currency: 'MNT',
            exchangeRate: 0.00029,
            items: {
                'Meal at Inexpensive Restaurant': 20000.00,
                'Domestic Beer (Pint)': 6000.00,
                'Cappuccino': 8500.00,
                'Milk (1L)': 2800.00,
                'Bread (Loaf)': 1500.00,
                'Cigarettes (Pack of 20)': 5500.00,
                '1 Bedroom Apartment (City Centre)': 1200000.00,
                'Internet (60 Mbps)': 35000.00,
                'Monthly Transport Pass': 15000.00,
                'Utilities (Monthly, 85m²)': 95000.00
            }
        }
    },
    {
        name: 'Moscow',
        country: 'RU',
        corruption: 26,
        kidnapRisk: 4, // Confirmed from PDF: High
        taxRate: 13,
        weedFriendly: 20,
        alcoholFriendly: 95,
        religion: { 'Orthodox Christianity': 71.0, 'Islam': 10.0, 'No Religion': 15.0, 'Other': 4.0 },
        ethnicity: { 'Russian': 92.0, 'Tatar': 3.0, 'Ukrainian': 2.0, 'Other': 3.0 },
        safety: { war: 65, terrorism: 70, cultural: 75 },
        healthcare: { quality: 65, cost: 80 },
        policeRisk: 50,
        lgbtqFriendly: 15,
        womenSafety: 70,
        costOfLiving: {
            currency: 'RUB',
            exchangeRate: 0.010,
            items: {
                'Meal at Inexpensive Restaurant': 800.00,
                'Domestic Beer (Pint)': 350.00,
                'Cappuccino': 265.29,
                'Milk (1L)': 104.76,
                'Bread (Loaf)': 54.05,
                'Cigarettes (Pack of 20)': 200.00,
                '1 Bedroom Apartment (City Centre)': 110000.00,
                'Internet (60 Mbps)': 568.20,
                'Monthly Transport Pass': 2970.00,
                'Utilities (Monthly, 85m²)': 9247.06
            }
        }
    },
    {
        name: 'Kyiv',
        country: 'UA',
        corruption: 36,
        kidnapRisk: 3, // Confirmed from PDF: Medium
        taxRate: 19.5,
        weedFriendly: 40,
        alcoholFriendly: 95,
        religion: { 'Orthodox Christianity': 67.3, 'Greek Catholic': 10.8, 'No Religion': 16.3, 'Other': 5.6 },
        ethnicity: { 'Ukrainian': 92.0, 'Russian': 5.0, 'Other': 3.0 },
        safety: { war: 25, terrorism: 50, cultural: 85 },
        healthcare: { quality: 55, cost: 85 },
        policeRisk: 65,
        lgbtqFriendly: 45,
        womenSafety: 65,
        costOfLiving: {
            currency: 'UAH',
            exchangeRate: 0.024,
            items: {
                'Meal at Inexpensive Restaurant': 300.00,
                'Domestic Beer (Pint)': 55.00,
                'Cappuccino': 71.00,
                'Milk (1L)': 45.20,
                'Bread (Loaf)': 19.70,
                'Cigarettes (Pack of 20)': 90.00,
                '1 Bedroom Apartment (City Centre)': 15000.00,
                'Internet (60 Mbps)': 183.00,
                'Monthly Transport Pass': 300.00,
                'Utilities (Monthly, 85m²)': 3500.00
            }
        }
    },
    {
        name: 'Warsaw',
        country: 'PL',
        corruption: 54,
        kidnapRisk: 2, // Confirmed from PDF: Moderate
        taxRate: 28,
        weedFriendly: 45,
        alcoholFriendly: 100,
        religion: { 'Catholic': 87.0, 'No Religion': 10.0, 'Other': 3.0 },
        ethnicity: { 'Polish': 96.7, 'Ukrainian': 1.5, 'Other': 1.8 },
        safety: { war: 88, terrorism: 88, cultural: 85 },
        healthcare: { quality: 75, cost: 75 },
        policeRisk: 80,
        lgbtqFriendly: 55,
        womenSafety: 80,
        costOfLiving: {
            currency: 'PLN',
            exchangeRate: 0.20,
            items: {
                'Meal at Inexpensive Restaurant': 40.00,
                'Domestic Beer (Pint)': 12.00,
                'Cappuccino': 15.70,
                'Milk (1L)': 3.60,
                'Bread (Loaf)': 4.26,
                'Cigarettes (Pack of 20)': 21.00,
                '1 Bedroom Apartment (City Centre)': 3500.00,
                'Internet (60 Mbps)': 60.00,
                'Monthly Transport Pass': 110.00,
                'Utilities (Monthly, 85m²)': 900.00
            }
        }
    },
    {
        name: 'New York',
        country: 'US',
        corruption: 69,
        kidnapRisk: 2, // Confirmed from PDF: Moderate
        taxRate: 35,
        weedFriendly: 90,
        alcoholFriendly: 100,
        religion: { 'Christianity': 59.0, 'Judaism': 8.0, 'Islam': 7.0, 'No Religion': 20.0, 'Other': 6.0 },
        ethnicity: { 'White': 42.7, 'Hispanic': 29.1, 'Black': 24.3, 'Asian': 14.1, 'Other': 2.1 },
        safety: { war: 95, terrorism: 80, cultural: 90 },
        healthcare: { quality: 92, cost: 20 },
        policeRisk: 75,
        lgbtqFriendly: 98,
        womenSafety: 80,
        costOfLiving: {
            currency: 'USD',
            items: {
                'Meal at Inexpensive Restaurant': 25.00,
                'Domestic Beer (Pint)': 8.00,
                'Cappuccino': 5.70,
                'Milk (1L)': 1.57,
                'Bread (Loaf)': 4.38,
                'Cigarettes (Pack of 20)': 20.00,
                '1 Bedroom Apartment (City Centre)': 4111.11,
                'Internet (60 Mbps)': 65.93,
                'Monthly Transport Pass': 133.00,
                'Utilities (Monthly, 85m²)': 191.02
            }
        }
    },
    {
        name: 'Los Angeles',
        country: 'US',
        corruption: 69,
        kidnapRisk: 2, // Confirmed from PDF: Moderate
        taxRate: 33,
        weedFriendly: 100,
        alcoholFriendly: 100,
        religion: { 'Christianity': 65.0, 'Judaism': 3.0, 'Islam': 2.0, 'Buddhism': 2.0, 'No Religion': 25.0, 'Other': 3.0 },
        ethnicity: { 'Hispanic': 48.6, 'White': 28.5, 'Asian': 11.6, 'Black': 8.9, 'Other': 2.4 },
        safety: { war: 95, terrorism: 85, cultural: 92 },
        healthcare: { quality: 92, cost: 25 },
        policeRisk: 70,
        lgbtqFriendly: 98,
        womenSafety: 80,
        costOfLiving: {
            currency: 'USD',
            items: {
                'Meal at Inexpensive Restaurant': 22.00,
                'Domestic Beer (Pint)': 8.00,
                'Cappuccino': 5.50,
                'Milk (1L)': 1.46,
                'Bread (Loaf)': 4.25,
                'Cigarettes (Pack of 20)': 13.00,
                '1 Bedroom Apartment (City Centre)': 2800.00,
                'Internet (60 Mbps)': 65.00,
                'Monthly Transport Pass': 100.00,
                'Utilities (Monthly, 85m²)': 150.00
            }
        }
    },
    {
        name: 'Toronto',
        country: 'CA',
        corruption: 77,
        kidnapRisk: 2, // Confirmed from PDF: Moderate
        taxRate: 36,
        weedFriendly: 100,
        alcoholFriendly: 100,
        religion: { 'Christianity': 54.1, 'Islam': 8.2, 'Hinduism': 5.6, 'Judaism': 3.8, 'No Religion': 24.2, 'Other': 4.1 },
        ethnicity: { 'White': 47.9, 'South Asian': 12.6, 'Chinese': 12.5, 'Black': 9.0, 'Other': 18.0 },
        safety: { war: 98, terrorism: 88, cultural: 95 },
        healthcare: { quality: 88, cost: 80 },
        policeRisk: 90,
        lgbtqFriendly: 98,
        womenSafety: 95,
        costOfLiving: {
            currency: 'CAD',
            exchangeRate: 0.56,
            items: {
                'Meal at Inexpensive Restaurant': 25.00,
                'Domestic Beer (Pint)': 8.00,
                'Cappuccino': 5.39,
                'Milk (1L)': 3.33,
                'Bread (Loaf)': 3.56,
                'Cigarettes (Pack of 20)': 20.00,
                '1 Bedroom Apartment (City Centre)': 2587.01,
                'Internet (60 Mbps)': 76.12,
                'Monthly Transport Pass': 156.00,
                'Utilities (Monthly, 85m²)': 158.55
            }
        }
    },
    {
        name: 'Melbourne',
        country: 'AU',
        corruption: 75,
        kidnapRisk: 2, // Updated from PDF: Moderate
        taxRate: 39,
        weedFriendly: 80,
        alcoholFriendly: 100,
        religion: { 'Christianity': 44.7, 'No Religion': 38.9, 'Buddhism': 4.3, 'Islam': 3.5, 'Hinduism': 3.1, 'Other': 5.5 },
        ethnicity: { 'British/Irish': 33.1, 'Asian': 34.0, 'Other European': 18.0, 'Other': 14.9 },
        safety: { war: 98, terrorism: 88, cultural: 94 },
        healthcare: { quality: 90, cost: 65 },
        policeRisk: 92,
        lgbtqFriendly: 95,
        womenSafety: 90,
        costOfLiving: {
            currency: 'AUD',
            exchangeRate: 0.51,
            items: {
                'Meal at Inexpensive Restaurant': 28.00,
                'Domestic Beer (Pint)': 12.00,
                'Cappuccino': 5.50,
                'Milk (1L)': 2.18,
                'Bread (Loaf)': 3.67,
                'Cigarettes (Pack of 20)': 55.00,
                '1 Bedroom Apartment (City Centre)': 2500.00,
                'Internet (60 Mbps)': 78.00,
                'Monthly Transport Pass': 180.00,
                'Utilities (Monthly, 85m²)': 240.00
            }
        }
    },
    {
        name: 'Cairo',
        country: 'EG',
        corruption: 30,
        kidnapRisk: 3, // Updated from PDF: Medium
        taxRate: 23,
        weedFriendly: 10,
        alcoholFriendly: 40,
        religion: { 'Islam': 90.0, 'Christianity': 10.0 },
        ethnicity: { 'Egyptian Arab': 95.0, 'Nubian': 2.0, 'Other': 3.0 },
        safety: { war: 75, terrorism: 65, cultural: 60 },
        healthcare: { quality: 50, cost: 85 },
        policeRisk: 55,
        lgbtqFriendly: 5,
        womenSafety: 40,
        costOfLiving: {
            currency: 'EGP',
            exchangeRate: 0.016,
            items: {
                'Meal at Inexpensive Restaurant': 150.00,
                'Domestic Beer (Pint)': 80.00,
                'Cappuccino': 69.48,
                'Milk (1L)': 32.85,
                'Bread (Loaf)': 15.00,
                'Cigarettes (Pack of 20)': 80.00,
                '1 Bedroom Apartment (City Centre)': 11000.00,
                'Internet (60 Mbps)': 448.99,
                'Monthly Transport Pass': 400.00,
                'Utilities (Monthly, 85m²)': 715.71
            }
        }
    },
    {
        name: 'Cape Town',
        country: 'ZA',
        corruption: 41,
        kidnapRisk: 4, // Confirmed from PDF: High
        taxRate: 38,
        weedFriendly: 60,
        alcoholFriendly: 95,
        religion: { 'Christianity': 79.8, 'Islam': 1.5, 'No Religion': 15.1, 'Other': 3.6 },
        ethnicity: { 'Black African': 38.6, 'Coloured': 42.4, 'White': 15.7, 'Indian/Asian': 1.4, 'Other': 1.9 },
        safety: { war: 90, terrorism: 85, cultural: 75 },
        healthcare: { quality: 65, cost: 70 },
        policeRisk: 55,
        lgbtqFriendly: 85,
        womenSafety: 50,
        costOfLiving: {
            currency: 'ZAR',
            exchangeRate: 0.043,
            items: {
                'Meal at Inexpensive Restaurant': 150.00,
                'Domestic Beer (Pint)': 40.00,
                'Cappuccino': 39.26,
                'Milk (1L)': 20.42,
                'Bread (Loaf)': 16.62,
                'Cigarettes (Pack of 20)': 60.00,
                '1 Bedroom Apartment (City Centre)': 16500.00,
                'Internet (60 Mbps)': 711.76,
                'Monthly Transport Pass': 700.00,
                'Utilities (Monthly, 85m²)': 1425.00
            }
        }
    },
    {
        name: 'Nairobi',
        country: 'KE',
        corruption: 29,
        kidnapRisk: 3, // Updated from PDF: Medium
        taxRate: 30,
        weedFriendly: 40,
        alcoholFriendly: 85,
        religion: { 'Christianity': 85.5, 'Islam': 10.9, 'Traditional': 1.7, 'Other': 1.9 },
        ethnicity: { 'Kikuyu': 22.0, 'Luhya': 14.0, 'Luo': 13.0, 'Kalenjin': 12.0, 'Kamba': 11.0, 'Other': 28.0 },
        safety: { war: 75, terrorism: 60, cultural: 78 },
        healthcare: { quality: 55, cost: 75 },
        policeRisk: 60,
        lgbtqFriendly: 20,
        womenSafety: 45,
        costOfLiving: {
            currency: 'KES',
            exchangeRate: 0.0062,
            items: {
                'Meal at Inexpensive Restaurant': 800.00,
                'Domestic Beer (Pint)': 350.00,
                'Cappuccino': 414.09,
                'Milk (1L)': 153.33,
                'Bread (Loaf)': 61.59,
                'Cigarettes (Pack of 20)': 300.00,
                '1 Bedroom Apartment (City Centre)': 65000.00,
                'Internet (60 Mbps)': 5850.00,
                'Monthly Transport Pass': 6000.00,
                'Utilities (Monthly, 85m²)': 8500.00
            }
        }
    },
    {
        name: 'Lagos',
        country: 'NG',
        corruption: 25,
        kidnapRisk: 5, // Confirmed from PDF: Extreme
        taxRate: 20,
        weedFriendly: 30,
        alcoholFriendly: 60,
        religion: { 'Christianity': 50.0, 'Islam': 47.0, 'Traditional': 2.0, 'Other': 1.0 },
        ethnicity: { 'Yoruba': 28.0, 'Igbo': 22.0, 'Hausa': 18.0, 'Other': 32.0 },
        safety: { war: 70, terrorism: 55, cultural: 65 },
        healthcare: { quality: 45, cost: 75 },
        policeRisk: 45,
        lgbtqFriendly: 5,
        womenSafety: 35,
        costOfLiving: {
            currency: 'NGN',
            exchangeRate: 0.00059,
            items: {
                'Meal at Inexpensive Restaurant': 8000.00,
                'Domestic Beer (Pint)': 1500.00,
                'Cappuccino': 2800.00,
                'Milk (1L)': 1680.00,
                'Bread (Loaf)': 1800.00,
                'Cigarettes (Pack of 20)': 2000.00,
                '1 Bedroom Apartment (City Centre)': 1200000.00,
                'Internet (60 Mbps)': 45000.00,
                'Monthly Transport Pass': 40000.00,
                'Utilities (Monthly, 85m²)': 90000.00
            }
        }
    }
];

// Weather icon mapping
const WEATHER_ICONS = {
    '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

// API Configuration
const API_KEY = '9c0e09a72bb01808057ddd72e429269a';
const API_BASE = 'https://api.openweathermap.org/data/2.5';