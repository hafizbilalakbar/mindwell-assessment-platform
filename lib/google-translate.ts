// Add additional methods to properly handle Google Translate
export const googleTranslateUtils = {
  // Initialize Google Translate and clean up UI
  init: () => {
    // Add CSS to hide unwanted elements and fix styling
    const style = document.createElement('style');
    style.textContent = `
      /* Hide Google translate elements */
      .goog-te-banner-frame { display: none !important; }
      .goog-te-menu-value { text-decoration: none !important; }
      .VIpgJd-ZVi9od-l4eHX-hSRGPd { display: none !important; }
      .goog-te-gadget { font-size: 0px !important; }
      .goog-te-gadget .goog-te-combo { display: none !important; }
      .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }
      .skiptranslate { display: none !important; }
      .goog-tooltip { display: none !important; }
      .goog-text-highlight { background-color: transparent !important; }
      body { top: 0 !important; }
      
      /* Fix issues with translated pages */
      .translated-ltr { margin-top: 0 !important; }
      .translated-rtl { margin-top: 0 !important; }
      .goog-tooltip { display: none !important; }
      .goog-tooltip:hover { display: none !important; }
      .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }

      /* Fix RTL language issues */
      .translated-rtl .nav-glass,
      .translated-rtl .footer {
        direction: ltr !important;
      }
      
      /* Fix assessment content in RTL languages */
      .translated-rtl .quiz-option,
      .translated-rtl .quiz-card {
        text-align: right;
        direction: rtl;
      }
      
      /* Improve Arabic and Urdu translation appearance */
      .translated-rtl {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
      }
      
      /* Fix for Google Translate frames and banners */
      body > .skiptranslate,
      iframe[id=":1.container"],
      .goog-te-banner-frame.skiptranslate {
        display: none !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);

    // Fix issues with translated pages
    const setupTranslationFixes = () => {
      // Remove the Google Translate top bar and fix body positioning
      const removeTopBar = () => {
        const elements = [
          document.querySelector('iframe[id=":1.container"]'),
          document.querySelector('.skiptranslate'),
          document.querySelector('.VIpgJd-ZVi9od-ORHb-OEVmcd'),
          document.querySelector('.goog-te-banner-frame')
        ];
        
        elements.forEach(el => {
          if (el && el instanceof HTMLElement) {
            el.style.display = 'none';
          }
        });
        
        // Fix body positioning
        if (document.body.style.top && document.body.style.top !== '0px') {
          document.body.style.top = '0px';
        }
      };
      
      // Run multiple times to ensure it's removed
      removeTopBar();
      setTimeout(removeTopBar, 300);
      setTimeout(removeTopBar, 1000);
      setTimeout(removeTopBar, 2000);
      
      // Add event listener for when translation happens
      const observer = new MutationObserver(() => {
        const body = document.body;
        if (body.style.top && body.style.top !== '0px') {
          body.style.top = '0px';
        }
      });
      
      observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

      // Handle page navigation
      if (typeof window !== 'undefined') {
        // Fix translation on page transitions in Next.js
        const handleRouteChange = () => {
          setTimeout(removeTopBar, 100);
          setTimeout(fixTranslatedContent, 500);
        };
        
        // Check if using next.js
        if (typeof window.next !== 'undefined') {
          document.addEventListener('routeChangeComplete', handleRouteChange);
        }
      }
    };

    // Fix translation issues for specific elements
    const fixTranslatedContent = () => {
      // Fix for assessment content
      const assessmentElements = document.querySelectorAll('.quiz-option, .quiz-card');
      if (assessmentElements.length > 0) {
        // Apply specific fixes for assessment elements if needed
        assessmentElements.forEach(el => {
          if (document.body.classList.contains('translated-rtl') && el instanceof HTMLElement) {
            el.style.textAlign = 'right';
            el.style.direction = 'rtl';
          }
        });
      }
    };

    if (typeof window !== 'undefined') {
      // Set up MutationObserver to watch for Google's translation changes
      window.addEventListener('DOMContentLoaded', setupTranslationFixes);
      document.addEventListener('DOMContentLoaded', setupTranslationFixes);
      
      // Fix translations on any dynamic content changes
      const bodyObserver = new MutationObserver((mutations) => {
        if (document.body.classList.contains('translated-rtl') || 
            document.body.classList.contains('translated-ltr')) {
          fixTranslatedContent();
        }
      });
      
      // Start observing
      bodyObserver.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }
  },
  
  // Change the language programmatically
  setLanguage: (languageCode: string) => {
    // Save language preference in cookie to ensure persistence across pages
    const setTranslateCookie = (code: string) => {
      if (code === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';';
        
        // Also try to clear for root domain
        try {
          const hostname = window.location.hostname;
          const rootDomain = hostname.split('.').slice(-2).join('.');
          if (rootDomain !== hostname) {
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + rootDomain + ';';
          }
        } catch (e) {
          console.error('Error clearing root domain cookie:', e);
        }
      } else {
        // Set with various domain formats for maximum compatibility
        document.cookie = `googtrans=/en/${code}; path=/`;
        
        try {
          const hostname = window.location.hostname;
          document.cookie = `googtrans=/en/${code}; path=/; domain=${hostname}`;
          
          // Also set for root domain
          const rootDomain = hostname.split('.').slice(-2).join('.');
          if (rootDomain !== hostname) {
            document.cookie = `googtrans=/en/${code}; path=/; domain=.${rootDomain}`;
          }
          
          // Also set for full domain with leading dot
          document.cookie = `googtrans=/en/${code}; path=/; domain=.${hostname}`;
        } catch (e) {
          console.error('Error setting domain cookies:', e);
        }
      }
    };
    
    // Store language preference in localStorage
    if (languageCode === 'en') {
      localStorage.removeItem('selectedLanguage');
    } else {
      localStorage.setItem('selectedLanguage', languageCode);
    }
    
    // Set the HTML lang attribute
    document.documentElement.setAttribute('lang', languageCode);
    
    // Apply RTL/LTR classes
    if (['ar', 'he', 'ur', 'fa', 'ps', 'sd'].includes(languageCode)) {
      document.documentElement.classList.add('translated-rtl');
      document.documentElement.classList.remove('translated-ltr');
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.classList.add('translated-ltr');
      document.documentElement.classList.remove('translated-rtl');
      document.documentElement.dir = 'ltr';
    }
    
    // Try to set language via cookie
    setTranslateCookie(languageCode);
    
    // Then try to set via select element
    const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = languageCode;
      selectElement.dispatchEvent(new Event("change"));
      
      // Hide Google Translate elements after selection
      setTimeout(() => {
        const elementsToHide = [
          document.querySelector('.goog-te-banner-frame'),
          document.querySelector('.skiptranslate'),
          document.querySelector('iframe[id=":1.container"]'),
          document.querySelector('.VIpgJd-ZVi9od-l4eHX-hSRGPd'),
          document.querySelector('.goog-te-gadget')
        ];
        
        elementsToHide.forEach(el => {
          if (el && el instanceof HTMLElement) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
          }
        });
        
        // Fix body position
        if (document.body.style.top && document.body.style.top !== '0px') {
          document.body.style.top = '0px';
        }
      }, 300);
      
      return true;
    } else if (window.applyTranslation) {
      // Try using the global applyTranslation function
      window.applyTranslation(languageCode);
      return true;
    }
    
    return false;
  },
  
  // Reset to original language
  resetToOriginal: () => {
    // Clear translation cookie
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.'+window.location.hostname+';';

    // Find the reset button within Google Translate
    const iframe = document.querySelector(".goog-te-menu-frame") as HTMLIFrameElement;
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        const resetLink = iframeDoc.querySelector('a.goog-te-menu2-item[id*="-0"]') as HTMLElement;
        if (resetLink) {
          resetLink.click();
          return true;
        }
      }
    }
    
    // Alternative reset approach
    const resetLink = document.querySelector(".goog-te-banner-frame") as HTMLIFrameElement;
    if (resetLink) {
      const iframeDoc = resetLink.contentDocument || resetLink.contentWindow?.document;
      if (iframeDoc) {
        const resetButton = iframeDoc.querySelector('a.goog-close-link') as HTMLElement;
        if (resetButton) {
          resetButton.click();
          return true;
        }
      }
    }
    
    return false;
  },
  
  // Fix content after translation
  fixTranslatedContent: () => {
    // Fix body positioning
    document.body.style.top = '0px';
    
    // Remove unwanted elements
    const elements = [
      document.querySelector('iframe[id=":1.container"]'),
      document.querySelector('.skiptranslate'),
      document.querySelector('.VIpgJd-ZVi9od-ORHb-OEVmcd'),
      document.querySelector('.goog-te-banner-frame')
    ];
    
    elements.forEach(el => {
      if (el && el instanceof HTMLElement) {
        el.style.display = 'none';
      }
    });
  }
};

// Define the Google Translate Element type for TypeScript
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: any;
      };
    };
    next?: any;
  }
}

export default googleTranslateUtils; 