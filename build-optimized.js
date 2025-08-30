// build-optimized.js
const { spawn } = require('child_process');
const { existsSync, mkdirSync, rmSync } = require('fs');
const path = require('path');

console.log('🚀 Starting optimized build process...');

// Ensure the .next directory exists
const nextDir = path.join(__dirname, '.next');
if (!existsSync(nextDir)) {
  mkdirSync(nextDir, { recursive: true });
}

// Clean previous build with error handling
console.log('🧹 Cleaning previous build...');
try {
  // Try using fs.rmSync which is more reliable than rimraf
  rmSync(nextDir, { recursive: true, force: true });
  console.log('✅ Clean completed');
} catch (err) {
  console.warn(`⚠️ Warning: Could not completely clean .next directory: ${err.message}`);
  console.log('🔄 Continuing with build process anyway...');
}

// Run the Next.js build with a clean environment
console.log('🔨 Building production bundle...');
const build = spawn('npx', ['next', 'build'], { 
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    NEXT_TELEMETRY_DISABLED: '1'
  }
});

build.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Build failed');
    process.exit(code);
  }
  
  console.log('✅ Build completed successfully!');
}); 