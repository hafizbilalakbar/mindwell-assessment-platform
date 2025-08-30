"use client"

import { useState, useEffect, useRef } from "react"
import Flag from "react-world-flags"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Globe, Search } from "lucide-react"
import { Loader2 } from "lucide-react"

type Language = {
  code: string;
  name: string;
  flag: string;
};

// Common languages with their codes and country flags
const commonLanguages: Language[] = [
  { code: "en", name: "English", flag: "GB" },
  { code: "es", name: "Español", flag: "ES" },
  { code: "fr", name: "Français", flag: "FR" },
  { code: "de", name: "Deutsch", flag: "DE" },
  { code: "ar", name: "العربية", flag: "SA" },
  { code: "zh-CN", name: "中文", flag: "CN" },
  { code: "ur", name: "اردو", flag: "PK" },
  { code: "hi", name: "हिन्दी", flag: "IN" },
];

// Additional languages (keep this for reference but we'll load dynamically)
const allLanguages: Language[] = [
  ...commonLanguages,
  { code: "it", name: "Italiano", flag: "IT" },
  { code: "pt", name: "Português", flag: "PT" },
  { code: "ru", name: "Русский", flag: "RU" },
  { code: "ja", name: "日本語", flag: "JP" },
  { code: "bn", name: "বাংলা", flag: "BD" },
  { code: "tr", name: "Türkçe", flag: "TR" },
  { code: "ko", name: "한국어", flag: "KR" },
  { code: "nl", name: "Nederlands", flag: "NL" },
  { code: "sv", name: "Svenska", flag: "SE" },
  { code: "pl", name: "Polski", flag: "PL" },
  { code: "da", name: "Dansk", flag: "DK" },
  { code: "fi", name: "Suomi", flag: "FI" },
  { code: "no", name: "Norsk", flag: "NO" },
  { code: "cs", name: "Čeština", flag: "CZ" },
  { code: "el", name: "Ελληνικά", flag: "GR" },
  { code: "hu", name: "Magyar", flag: "HU" },
  { code: "id", name: "Indonesia", flag: "ID" },
  { code: "ms", name: "Melayu", flag: "MY" },
  { code: "th", name: "ไทย", flag: "TH" },
  { code: "vi", name: "Tiếng Việt", flag: "VN" },
  { code: "fa", name: "فارسی", flag: "IR" },
  { code: "he", name: "עברית", flag: "IL" },
  { code: "ro", name: "Română", flag: "RO" },
  { code: "uk", name: "Українська", flag: "UA" },
];

