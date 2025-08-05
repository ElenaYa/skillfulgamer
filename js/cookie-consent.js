

class CookieConsent {
    constructor() {
        this.cookieConsentKey = 'skillfulgamer_cookie_consent';
        this.cookieSettingsKey = 'skillfulgamer_cookie_settings';
        this.cookieExpiryDays = 365;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createCookieBanner();
        this.bindEvents();
        this.checkExistingConsent();
    }

    createCookieBanner() {
        this.banner = document.getElementById('cookieConsent');
        this.modal = document.getElementById('cookieSettingsModal');
        
        if (!this.banner) {
            console.warn('Cookie consent banner not found');
            return;
        }
    }

    bindEvents() {
        const acceptBtn = document.getElementById('acceptCookies');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAllCookies());
        }

        const declineBtn = document.getElementById('declineCookies');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineCookies());
        }

        const settingsBtn = document.getElementById('cookieSettings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }

        const saveSettingsBtn = document.getElementById('saveCookieSettings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveCustomSettings());
        }

        document.addEventListener('click', (e) => {
            if (this.banner && this.banner.classList.contains('show') && 
                !this.banner.contains(e.target)) {
               
            }
        });
    }

    checkExistingConsent() {
        const consent = this.getCookieConsent();
        if (consent) {
            this.hideBanner();
            this.applyCookieSettings(consent);
        } else {
            setTimeout(() => this.showBanner(), 1000);
        }
    }

    showBanner() {
        if (this.banner) {
            this.banner.classList.add('show');
            
            this.banner.style.opacity = '0';
            this.banner.style.transform = 'translateY(100%)';
            
            setTimeout(() => {
                this.banner.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                this.banner.style.opacity = '1';
                this.banner.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    hideBanner() {
        if (this.banner) {
            this.banner.style.transform = 'translateY(100%)';
            this.banner.style.opacity = '0';
            
            setTimeout(() => {
                this.banner.classList.remove('show');
            }, 300);
        }
    }

    acceptAllCookies() {
        const settings = {
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: Date.now()
        };
        
        this.saveCookieSettings(settings);
        this.applyCookieSettings(settings);
        this.hideBanner();
        
        
    }

    declineCookies() {
        const settings = {
            essential: true,
            analytics: false,
            marketing: false,
            timestamp: Date.now()
        };
        
        this.saveCookieSettings(settings);
        this.applyCookieSettings(settings);
        this.hideBanner();
        
    }

    openSettings() {
        const currentSettings = this.getCookieConsent() || {
            essential: true,
            analytics: false,
            marketing: false
        };

        const analyticsCheckbox = document.getElementById('analyticsCookies');
        const marketingCheckbox = document.getElementById('marketingCookies');

        if (analyticsCheckbox) analyticsCheckbox.checked = currentSettings.analytics;
        if (marketingCheckbox) marketingCheckbox.checked = currentSettings.marketing;

        if (typeof bootstrap !== 'undefined' && this.modal) {
            const modal = new bootstrap.Modal(this.modal);
            modal.show();
        }
    }

    saveCustomSettings() {
        const analyticsCheckbox = document.getElementById('analyticsCookies');
        const marketingCheckbox = document.getElementById('marketingCookies');

        const settings = {
            essential: true, 
            analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
            marketing: marketingCheckbox ? marketingCheckbox.checked : false,
            timestamp: Date.now()
        };

        this.saveCookieSettings(settings);
        this.applyCookieSettings(settings);
        this.hideBanner();

        if (typeof bootstrap !== 'undefined' && this.modal) {
            const modal = bootstrap.Modal.getInstance(this.modal);
            if (modal) modal.hide();
        }

    }

    saveCookieSettings(settings) {
        localStorage.setItem(this.cookieSettingsKey, JSON.stringify(settings));
        
        const cookieValue = JSON.stringify({
            consent: true,
            settings: settings
        });
        
        this.setCookie(this.cookieConsentKey, cookieValue, this.cookieExpiryDays);
    }

    getCookieConsent() {
        const stored = localStorage.getItem(this.cookieSettingsKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to parse stored cookie settings');
            }
        }

        const cookieValue = this.getCookie(this.cookieConsentKey);
        if (cookieValue) {
            try {
                const parsed = JSON.parse(cookieValue);
                return parsed.settings;
            } catch (e) {
                console.warn('Failed to parse cookie consent');
            }
        }

        return null;
    }

    applyCookieSettings(settings) {
        if (settings.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }

        if (settings.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }

        document.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: settings
        }));
    }

    enableAnalytics() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
    }

    disableAnalytics() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        
    }

    enableMarketing() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted'
            });
        }
       
    }

    disableMarketing() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'denied'
            });
        }
        
      
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    static hasConsent(type = 'analytics') {
        const instance = window.cookieConsentInstance;
        if (!instance) return false;
        
        const settings = instance.getCookieConsent();
        return settings ? settings[type] : false;
    }

    static reopenSettings() {
        const instance = window.cookieConsentInstance;
        if (instance) {
            instance.openSettings();
        }
    }

    static resetConsent() {
        localStorage.removeItem('skillfulgamer_cookie_settings');
        document.cookie = 'skillfulgamer_cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsentInstance = new CookieConsent();
});

window.CookieConsent = CookieConsent;
