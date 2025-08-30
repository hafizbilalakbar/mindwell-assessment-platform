const fs = require('fs');
const path = require('path');

// Read the CSS file
const cssFilePath = path.join(__dirname, 'app', 'globals.css');
let cssContent = fs.readFileSync(cssFilePath, 'utf8');

// Fix the unclosed block
cssContent = cssContent.replace(
  /\.stats-card::after\s*\{\s*content:\s*'';\s*position:\s*absolute;\s*width:\s*100%;\s*height:\s*100%;\s*clip-path:\s*polygon\(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%\);\s*\n\s*/g,
  '.stats-card::after {\n  content: \'\';\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  clip-path: polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%);\n}\n\n'
);

// Remove odometer styling
const odometerPattern = /\/\* Fix linter errors in odometer section by removing IE hacks \*\/[\s\S]*?\.odometer\.odometer-auto-theme[\s\S]*?\.odometer\.odometer-theme-default[\s\S]*?text-align: center;\s*\}/g;
cssContent = cssContent.replace(odometerPattern, '');

// Remove other odometer styling blocks
const odometerBlockPattern = /\.odometer\.odometer-auto-theme[\s\S]*?\.odometer\.odometer-theme-default[\s\S]*?text-align: center;\s*\}/g;
while (odometerBlockPattern.test(cssContent)) {
  cssContent = cssContent.replace(odometerBlockPattern, '');
}

// Write the fixed content back to the file
fs.writeFileSync(cssFilePath, cssContent);

console.log('CSS file has been fixed!'); 