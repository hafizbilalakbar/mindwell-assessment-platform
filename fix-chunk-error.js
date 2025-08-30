const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting chunk error fix script...');

// 1. Clean the .next directory
console.log('🧹 Cleaning Next.js cache...');
try {
  // Try to remove the .next directory
  const nextDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextDir)) {
    console.log('   Removing .next directory...');
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('   ✅ .next directory removed successfully');
  } else {
    console.log('   ⚠️ .next directory does not exist, skipping');
  }
} catch (error) {
  console.error(`   ❌ Error cleaning .next directory: ${error.message}`);
}

// 2. Create a chunk retry handler script
console.log('📝 Creating chunk retry handler...');
const chunkRetryScript = `
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
`;

// Write the script to a file
const scriptPath = path.join(__dirname, 'public', 'chunk-retry.js');
try {
  // Make sure the public directory exists
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(scriptPath, chunkRetryScript);
  console.log(`   ✅ Chunk retry handler written to ${scriptPath}`);
} catch (error) {
  console.error(`   ❌ Error creating chunk retry handler: ${error.message}`);
}

// 3. Add script to _document.tsx or create it if it doesn't exist
console.log('📄 Updating _document.tsx to include chunk retry handler...');
const documentPath = path.join(__dirname, 'app', '_document.tsx');
const documentExists = fs.existsSync(documentPath);

if (documentExists) {
  try {
    let documentContent = fs.readFileSync(documentPath, 'utf8');
    
    // Check if the script is already included
    if (!documentContent.includes('chunk-retry.js')) {
      // Find the Head closing tag and insert our script before it
      documentContent = documentContent.replace(
        '</Head>',
        '        <script src="/chunk-retry.js"></script>\n      </Head>'
      );
      
      fs.writeFileSync(documentPath, documentContent);
      console.log('   ✅ Script added to _document.tsx');
    } else {
      console.log('   ⚠️ Script already exists in _document.tsx');
    }
  } catch (error) {
    console.error(`   ❌ Error updating _document.tsx: ${error.message}`);
  }
} else {
  try {
    // Create a new _document.tsx file
    const newDocumentContent = `import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="/chunk-retry.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
`;
    
    fs.writeFileSync(documentPath, newDocumentContent);
    console.log('   ✅ Created new _document.tsx with chunk retry script');
  } catch (error) {
    console.error(`   ❌ Error creating _document.tsx: ${error.message}`);
  }
}

// 4. Instructions for the user
console.log('\n🚀 Fix completed! Please follow these steps:');
console.log('   1. Clear your browser cache or use incognito mode');
console.log('   2. Run "npm run dev" to start the development server');
console.log('   3. Try accessing the relaxation page again\n'); 