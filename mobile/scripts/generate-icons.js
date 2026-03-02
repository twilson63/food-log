#!/usr/bin/env node
/**
 * Generate placeholder app icons for FoodLog
 * Run with: node scripts/generate-icons.js
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsDir = join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!existsSync(assetsDir)) {
  mkdirSync(assetsDir, { recursive: true });
}

// Create a simple SVG icon for FoodLog
const createIconSVG = (size) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.225}" fill="url(#bg)"/>
  <!-- Plate -->
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.3}" fill="white" opacity="0.9"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.25}" fill="none" stroke="#1e40af" stroke-width="${size * 0.02}"/>
  <!-- Fork -->
  <rect x="${size * 0.35}" y="${size * 0.2}" width="${size * 0.03}" height="${size * 0.2}" fill="#1e40af" rx="${size * 0.01}"/>
  <rect x="${size * 0.32}" y="${size * 0.2}" width="${size * 0.015}" height="${size * 0.08}" fill="#1e40af" rx="${size * 0.005}"/>
  <rect x="${size * 0.363}" y="${size * 0.2}" width="${size * 0.015}" height="${size * 0.08}" fill="#1e40af" rx="${size * 0.005}"/>
  <!-- Knife -->
  <rect x="${size * 0.62}" y="${size * 0.2}" width="${size * 0.03}" height="${size * 0.2}" fill="#1e40af" rx="${size * 0.01}"/>
  <rect x="${size * 0.62}" y="${size * 0.2}" width="${size * 0.05}" height="${size * 0.08}" fill="#1e40af" rx="${size * 0.01}"/>
  <!-- Leaf/healthy indicator -->
  <ellipse cx="${size * 0.5}" cy="${size * 0.65}" rx="${size * 0.12}" ry="${size * 0.06}" fill="#22c55e"/>
</svg>`;
};

// Simple PNG placeholder using base64 (a simple colored square)
// This is a minimal 1x1 pixel PNG that will be scaled - not ideal but works as placeholder
const createPlaceholderPNG = () => {
  // Minimal blue square PNG (will be stretched but valid)
  const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  return Buffer.from(base64PNG, 'base64');
};

// Create splash SVG (centered icon with background)
const createSplashSVG = (width, height) => {
  const iconSize = Math.min(width, height) * 0.4;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <!-- White circle background for icon -->
  <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${iconSize * 0.5}" fill="white" opacity="0.95"/>
  <!-- Plate -->
  <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${iconSize * 0.35}" fill="none" stroke="#1e40af" stroke-width="${iconSize * 0.05}"/>
  <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${iconSize * 0.28}" fill="none" stroke="#3b82f6" stroke-width="${iconSize * 0.02}"/>
  <!-- Text -->
  <text x="${width * 0.5}" y="${height * 0.5}" font-family="system-ui, -apple-system, sans-serif" font-size="${iconSize * 0.35}" font-weight="bold" fill="#1e40af" text-anchor="middle" dominant-baseline="middle">FL</text>
</svg>`;
};

// Create adaptive icon foreground (for Android)
const createAdaptiveIconSVG = (size) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Centered icon with transparent background -->
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.35}" fill="white"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.28}" fill="none" stroke="#2563eb" stroke-width="${size * 0.05}"/>
  <text x="${size * 0.5}" y="${size * 0.5}" font-family="system-ui, -apple-system, sans-serif" font-size="${size * 0.25}" font-weight="bold" fill="#2563eb" text-anchor="middle" dominant-baseline="middle">FL</text>
</svg>`;
};

// Create favicon
const createFaviconSVG = (size) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#2563eb"/>
  <text x="${size * 0.5}" y="${size * 0.5}" font-family="system-ui, -apple-system, sans-serif" font-size="${size * 0.5}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">F</text>
</svg>`;
};

console.log('Generating FoodLog app assets...');

// Write SVG files (modern approach - Expo can use SVG)
const sizes = {
  icon: 1024,
  'adaptive-icon': 1024,
  splash: { width: 1284, height: 2778 },
  favicon: 48
};

// Write icon SVG
writeFileSync(join(assetsDir, 'icon.svg'), createIconSVG(sizes.icon));
console.log('✓ Created icon.svg (1024x1024)');

// Write adaptive-icon SVG
writeFileSync(join(assetsDir, 'adaptive-icon.svg'), createAdaptiveIconSVG(sizes['adaptive-icon']));
console.log('✓ Created adaptive-icon.svg (1024x1024)');

// Write splash SVG
writeFileSync(join(assetsDir, 'splash.svg'), createSplashSVG(sizes.splash.width, sizes.splash.height));
console.log('✓ Created splash.svg (1284x2778)');

// Write favicon SVG
writeFileSync(join(assetsDir, 'favicon.svg'), createFaviconSVG(sizes.favicon));
console.log('✓ Created favicon.svg (48x48)');

console.log('\n📝 Note: SVG assets created. For app stores, you may want to convert these to PNG.');
console.log('Run: npx expo export --platform all --output-dir dist');
console.log('Or use an online SVG to PNG converter for the 1024x1024 icon.');

// Create a simple Node.js script to convert SVG to PNG using canvas if available
const conversionScript = `
// To convert SVG to PNG, run:
// npm install canvas --optional
// node scripts/convert-svg.js

import { createCanvas, loadImage } from 'canvas';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');

async function convertSVGtoPNG(name, width, height = width) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const svg = readFileSync(join(assetsDir, name + '.svg'), 'utf8');
  const img = await loadImage('data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'));
  ctx.drawImage(img, 0, 0, width, height);
  const buf = canvas.toBuffer('image/png');
  writeFileSync(join(assetsDir, name + '.png'), buf);
  console.log('✓ Converted', name + '.png');
}

convertSVGtoPNG('icon', 1024);
convertSVGtoPNG('adaptive-icon', 1024);
convertSVGtoPNG('splash', 1284, 2778);
convertSVGtoPNG('favicon', 48);
`;

writeFileSync(join(assetsDir, '..', 'scripts', 'convert-svg.js'), conversionScript);
console.log('✓ Created scripts/convert-svg.js for future PNG conversion');

console.log('\n✨ Asset generation complete!');