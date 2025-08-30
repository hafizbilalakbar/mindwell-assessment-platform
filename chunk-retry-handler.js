// Chunk retry handler for Next.js
// This script helps recover from failed chunk loading
if (typeof window !== 'undefined') {
  // Store original chunk load function
  const originalChunkLoad = window.__webpack_chunk_load__;

  // Maximum number of retries
  const MAX_RETRIES = 3;
  
  // Retry delay in milliseconds (increases with each retry)
  const RETRY_DELAY = 1000;

  // Keep track of retry attempts for each chunk
  const retryAttempts = new Map();

  // Replace the chunk load function with our retry-enabled version
  window.__webpack_chunk_load__ = async function(chunkId) {
    let lastError;
    const attempts = retryAttempts.get(chunkId) || 0;

    // Try loading the chunk with retries
    for (let attempt = attempts; attempt < MAX_RETRIES; attempt++) {
      try {
        // Attempt to load the chunk
        const result = await originalChunkLoad.apply(this, arguments);
        
        // If successful, reset retry count and return result
        retryAttempts.delete(chunkId);
        return result;
      } catch (error) {
        lastError = error;
        
        // Update retry count
        retryAttempts.set(chunkId, attempt + 1);
        
        // Log the retry attempt
        console.warn(`Chunk ${chunkId} load failed (attempt ${attempt + 1}/${MAX_RETRIES}). Retrying...`);
        
        // Wait before retrying (increase delay with each attempt)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
      }
    }

    // If all retries failed, throw the last error
    console.error(`Chunk ${chunkId} load failed after ${MAX_RETRIES} attempts.`);
    throw lastError;
  };
} 