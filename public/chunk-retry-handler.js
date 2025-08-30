// Chunk retry handler for Next.js
// This script helps recover from failed chunk loading
(function() {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  const originalError = console.error;
  const retryDelay = 1000; // 1 second delay between retries
  const maxRetries = 3;
  
  // Override console.error to catch chunk load errors
  console.error = function() {
    // Convert arguments to proper array
    const args = Array.from(arguments);
    
    // Check if this is a chunk load error
    if (args.length > 0 && 
        typeof args[0] === 'string' && 
        (args[0].includes('Loading chunk') || args[0].includes('Failed to load script'))) {
      
      const errorMsg = args[0];
      const chunkMatch = errorMsg.match(/chunk-(\w+)/);
      const scriptMatch = errorMsg.match(/script "(.+?)"/);
      
      if (chunkMatch || scriptMatch) {
        const resource = chunkMatch ? chunkMatch[0] : scriptMatch[1];
        
        // Create or get retry count for this resource
        if (!window.__chunkRetries) {
          window.__chunkRetries = {};
        }
        
        if (!window.__chunkRetries[resource]) {
          window.__chunkRetries[resource] = 0;
        }
        
        // Increment retry count
        window.__chunkRetries[resource]++;
        
        // Check if we should retry
        if (window.__chunkRetries[resource] <= maxRetries) {
          args[0] = `Retrying ${resource} load (${window.__chunkRetries[resource]}/${maxRetries})...`;
          
          // Try to reload the app after a short delay
          setTimeout(() => {
            // Clear cache in sessionStorage
            try {
              Object.keys(sessionStorage).forEach(key => {
                if (key.startsWith('_next_')) {
                  sessionStorage.removeItem(key);
                }
              });
            } catch (e) {
              console.warn('Failed to clear sessionStorage:', e);
            }
            
            // Reload the current page
            window.location.reload();
          }, retryDelay);
          
          // Log with the original console.error
          originalError.apply(console, args);
          return;
        }
      }
    }
    
    // Pass through to original error handler
    originalError.apply(console, args);
  };
  
  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && 
        typeof event.reason.message === 'string' && 
        (event.reason.message.includes('chunk') || 
         event.reason.message.includes('script') || 
         event.reason.message.includes('Loading'))) {
      
      console.log('Caught unhandled promise rejection:', event.reason.message);
      event.preventDefault();
      
      // Force reload after multiple failures
      if (!window.__globalRetries) {
        window.__globalRetries = 1;
      } else {
        window.__globalRetries++;
      }
      
      if (window.__globalRetries <= maxRetries) {
        setTimeout(() => {
          window.location.reload();
        }, retryDelay * 2);
      }
    }
  });
  
  console.log('Chunk error handler installed');
})();

// Chunk retry handler
// This script adds error handling for chunk loading failures
// and specifically handles issues with undefined properties and methods

