/**
 * Scans public/ARTWORK/<folder>/ for numbered images (1.png, 2.jpg, …).
 * Folder name syntax: "<order> <title words...> <CATEGORY_WITH_UNDERSCORES>"
 * Example: "1 FLOW CHARACTER_DESIGN"
 *
 * Writes public/artwork-manifest.json (URLs are path segments URL-encoded).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ARTWORK_ROOT = path.join(ROOT, 'public', 'artwork');
const OUT_FILE = path.join(ROOT, 'public', 'artwork-manifest.json');

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

function fileRelPath(folderName, fileName) {
  return `artwork/${folderName}/${fileName}`;
}

function parseFolderName(folderName) {
  const trimmed = folderName.trim().replace(/\s+/g, ' ');
  const parts = trimmed.split(' ');
  if (parts.length < 3) {
    console.warn(`[scan-artwork] Skip folder (need ≥3 tokens): "${folderName}"`);
    return null;
  }
  const order = parseInt(parts[0], 10);
  if (Number.isNaN(order)) {
    console.warn(`[scan-artwork] Skip folder (first token not int): "${folderName}"`);
    return null;
  }
  const category = parts[parts.length - 1];
  const title = parts.slice(1, -1).join(' ');
  if (!title) {
    console.warn(`[scan-artwork] Skip folder (empty title): "${folderName}"`);
    return null;
  }
  return { order, title, category, folderName };
}

function listNumberedImages(dirPath) {
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }
  const imagesByNum = {};
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    
    let m;
    let num, variant;
    
    // Match patterns like "1.jpg", "1-thumb.jpg", "1-web.jpg", "1-hd.jpg"
    if ((m = e.name.match(/^(\d+)-(thumb|web|hd)\.(?:jpe?g|png|webp|gif|avif)$/i))) {
      num = parseInt(m[1], 10);
      variant = m[2].toLowerCase();
    } else if ((m = e.name.match(/^(\d+)\.(?:jpe?g|png|webp|gif|avif)$/i))) {
      num = parseInt(m[1], 10);
      variant = 'original';
    } else {
      continue;
    }
    
    if (!imagesByNum[num]) {
      imagesByNum[num] = { original: null, thumb: null, web: null, hd: null };
    }
    imagesByNum[num][variant] = e.name;
  }
  
  const out = [];
  const nums = Object.keys(imagesByNum).map(Number).sort((a, b) => a - b);
  for (const num of nums) {
    out.push(imagesByNum[num]);
  }
  return out;
}

function scan() {
  if (!fs.existsSync(ARTWORK_ROOT)) {
    fs.mkdirSync(ARTWORK_ROOT, { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify([], null, 2), 'utf8');
    console.log('[scan-artwork] Created public/ARTWORK and empty artwork-manifest.json');
    return [];
  }

  const dirs = fs
    .readdirSync(ARTWORK_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const rows = [];

  for (const folderName of dirs) {
    const parsed = parseFolderName(folderName);
    if (!parsed) continue;
    const abs = path.join(ARTWORK_ROOT, folderName);
    const files = listNumberedImages(abs);
    if (!files || files.length === 0) {
      console.warn(`[scan-artwork] Skip "${folderName}" — no images found`);
      continue;
    }
    const main = files[0];
    if (!main || !main.original) {
      console.warn(`[scan-artwork] Skip "${folderName}" — no file named 1.* (main image)`);
      continue;
    }
    const extras = files.slice(1);

    rows.push({
      id: `ART-${String(parsed.order).padStart(3, '0')}`,
      folder: folderName,
      order: parsed.order,
      title: parsed.title,
      category: parsed.category.replace(/_/g, ' '),
      year: '',
      medium: 'Digital',
      tags: [],
      tools: [],
      description: '',
      commissionStatus: 'OPEN',
      image: fileRelPath(folderName, main.original),
      imageThumb: fileRelPath(folderName, main.thumb || main.original),
      imageWeb: fileRelPath(folderName, main.web || main.original),
      imageHd: fileRelPath(folderName, main.hd || main.original),
      imageSecondary: extras[0]?.original ? fileRelPath(folderName, extras[0].original) : '',
      extraImages: extras.map((f) => ({
        original: fileRelPath(folderName, f.original),
        thumb: f.thumb ? fileRelPath(folderName, f.thumb) : fileRelPath(folderName, f.original),
        web: f.web ? fileRelPath(folderName, f.web) : fileRelPath(folderName, f.original),
        hd: f.hd ? fileRelPath(folderName, f.hd) : fileRelPath(folderName, f.original)
      }))
    });
  }

  rows.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  fs.writeFileSync(OUT_FILE, JSON.stringify(rows, null, 2), 'utf8');
  console.log(`[scan-artwork] Wrote ${rows.length} entries → public/artwork-manifest.json`);
  return rows;
}

scan();
