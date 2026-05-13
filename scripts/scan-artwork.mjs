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
const ARTWORK_ROOT = path.join(ROOT, 'public', 'ARTWORK');
const OUT_FILE = path.join(ROOT, 'public', 'artwork-manifest.json');

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

function fileRelPath(folderName, fileName) {
  return `ARTWORK/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;
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
  const out = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    const m = e.name.match(/^(\d+)\./);
    if (!m) continue;
    out.push({ num: parseInt(m[1], 10), file: e.name });
  }
  out.sort((a, b) => a.num - b.num);
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
    const main = files.find((f) => f.num === 1);
    if (!main) {
      console.warn(`[scan-artwork] Skip "${folderName}" — no file named 1.* (main image)`);
      continue;
    }
    const extras = files.filter((f) => f.num >= 2);
    const baseRel = `ARTWORK/${folderName}`;
    const mainUrl = fileRelPath(folderName, main.file);
    const extraUrls = extras.map((f) => fileRelPath(folderName, f.file));

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
      image: mainUrl,
      imageSecondary: extraUrls[0] ?? '',
      extraImages: extraUrls
    });
  }

  rows.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  fs.writeFileSync(OUT_FILE, JSON.stringify(rows, null, 2), 'utf8');
  console.log(`[scan-artwork] Wrote ${rows.length} entries → public/artwork-manifest.json`);
  return rows;
}

scan();
