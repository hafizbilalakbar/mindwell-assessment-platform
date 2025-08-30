// clean-and-start.js - A reliable script for Windows environments
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to check if a process is using a file or directory
function isLocked(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r+');
    fs.closeSync(fd);
    return false;
  } catch (err) {
    return err.code === 'EBUSY' || err.code === 'EPERM';
  }
}

// Function to wait until a process releases a file
async function waitUntilUnlocked(filePath, maxAttempts = 10) {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    if (!isLocked(filePath)) {
      return true;
    }
    
    console.log(`File ${filePath} is locked. Waiting...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    attempts++;
  }
  
  return false;
}

// Main function
async function main() {
  const nextDir = path.join(__dirname, '.next');
  
  console.log('🧹 Cleaning Next.js cache before starting development server...');
  
  // Only try to delete if it exists
  if (fs.existsSync(nextDir)) {
    try {
      // First attempt direct deletion
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log('✅ Clean completed successfully');
    } catch (err) {
      console.warn(`⚠️ Warning: Could not completely clean .next directory: ${err.message}`);
      
      // On Windows, try running rimraf via command line which sometimes works better
      try {
        console.log('🔄 Trying alternative cleaning method...');
        execSync('npx rimraf .next', { stdio: 'inherit' });
        console.log('✅ Clean completed with alternative method');
      } catch (cmdErr) {
        console.warn(`⚠️ Alternative cleaning failed: ${cmdErr.message}`);
        console.log('🔄 Continuing anyway, will try to start development server...');
      }
    }
  } else {
    console.log('ℹ️ No .next directory found, starting with clean slate');
  }
  
  // Start the development server
  console.log('🚀 Starting Next.js development server...');
  
  // Use npm command which is more reliable across environments
  const dev = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      // Add a flag to prevent recursion
      CLEAN_STARTED: '1'
    }
  });
  
  dev.on('error', (err) => {
    console.error(`❌ Failed to start development server: ${err.message}`);
    
    // Alternative - try direct Next.js binary
    console.log('🔄 Trying alternative method to start Next.js...');
    try {
      const nextBinPath = path.join(__dirname, 'node_modules', '.bin', 'next');
      
      if (fs.existsSync(nextBinPath)) {
        const altDev = spawn(nextBinPath, ['dev'], { 
          stdio: 'inherit',
          env: {
            ...process.env,
            NEXT_TELEMETRY_DISABLED: '1'
          }
        });
        
        altDev.on('error', (altErr) => {
          console.error(`❌ Alternative method also failed: ${altErr.message}`);
          process.exit(1);
        });
      } else {
        console.error('❌ Could not find Next.js binary.');
        console.log('💡 Try running: npm run dev');
        process.exit(1);
      }
    } catch (altErr) {
      console.error(`❌ Alternative method also failed: ${altErr.message}`);
      process.exit(1);
    }
  });
  
  dev.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Development server exited with code ${code}`);
      process.exit(code);
    }
  });
}

// Check for recursion
if (process.env.CLEAN_STARTED) {
  console.log('⚠️ Detected recursion in cleaning script. Running dev directly...');
  require('child_process').spawn('next', ['dev'], { 
    stdio: 'inherit',
    detached: true
  });
} else {
  // Run the main function
  main().catch(err => {
    console.error(`❌ Unexpected error: ${err.message}`);
    process.exit(1);
  });
} 