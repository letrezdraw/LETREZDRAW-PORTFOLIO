// Image optimization script for artworks
// Requires: npm install sharp

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ARTWORK_ROOT = path.join('public', 'artwork');
const SIZES = [
  { name: 'thumb', width: 1080, quality: 90 },
  { name: 'web', width: 1080, quality: 90 },
  { name: 'hd', width: null, quality: 100 }  // Full quality, no resizing
];

function isImage(file) {
  return /\.(jpe?g|png|webp|gif|avif)$/i.test(file);
}

async function optimizeImage(srcPath, destPath, width, quality) {
  let transform = sharp(srcPath);
  if (width) {
    transform = transform.resize({ width, withoutEnlargement: true });
  }
  await transform.jpeg({ quality, mozjpeg: true }).toFile(destPath);
}

async function processFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    if (!isImage(file)) continue;
    const src = path.join(folderPath, file);
    const base = file.replace(/\.(jpe?g|png|webp|gif|avif)$/i, '');
    for (const size of SIZES) {
      const outName = `${base}-${size.name}.jpg`;
      const outPath = path.join(folderPath, outName);
      // Always regenerate for better quality
      await optimizeImage(src, outPath, size.width, size.quality);
      console.log(`Created ${outPath}`);
    }
  }
}

async function main() {
  const folders = fs.readdirSync(ARTWORK_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  for (const folder of folders) {
    await processFolder(path.join(ARTWORK_ROOT, folder));
  }
}

main().catch(console.error);
