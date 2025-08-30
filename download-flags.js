// Script to download flag SVG files for our language selector
const fs = require('fs');
const path = require('path');
const https = require('https');

// Ensure the flags directory exists
const flagsDir = path.join(__dirname, 'public', 'flags');
if (!fs.existsSync(flagsDir)) {
  fs.mkdirSync(flagsDir, { recursive: true });
}

// List of country codes to download flags for
const countries = [
  'gb', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'jp', 'cn', 'sa', 'in'
];

// Function to download a flag SVG
function downloadFlag(countryCode) {
  const url = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.svg`;
  const filePath = path.join(flagsDir, `${countryCode}.svg`);
  
  console.log(`Downloading ${url} to ${filePath}`);
  
  const file = fs.createWriteStream(filePath);
  
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download ${countryCode} flag: HTTP ${response.statusCode}`);
      fs.unlinkSync(filePath); // Remove the file if download failed
      return;
    }
    
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${countryCode} flag successfully`);
    });
  }).on('error', (err) => {
    fs.unlinkSync(filePath); // Remove the file if download failed
    console.error(`Error downloading ${countryCode} flag:`, err.message);
  });
}

// Download all flags
console.log('Starting flag downloads...');
countries.forEach(downloadFlag);
console.log('Flag download process initiated.'); 