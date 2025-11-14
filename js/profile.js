// User profile management
class UserProfile {
    constructor() {
        this.profile = this.getDefaultProfile();
        this.loadFromStorage();
    }

    getDefaultProfile() {
        return {
            // Demographics
            ethnicity: 'white',
            religion: 'none',
            gender: 'male',
            lgbtq: false,

            // Preferences
            cannabisPreference: 'prefer',
            alcoholPreference: 'prefer',
            idealTemp: 30,

            // Weights (must sum to 100)
            weights: {
                tax: 27,
                weather: 11,
                costOfLiving: 15,
                safety: 15,
                healthcare: 8,
                cannabis: 2,
                policeRisk: 7,
                alcohol: 9,
                timezone: 6
            }
        };
    }

    loadFromStorage() {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            try {
                this.profile = { ...this.getDefaultProfile(), ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error loading profile:', e);
            }
        }
    }

    save() {
        localStorage.setItem('userProfile', JSON.stringify(this.profile));
    }

    update(updates) {
        this.profile = { ...this.profile, ...updates };
        this.save();
    }

    reset() {
        this.profile = this.getDefaultProfile();
        this.save();
    }

    exportProfile() {
        const dataStr = JSON.stringify(this.profile, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'my-profile.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    importProfile(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.profile = { ...this.getDefaultProfile(), ...imported };
            this.save();
            return true;
        } catch (e) {
            console.error('Error importing profile:', e);
            return false;
        }
    }

    getWeightsTotal() {
        return Object.values(this.profile.weights).reduce((sum, val) => sum + val, 0);
    }

    normalizeWeights() {
        const total = this.getWeightsTotal();
        if (total !== 100) {
            const factor = 100 / total;
            Object.keys(this.profile.weights).forEach(key => {
                this.profile.weights[key] = Math.round(this.profile.weights[key] * factor);
            });
        }
    }
}

// Global profile instance
const userProfile = new UserProfile();

