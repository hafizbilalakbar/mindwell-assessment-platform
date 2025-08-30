// Direct Google Translate integration fallback script
(function() {
  // Check if already initialized
  if (window.translateInitialized) return;
  window.translateInitialized = true;
  
  // Create hidden element if it doesn't exist
  if (!document.getElementById('google_translate_element')) {
    try {
      const div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      document.body.appendChild(div);
    } catch (e) {
      console.error('Error creating google_translate_element:', e);
    }
  }
  
  // Add preconnect and preload hints for faster loading
  addResourceHints();
  
  // Define the callback function if not already defined
  if (!window.googleTranslateElementInit) {
    window.googleTranslateElementInit = function() {
      try {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
        
        // After initialization, hide elements and adjust fonts
        setTimeout(optimizeTranslationPerformance, 300);
      } catch (e) {
        console.error('Error in googleTranslateElementInit:', e);
      }
    };
  }
  
  // Load Google Translate script if not already loaded
  loadGoogleTranslateScript();
  
  // Add resource hints for faster loading
  function addResourceHints() {
    try {
      // Add preconnect for Google Translate domains
      const domains = [
        'translate.googleapis.com',
        'translate.google.com',
        'www.google.com',
        'translate-pa.googleapis.com'
      ];
      
      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = `https://${domain}`;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    } catch (e) {
      console.error('Error adding resource hints:', e);
    }
  }

  // Optimize translation performance
  function optimizeTranslationPerformance() {
    try {
      // Add translate-acceleration class to key elements
      document.querySelectorAll('main, header, footer, section, .container').forEach(el => {
        el.classList.add('translate-acceleration');
      });
      
      // Remove any Google-added inline styles that slow down translation
      document.querySelectorAll('[style*="transition"], [style*="animation"]').forEach(el => {
        if (el.style.transition) el.style.transition = 'none';
        if (el.style.animation) el.style.animation = 'none';
      });
    } catch (e) {
      console.error('Error optimizing translation performance:', e);
    }
  }

  // Fix translation UI issues
  function fixTranslateUI() {
    try {
      // Fix body position
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      
      // Hide Google Translate elements
      const elementsToHide = [
        document.querySelector('.goog-te-banner-frame'),
        document.querySelector('.skiptranslate'),
        document.querySelector('iframe[id=":1.container"]'),
        document.querySelector('.VIpgJd-ZVi9od-l4eHX-hSRGPd')
      ];
      
      elementsToHide.forEach(el => {
        if (el && el instanceof HTMLElement) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
        }
      });
      
      // Optimize performance
      optimizeTranslationPerformance();
    } catch (e) {
      console.error('Error fixing translate UI:', e);
    }
  }

  // Try multiple methods to ensure the script loads
  function loadGoogleTranslateScript() {
    try {
      if (window.google && window.google.translate) return;
      
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
      
      // Fallback if first attempt fails
      setTimeout(() => {
        if (!window.google || !window.google.translate) {
          const fallbackScript = document.createElement('script');
          fallbackScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          fallbackScript.async = true;
          document.head.appendChild(fallbackScript);
        }
      }, 1500);
    } catch (e) {
      console.error('Error loading Google Translate script:', e);
    }
  }

  // Global function to apply translation
  window.applyTranslation = function(langCode) {
    try {
      // If English, reset translation
      if (langCode === 'en') {
        window.resetTranslation();
        return;
      }
      
      // Set language attribute on HTML tag for proper font selection
      document.documentElement.setAttribute('lang', langCode);
      
      // Set translation cookie with multiple domain formats
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${window.location.hostname};`;
      
      // Store selection in localStorage for persistence
      localStorage.setItem('selectedLanguage', langCode);
      
      // Apply RTL classes if needed
      if (['ar', 'he', 'ur', 'fa', 'ps', 'sd'].includes(langCode)) {
        document.documentElement.classList.add('translated-rtl');
        document.documentElement.classList.remove('translated-ltr');
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.classList.add('translated-ltr');
        document.documentElement.classList.remove('translated-rtl');
        document.documentElement.dir = 'ltr';
      }
      
      // Use Google Translate API directly if available
      if (window.google && window.google.translate) {
        // Create a new instance
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: langCode,
          autoDisplay: true
        }, 'google_translate_element');
      }
      
      // Manipulate the select element
      setTimeout(() => {
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
          selectElement.value = langCode;
          selectElement.dispatchEvent(new Event('change'));
        }
      }, 100);
      
      // Fix UI issues immediately and with delays
      fixTranslateUI();
      setTimeout(fixTranslateUI, 300);
      setTimeout(fixTranslateUI, 800);
      
      // Dispatch custom event that translation was applied
      document.dispatchEvent(new CustomEvent('translationApplied', { 
        detail: { language: langCode } 
      }));
      
      console.log(`Applied translation to ${langCode}`);
    } catch (e) {
      console.error('Translation error:', e);
    }
  };
  
  // Global function to reset translation
  window.resetTranslation = function() {
    try {
      // Reset cookies
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';';
      
      // Clear localStorage
      localStorage.removeItem('selectedLanguage');
      
      // Reset HTML attributes
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.classList.remove('translated-rtl');
      document.documentElement.classList.remove('translated-ltr');
      document.documentElement.dir = 'ltr';
      
      // Reset Google Translate if possible
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        selectElement.value = 'en';
        selectElement.dispatchEvent(new Event('change'));
      }
      
      // Dispatch custom event that translation was reset
      document.dispatchEvent(new CustomEvent('translationReset'));
      
      console.log('Reset translation to English');
    } catch (e) {
      console.error('Error resetting translation:', e);
    }
  };
  
  // Initialize translation on page load
  function initTranslation() {
    try {
      // Check if there's a saved language preference
      const savedLangCode = localStorage.getItem('selectedLanguage');
      if (savedLangCode && savedLangCode !== 'en') {
        // Apply translation after a delay to ensure Google Translate has loaded
        setTimeout(() => {
          window.applyTranslation(savedLangCode);
        }, 1000);
      }
    } catch (e) {
      console.error('Error initializing translation:', e);
    }
  }
  
  // Auto-fix translation issues on dynamic content changes
  try {
    const observer = new MutationObserver(function(mutations) {
      // Check if body position was changed by Google Translate
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      
      // Fix fonts on mutation
      const savedLangCode = localStorage.getItem('selectedLanguage');
      if (savedLangCode && savedLangCode !== 'en') {
        document.documentElement.setAttribute('lang', savedLangCode);
        
        if (['ar', 'he', 'ur', 'fa', 'ps', 'sd'].includes(savedLangCode)) {
          document.documentElement.classList.add('translated-rtl');
        } else {
          document.documentElement.classList.add('translated-ltr');
        }
      }
    });

    // Start observing the body for style attribute changes
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['style'] 
    });
  } catch (e) {
    console.error('Error setting up mutation observer:', e);
  }
  
  // Wait for document to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslation);
  } else {
    initTranslation();
  }
})(); 