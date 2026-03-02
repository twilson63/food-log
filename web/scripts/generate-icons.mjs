#!/usr/bin/env node
// Generate PWA icons from favicon.svg
// Requires: npm install sharp

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '../public');
const svgPath = join(publicDir, 'favicon.svg');
const iconsDir = join(publicDir, 'icons');

const svg = readFileSync(svgPath);

// Generate icons
const sizes = [192, 512];

for (const size of sizes) {
  const outputPath = join(iconsDir, `icon-${size}.png`);
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(outputPath);
  console.log(`Generated ${outputPath}`);
}

console.log('Icons generated successfully!');