"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  
  // This effect runs when the component mounts - client-side only
  useEffect(() => {
    setIsClient(true)
    
    // Fix translation issues after navigation
    const fixTranslationAfterNavigation = () => {
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
      
      // Reapply translation from saved language
      const savedLangCode = localStorage.getItem('selectedLanguage')
      if (savedLangCode && savedLangCode !== 'en') {
        // Set lang attribute for proper font selection
        document.documentElement.setAttribute('lang', savedLangCode);
        
        // Apply RTL classes if needed
        if (['ar', 'he', 'ur', 'fa', 'ps', 'sd'].includes(savedLangCode)) {
          document.documentElement.classList.add('translated-rtl');
          document.documentElement.classList.remove('translated-ltr');
          document.documentElement.dir = 'rtl';
        } else {
          document.documentElement.classList.add('translated-ltr');
          document.documentElement.classList.remove('translated-rtl');
          document.documentElement.dir = 'ltr';
        }
        
        // Set translation cookies
        try {
          document.cookie = `googtrans=/en/${savedLangCode}; path=/`;
          
          const hostname = window.location.hostname;
          document.cookie = `googtrans=/en/${savedLangCode}; path=/; domain=${hostname}`;
          
          // Also set for root domain
          const rootDomain = hostname.split('.').slice(-2).join('.');
          if (rootDomain !== hostname) {
            document.cookie = `googtrans=/en/${savedLangCode}; path=/; domain=.${rootDomain}`;
          }
          
          // Also set for full domain with leading dot
          document.cookie = `googtrans=/en/${savedLangCode}; path=/; domain=.${hostname}`;
        } catch (e) {
          console.error('Error setting cookies:', e);
        }
        
        // Try to trigger translation via select element
        setTimeout(() => {
          const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (selectElement) {
            selectElement.value = savedLangCode;
            selectElement.dispatchEvent(new Event('change'));
          } else if (window.applyTranslation) {
            // Use the global function if available
            window.applyTranslation(savedLangCode);
          }
        }, 500);
      }
    }
    
    // Run the fix both immediately and after delays
    fixTranslationAfterNavigation();
    [500, 1000, 2000, 3000].forEach(delay => {
      setTimeout(fixTranslationAfterNavigation, delay);
    });
    
    // Set up a mutation observer to fix translate issues when DOM changes
    const observer = new MutationObserver(() => {
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      
      // Hide any Google Translate banners that appear
      const banner = document.querySelector('.goog-te-banner-frame');
      if (banner && banner instanceof HTMLElement) {
        banner.style.display = 'none';
      }
    });
    
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['style', 'class'] 
    });
    
    // Clean up observer on unmount
    return () => observer.disconnect();
  }, [])
  
  // This effect runs when the route changes
  useEffect(() => {
    if (!isClient) return;
    
    // Fix translation issues after navigation
    const fixTranslationAfterNavigation = () => {
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
      
      // Reapply translation from saved language
      const savedLangCode = localStorage.getItem('selectedLanguage')
      if (savedLangCode && savedLangCode !== 'en') {
        // Set lang attribute for proper font selection
        document.documentElement.setAttribute('lang', savedLangCode);
        
        // Apply RTL classes if needed
        if (['ar', 'he', 'ur', 'fa', 'ps', 'sd'].includes(savedLangCode)) {
          document.documentElement.classList.add('translated-rtl');
          document.documentElement.classList.remove('translated-ltr');
          document.documentElement.dir = 'rtl';
        } else {
          document.documentElement.classList.add('translated-ltr');
          document.documentElement.classList.remove('translated-rtl');
          document.documentElement.dir = 'ltr';
        }
        
        // Call the global function if available
        if (window.applyTranslation) {
          window.applyTranslation(savedLangCode);
        }
      }
    }
    
    // Run the fix both immediately and after delays
    fixTranslationAfterNavigation();
    [300, 800, 1500].forEach(delay => {
      setTimeout(fixTranslationAfterNavigation, delay);
    });
  }, [pathname, isClient])
  
  return (
    <>
      {children}
      {isClient && (
        <div id="google_translate_element" style={{ display: 'none' }}></div>
      )}
    </>
  )
}

export default TranslationProvider 