// dev-clean.js
const { spawn } = require('child_process');
const { existsSync, rmSync } = require('fs');
const path = require('path');

console.log('🧹 Cleaning Next.js cache before starting development server...');

// Path to .next directory
const nextDir = path.join(__dirname, '.next');

// Clean with error handling
if (existsSync(nextDir)) {
  try {
    // Try using fs.rmSync which is more reliable than rimraf
    rmSync(nextDir, { recursive: true, force: true });
    console.log('✅ Clean completed');
  } catch (err) {
    console.warn(`⚠️ Warning: Could not completely clean .next directory: ${err.message}`);
    console.log('🔄 Continuing with development server startup anyway...');
    
    // Try to at least clear the cache directory which often causes problems
    try {
      const cacheDir = path.join(nextDir, 'cache');
      if (existsSync(cacheDir)) {
        rmSync(cacheDir, { recursive: true, force: true });
        console.log('✅ Cleared Next.js cache directory');
      }
    } catch (cacheErr) {
      console.warn(`⚠️ Could not clear cache directory: ${cacheErr.message}`);
    }
  }
} else {
  console.log('ℹ️ No .next directory found, starting with clean slate');
}

// Start development server
console.log('🚀 Starting Next.js development server...');

// Use direct path to next binary to avoid recursion when using npm run dev
const nextBinPath = path.join(__dirname, 'node_modules', '.bin', 'next');

const dev = spawn(nextBinPath, ['dev'], { 
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1'
  }
});

dev.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Development server exited with code ${code}`);
    process.exit(code);
  }
}); 