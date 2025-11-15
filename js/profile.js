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
            alcoholPreference: 'prefer',
            cannabisPreference: 'neutral',
            idealTemp: 30,

            // Weights (must sum to 100)
            weights: {
                tax: 25,
                weather: 10,
                costOfLiving: 14,
                safety: 13,
                healthcare: 8,
                policeRisk: 6,
                alcohol: 8,
                cannabis: 2,
                timezone: 6,
                corruption: 8
            }
        };
    }

    loadFromStorage() {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            try {
                const savedProfile = JSON.parse(saved);
                const defaults = this.getDefaultProfile();

                // Merge weights separately to ensure new weights are added
                if (savedProfile.weights) {
                    savedProfile.weights = { ...defaults.weights, ...savedProfile.weights };
                }

                this.profile = { ...defaults, ...savedProfile };
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
            const defaults = this.getDefaultProfile();

            // Merge weights separately to ensure all weights are present
            if (imported.weights) {
                imported.weights = { ...defaults.weights, ...imported.weights };
            }

            this.profile = { ...defaults, ...imported };
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

