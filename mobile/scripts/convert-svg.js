// To convert SVG to PNG using sharp (more reliable than canvas)
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');

async function convertSVGtoPNG(name, width, height) {
  const svgPath = join(assetsDir, name + '.svg');
  const pngPath = join(assetsDir, name + '.png');
  
  await sharp(svgPath)
    .resize(width, height)
    .png()
    .toFile(pngPath);
  
  console.log(`✓ Converted ${name}.png (${width}x${height})`);
}

console.log('Converting SVG assets to PNG...\n');

await convertSVGtoPNG('icon', 1024, 1024);
await convertSVGtoPNG('adaptive-icon', 1024, 1024);
await convertSVGtoPNG('splash', 1284, 2778);
await convertSVGtoPNG('favicon', 48, 48);

console.log('\n✨ All assets converted!');