export function GoogleTranslateSelector() {
  const [currentLang, setCurrentLang] = useState<Language>(commonLanguages[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>(commonLanguages);
  const searchRef = useRef<HTMLInputElement>(null);

  // Only render on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    
    try {
      // Set available languages
      setAvailableLanguages(allLanguages);
      
      // Check for saved language preference
      const savedLangCode = localStorage.getItem('selectedLanguage');
      if (savedLangCode) {
        const savedLang = allLanguages.find(lang => lang.code === savedLangCode);
        if (savedLang) {
          setCurrentLang(savedLang);
          
          // Wait a bit to ensure Google Translate is loaded
          if (savedLangCode !== 'en') {
            setTimeout(() => translatePage(savedLangCode), 500);
          }
        }
      }
    } catch (error) {
      console.error("Error initializing translation selector:", error);
    }
  }, []);

  // Filter languages based on search query
  const filteredLanguages = searchQuery
    ? availableLanguages.filter(lang => 
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // This function translates the page with visual feedback
  const translatePage = async (langCode: string) => {
    try {
      // Don't translate if already English and selecting English again
      if (langCode === 'en' && currentLang.code === 'en') return;
      
      // Show translating indicator
      setIsTranslating(true);
      
      // Add translating class to body for styles
      document.body.classList.add('translating');
      document.documentElement.setAttribute('lang', langCode);
      
      // Try to use the global fallback function first
      if (typeof window !== 'undefined' && window.applyTranslation) {
        window.applyTranslation(langCode);
        
        // Hide the translating indicator after a delay
        setTimeout(() => {
          setIsTranslating(false);
          document.body.classList.remove('translating');
          document.body.classList.add('translated');
        }, 800);
        
        return;
      }
      
      // Fallback to direct cookie-based approach
      if (langCode === 'en') {
        // Clear translation cookies
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';';
        
        // Reload page to reset translation
        window.location.reload();
        return;
      }
      
      // Set translation cookies with multiple formats for better compatibility
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      
      // Set domain cookies for cross-subdomain support
      try {
        const hostname = window.location.hostname;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${hostname}`;
        
        // Also set for root domain
        const rootDomain = hostname.split('.').slice(-2).join('.');
        if (rootDomain !== hostname) {
          document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${rootDomain}`;
        }
        
        // Also set for full domain with leading dot
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${hostname}`;
      } catch (e) {
        console.error('Error setting domain cookies:', e);
      }
      
      // Try to use select element (primary method)
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change'));
      } else {
        console.warn('Google Translate select element not found, trying alternative methods');
        
        // If no select element, try reloading the Google Translate script
        const script = document.createElement('script');
        script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
        script.async = true;
        document.head.appendChild(script);
        
        // Wait a bit and then retry
        setTimeout(() => {
          const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (selectElement) {
            selectElement.value = langCode;
            selectElement.dispatchEvent(new Event('change'));
          }
        }, 1000);
      }
      
      // Apply RTL classes for appropriate languages
      if (['ar', 'he', 'ur', 'fa', 'ps', 'sd'].includes(langCode)) {
        document.documentElement.classList.add('translated-rtl');
        document.documentElement.classList.remove('translated-ltr');
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.classList.add('translated-ltr');
        document.documentElement.classList.remove('translated-rtl');
        document.documentElement.dir = 'ltr';
      }
      
      // Hide Google Translate elements and fix UI issues
      const fixTranslateUI = () => {
        // Fix body position
        if (document.body.style.top && document.body.style.top !== '0px') {
          document.body.style.top = '0px';
        }
        
        // Hide Google Translate elements
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
        
        // Add hardware acceleration to improve performance
        document.querySelectorAll('main, header, footer, section, .container').forEach(el => {
          el.classList.add('translate-acceleration');
        });
      };
      
      // Apply fixes immediately and with increasing delays
      fixTranslateUI();
      [100, 300, 700, 1500, 3000].forEach(delay => {
        setTimeout(fixTranslateUI, delay);
      });
      
      // Hide translating indicator after a timeout
      setTimeout(() => {
        setIsTranslating(false);
        document.body.classList.remove('translating');
        document.body.classList.add('translated');
      }, 1500);
    } catch (error) {
      console.error("Error translating page:", error);
      setIsTranslating(false);
      
      // Try to recover from error
      document.body.classList.remove('translating');
    }
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      // Use requestAnimationFrame instead of setTimeout to avoid React error
      requestAnimationFrame(() => {
        if (searchRef.current) {
          searchRef.current.focus();
        }
      });
    }
  }, [isOpen]); // Keep only isOpen as dependency

  // Handle language change
  const handleLanguageChange = (lang: Language) => {
    try {
      // Skip if same language
      if (lang.code === currentLang.code) {
        setIsOpen(false);
        return;
      }
      
      setCurrentLang(lang);
      localStorage.setItem('selectedLanguage', lang.code);
      translatePage(lang.code);
      setIsOpen(false);
      setSearchQuery("");
    } catch (error) {
      console.error("Error changing language:", error);
      setIsOpen(false);
    }
  };

  // If not client-side yet, render minimal version to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="relative">
        <button suppressHydrationWarning className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">English</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="relative language-selector">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            suppressHydrationWarning 
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
          >
            {currentLang.flag ? (
              <Flag 
                code={currentLang.flag} 
                className="w-4 h-3 rounded-sm object-cover" 
                fallback={<Globe className="h-4 w-4 text-gray-500" />}
              />
            ) : (
              <Globe className="h-4 w-4 text-gray-500" />
            )}
            <span className="hidden sm:inline">{currentLang.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-auto language-dropdown dropdown-menu dropdown-content">
          <div className="p-2">
            <div className="flex items-center px-2 py-1.5 mb-1 rounded-md bg-gray-100 dark:bg-gray-800">
              <Search className="mr-2 h-3.5 w-3.5 text-gray-500" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full bg-transparent border-none focus:outline-none text-sm"
              />
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Show common languages when no search */}
          {!searchQuery && (
            <>
              <div className="p-2">
                <p className="text-xs text-gray-500 px-2 mb-1">Common Languages</p>
                {commonLanguages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang.flag ? (
                      <Flag 
                        code={lang.flag} 
                        className="w-4 h-3 rounded-sm object-cover" 
                        fallback={<div className="w-4 h-3 bg-gray-200 rounded-sm" />}
                      />
                    ) : (
                      <div className="w-4 h-3 bg-gray-200 rounded-sm" />
                    )}
                    <span className="flex-1">{lang.name}</span>
                    {currentLang.code === lang.code && (
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
              
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <p className="text-xs text-gray-500 px-2 mb-1">All Languages</p>
              </div>
            </>
          )}
          
          {/* Show search results or all languages */}
          <div className="p-2 pt-0">
            {(searchQuery ? filteredLanguages : availableLanguages)
              .filter(lang => !commonLanguages.some(common => common.code === lang.code) || searchQuery)
              .map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleLanguageChange(lang)}
                >
                  {lang.flag ? (
                    <Flag 
                      code={lang.flag} 
                      className="w-4 h-3 rounded-sm object-cover" 
                      fallback={<div className="w-4 h-3 bg-gray-200 rounded-sm" />}
                    />
                  ) : (
                    <div className="w-4 h-3 bg-gray-200 rounded-sm" />
                  )}
                  <span className="flex-1">{lang.name}</span>
                  {currentLang.code === lang.code && (
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  )}
                </DropdownMenuItem>
              ))}
              
            {/* No results message */}
            {searchQuery && filteredLanguages.length === 0 && (
              <div className="text-center py-2 text-sm text-gray-500">
                No languages found
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Translating indicator */}
      {isTranslating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-4" />
            <p className="text-lg font-medium">Translating page...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait a moment</p>
          </div>
        </div>
      )}
      
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" className="hidden"></div>
    </div>
  );
}

// Add TypeScript type definition for window object
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: any;
      };
    };
    applyTranslation?: (langCode: string) => void;
  }
} 