/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error("Please install sharp: npm install sharp --save-dev");
  process.exit(1);
}

const dir = path.join(__dirname, '../public/images/capabilities');

async function processImages() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));
  
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(dir, file.replace('.jpg', '.webp'));
    
    console.log(`Processing ${file}...`);
    
    await sharp(inputPath)
      .resize(1600, null, { withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(outputPath);
      
    console.log(`Created ${file.replace('.jpg', '.webp')}`);
  }
}

processImages().catch(console.error);
