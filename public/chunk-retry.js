
// This script adds retry logic for chunk loading errors
(function() {
  const originalFetch = window.fetch;
  
  window.fetch = function(url, options) {
    return originalFetch(url, options).catch(error => {
      // Check if it's a chunk loading error (usually contains "chunk" in the URL)
      if (url && typeof url === 'string' && url.includes('chunk')) {
        console.log('🔄 Retrying chunk load:', url);
        
        // Add cache-busting parameter
        const cacheBustUrl = url.includes('?') 
          ? url + '&retry=' + Date.now() 
          : url + '?retry=' + Date.now();
        
        // Retry the request with cache busting
        return originalFetch(cacheBustUrl, options);
      }
      
      // For other errors, just propagate the error
      return Promise.reject(error);
    });
  };
  
  // Also patch the webpack chunk loading error handler
  const originalWebpackJsonp = window.webpackChunk_N_E;
  if (originalWebpackJsonp) {
    window.webpackChunk_N_E = {
      ...originalWebpackJsonp,
      push: function(chunk) {
        try {
          return originalWebpackJsonp.push(chunk);
        } catch (error) {
          console.error('Chunk load error detected, refreshing page in 2 seconds...');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          throw error;
        }
      }
    };
  }
  
  console.log('✅ Chunk retry handler installed');
})();
