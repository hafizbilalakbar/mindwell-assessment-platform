"use client"

import { useState, useEffect } from "react"
import Flag from "react-world-flags"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Globe } from "lucide-react"
import googleTranslateUtils from "@/lib/google-translate"

type Language = {
  code: string;
  name: string;
  flag: string;
};

// Common languages with their codes and country flags
const languages: Language[] = [
  { code: "en", name: "English", flag: "GB" },
  { code: "es", name: "Español", flag: "ES" },
  { code: "fr", name: "Français", flag: "FR" },
  { code: "de", name: "Deutsch", flag: "DE" },
  { code: "it", name: "Italiano", flag: "IT" },
  { code: "pt", name: "Português", flag: "PT" },
  { code: "ru", name: "Русский", flag: "RU" },
  { code: "ja", name: "日本語", flag: "JP" },
  { code: "zh-CN", name: "中文", flag: "CN" },
  { code: "ar", name: "العربية", flag: "SA" },
  { code: "hi", name: "हिन्दी", flag: "IN" },
  { code: "ur", name: "اردو", flag: "PK" },
  { code: "bn", name: "বাংলা", flag: "BD" },
  { code: "tr", name: "Türkçe", flag: "TR" },
  { code: "ko", name: "한국어", flag: "KR" },
];

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load previously selected language from localStorage if available
  useEffect(() => {
    const savedLangCode = localStorage.getItem('selectedLanguage');
    if (savedLangCode) {
      const savedLang = languages.find(lang => lang.code === savedLangCode);
      if (savedLang) {
        setCurrentLang(savedLang);
        // Apply the saved language after a short delay to ensure Google Translate is loaded
        setTimeout(() => {
          handleLanguageChange(savedLang, false);
        }, 1000);
      }
    }
  }, [isLoaded]);

  // Initialize Google Translate API
  useEffect(() => {
    // Function to initialize Google Translate
    const initGoogleTranslate = () => {
      // Apply utility function to handle styling and cleanup
      googleTranslateUtils.init();
      
      // Check if the script is already added
      if (document.getElementById("google-translate-script")) {
        setIsLoaded(true);
        return;
      }

      // Create and add the Google Translate script
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      // Create a global function for Google Translate to call
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            includedLanguages: languages.map(lang => lang.code).join(","),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          "google_translate_element"
        );
        setIsLoaded(true);

        // Fix for Google Translate causing scrollbar issues
        document.documentElement.style.overflowX = 'hidden';
        
        // Add event listener to fix translation overlay issues
        const observer = new MutationObserver((mutations) => {
          if (document.body.style.top !== '0px' && document.body.style.top !== '') {
            document.body.style.top = '0px';
          }
        });
        
        observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
      };
    };

    initGoogleTranslate();

    // Cleanup function
    return () => {
      // Remove global function if it exists
      if ('googleTranslateElementInit' in window) {
        // @ts-ignore - We know this property exists
        window.googleTranslateElementInit = undefined;
      }

      // Remove script tag
      const script = document.getElementById("google-translate-script");
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle language change
  const handleLanguageChange = (lang: Language, saveToStorage = true) => {
    setCurrentLang(lang);
    
    // Save selected language to localStorage for persistence
    if (saveToStorage) {
      localStorage.setItem('selectedLanguage', lang.code);
    }
    
    // Try multiple approaches to change the language
    // Approach 1: Using our utility function
    if (googleTranslateUtils.setLanguage(lang.code)) {
      return;
    }
    
    // Approach 2: Using the select element directly
    const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = lang.code;
      selectElement.dispatchEvent(new Event("change"));
      return;
    }
    
    // Approach 3: Fallback method if the standard approaches don't work
    const langSelect = () => {
      const iframe = document.querySelector(".goog-te-menu-frame") as HTMLIFrameElement;
      if (!iframe) {
        setTimeout(langSelect, 100);
        return;
      }
      
      // Get the document inside the iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        setTimeout(langSelect, 100);
        return;
      }
      
      // Find and click the language link
      const links = iframeDoc.querySelectorAll("a.goog-te-menu2-item");
      for (let i = 0; i < links.length; i++) {
        const link = links[i] as HTMLElement;
        if (link.textContent?.includes(lang.name)) {
          link.click();
          break;
        }
      }
    };
    
    // Trigger translation
    const translateElementTrigger = document.querySelector(".goog-te-gadget-simple") as HTMLElement;
    if (translateElementTrigger) {
      translateElementTrigger.click();
      setTimeout(langSelect, 100);
    }
    
    // Approach 4: Try cookie-based approach as last resort
    if (lang.code === 'en') {
      // Reset to English
      googleTranslateUtils.resetToOriginal();
    } else {
      // Force reload with the selected language
      document.cookie = `googtrans=/en/${lang.code}`;
      // Force the widget to update
      const translateElement = document.getElementById('google_translate_element');
      if (translateElement) {
        translateElement.innerHTML = '';
        window.googleTranslateElementInit();
      }
    }
  };

  return (
    <div className="relative">
      {/* Hidden element for Google Translate API */}
      <div id="google_translate_element" className="hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none">
          <div className="flex items-center gap-2">
            {currentLang.flag ? (
              <div className="w-5 h-4 rounded overflow-hidden relative flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-700">
                <Flag 
                  code={currentLang.flag} 
                  fallback={<Globe className="w-4 h-4" />}
                  style={{ 
                    display: 'block', 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ) : (
              <Globe className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{currentLang.name}</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-y-auto">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className="flex items-center gap-3 cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="w-5 h-4 rounded overflow-hidden relative flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-700">
                <Flag 
                  code={lang.flag} 
                  fallback={<Globe className="w-4 h-4" />}
                  style={{ 
                    display: 'block', 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <span className="flex-grow">{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Add TypeScript type for window object
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: any;
      };
    };
  }
} 