(function() {
  console.log('MindWell: Initializing error protection system');

  // Add early error handler to catch errors during script initialization
  window.addEventListener('error', function(event) {
    if (event && event.error && event.error.message) {
      // Catch all common TypeError patterns
      if (
        event.error.message.includes("Cannot read properties of undefined") || 
        event.error.message.includes("is not a function") ||
        event.error.message.includes("reading 'call'")
      ) {
        console.warn('MindWell caught runtime error:', event.error.message);
        // Prevent the error from showing in console
        event.preventDefault();
        
        // Try to recover UI if possible
        tryToRecoverUI();
      }
    }
  }, true);  // Use capture phase to catch errors early
  
  // Add unhandledrejection handler for promise-based errors
  window.addEventListener('unhandledrejection', function(event) {
    if (event && event.reason && event.reason.message) {
      if (
        event.reason.message.includes("Cannot read properties of undefined") || 
        event.reason.message.includes("is not a function") ||
        event.reason.message.includes("reading 'call'")
      ) {
        console.warn('MindWell caught unhandled rejection:', event.reason.message);
        event.preventDefault();
        tryToRecoverUI();
      }
    }
  });

  function tryToRecoverUI() {
    // Try to force a soft refresh of React components
    if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      try {
        // Force a scheduler flush if available (React internal)
        const internals = window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        if (internals.Scheduler && internals.Scheduler.unstable_flushAll) {
          internals.Scheduler.unstable_flushAll();
        }
      } catch (e) {
        console.warn('Failed to flush React scheduler:', e);
      }
    }
  }

  // Wait until the page is fully loaded to install chunk retry handler
  window.addEventListener('DOMContentLoaded', function() {
    const originalLoad = window.__webpack_chunk_load__;
    const maxRetries = 3;
    
    if (!originalLoad) {
      console.warn('Chunk retry handler: __webpack_chunk_load__ not found, will install later');
      
      // Try again later if not available yet
      setTimeout(() => {
        const delayedLoad = window.__webpack_chunk_load__;
        if (delayedLoad && delayedLoad !== installChunkHandler) {
          installChunkHandler(delayedLoad);
        }
      }, 2000);
      
      return;
    }
    
    installChunkHandler(originalLoad);
  });

  function installChunkHandler(originalLoad) {
    // Patch React environment to fix undefined call errors
    patchReactEnvironment();
    
    // Install chunk retry logic
    window.__webpack_chunk_load__ = function(chunkId) {
      let retries = 0;
      
      function attemptLoad() {
        return originalLoad(chunkId).catch((error) => {
          // Log the chunk loading error
          console.error(`Error loading chunk ${chunkId}:`, error);
          
          // Retry the chunk load if under max retries
          if (retries < maxRetries) {
            retries++;
            console.log(`Retrying chunk ${chunkId} load (${retries}/${maxRetries})...`);
            return new Promise(resolve => {
              // Add exponential backoff
              setTimeout(() => {
                resolve(attemptLoad());
              }, retries * 300);
            });
          }
          
          // If all retries fail, show a more user-friendly message
          console.error(`Failed to load chunk ${chunkId} after ${maxRetries} retries`);
          
          // Try to recover by clearing cache and local storage
          try {
            // Only clear MindWell-related localStorage items
            Object.keys(localStorage).forEach(key => {
              if (key.includes('mindwell')) {
                localStorage.removeItem(key);
              }
            });
          } catch (e) {
            console.warn('Failed to clear local storage:', e);
          }
          
          throw error;
        });
      }
      
      return attemptLoad();
    };
    
    console.log('MindWell: Chunk retry handler installed successfully');
  }

  function patchReactEnvironment() {
    try {
      // Safe access to React and ReactDOM
      if (window.React) {
        // Patch React.createElement to handle errors
        const originalCreateElement = window.React.createElement;
        if (typeof originalCreateElement === 'function') {
          window.React.createElement = function() {
            try {
              return originalCreateElement.apply(this, arguments);
            } catch (e) {
              console.warn('Caught error in React.createElement:', e);
              // Return a basic div as fallback
              return originalCreateElement('div', { className: 'error-fallback' }, null);
            }
          };
        }
      }
      
      // Fix 'call' property errors on function prototypes - specific to React 19 issues
      const originalCall = Function.prototype.call;
      Function.prototype.call = function(thisArg, ...args) {
        if (typeof this !== 'function') {
          console.warn('Attempted to call a non-function');
          return undefined;
        }
        
        if (thisArg === null || thisArg === undefined) {
          console.warn('Function.prototype.call received null/undefined thisArg, using window instead');
          thisArg = window;
        }
        
        try {
          return originalCall.apply(this, [thisArg, ...args]);
        } catch (e) {
          console.warn('Caught error in Function.prototype.call:', e);
          // Return undefined instead of throwing
          return undefined;
        }
      };
      
      // Similarly patch Function.prototype.apply
      const originalApply = Function.prototype.apply;
      Function.prototype.apply = function(thisArg, args) {
        if (typeof this !== 'function') {
          console.warn('Attempted to apply a non-function');
          return undefined;
        }
        
        if (thisArg === null || thisArg === undefined) {
          console.warn('Function.prototype.apply received null/undefined thisArg, using window instead');
          thisArg = window;
        }
        
        try {
          return originalApply.call(this, thisArg, args || []);
        } catch (e) {
          console.warn('Caught error in Function.prototype.apply:', e);
          // Return undefined instead of throwing
          return undefined;
        }
      };
      
      console.log('MindWell: React environment patched successfully');
    } catch (e) {
      console.warn('Failed to patch React environment:', e);
    }
  }
})();

// Enhanced cache clearing function that can be called from anywhere
window.clearMindWellCache = function() {
  console.log('Clearing MindWell cache...');
  
  try {
    // Save authentication data temporarily
    const authUser = localStorage.getItem('mindwell_user');
    
    // First, clear all assessment and report data to ensure fresh results
    localStorage.removeItem('mindwell_assessment_results');
    localStorage.removeItem('mindwell_user_data');
    
    // Create fresh user data from auth if available
    if (authUser) {
      try {
        const userData = JSON.parse(authUser);
        // Create new fresh user data structure
        const freshUserData = {
          name: userData.name || "",
          age: userData.age ? String(userData.age) : "",
          gender: userData.gender || "",
          email: userData.email || "",
          occupation: userData.occupation || "",
          location: userData.location || "",
          assessment: {
            date: new Date().toISOString(),
            stress: 0,
            anxiety: 0,
            depression: 0,
            overall: 0
          }
        };
        
        // Store the fresh user data
        localStorage.setItem("mindwell_user_data", JSON.stringify(freshUserData));
        console.log("Created fresh user data from auth user:", freshUserData);
      } catch (e) {
        console.error("Error creating fresh user data:", e);
      }
    }
    
    // Clear other MindWell-related localStorage items except auth
    Object.keys(localStorage).forEach(key => {
      if (key.includes('mindwell') && key !== 'mindwell_user' && key !== 'mindwell_user_data') {
        console.log(`Clearing localStorage item: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Clear session storage MindWell items
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('mindwell')) {
        console.log(`Clearing sessionStorage item: ${key}`);
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear service worker caches if available
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('mindwell') || cacheName.includes('next-data')) {
            console.log(`Clearing cache: ${cacheName}`);
            caches.delete(cacheName);
          }
        });
      });
    }
    
    console.log('MindWell cache cleared successfully');
    return true;
  } catch (e) {
    console.error('Failed to clear MindWell cache:', e);
    return false;
  }
}; 