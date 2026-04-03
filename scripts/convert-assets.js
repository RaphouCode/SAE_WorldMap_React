import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'public', 'assets');
const files = fs.readdirSync(assetsDir);

async function convertTifs() {
  const tifs = files.filter(f => f.toLowerCase().endsWith('.tif'));
  
  if (tifs.length === 0) {
    console.log('No .tif files found in public/assets.');
    return;
  }

  console.log(`Found ${tifs.length} TIF files. Starting conversion...`);

  for (const tif of tifs) {
    const inputPath = path.join(assetsDir, tif);
    const outputPath = path.join(assetsDir, tif.replace(/\.tif$/i, '.png'));

    try {
      console.log(`Converting ${tif} -> ${path.basename(outputPath)}...`);
      await sharp(inputPath)
        .png({ compressionLevel: 9 })
        .toFile(outputPath);
      console.log(`Successfully converted ${tif}.`);
    } catch (err) {
      console.error(`Error converting ${tif}:`, err.message);
    }
  }
  
  console.log('All conversions finished.');
}

convertTifs();
