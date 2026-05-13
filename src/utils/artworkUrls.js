import { publicAsset } from './publicAsset';

/** Resolve static paths for current Vite base (GitHub Pages, etc.). */
export function resolveAssetPath(p) {
  if (!p) return '';
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  const clean = String(p).replace(/^\/+/, '');
  return publicAsset(clean);
}

export function hydrateArtwork(art) {
  return {
    ...art,
    image: resolveAssetPath(art.image),
    imageSecondary: resolveAssetPath(art.imageSecondary),
    extraImages: Array.isArray(art.extraImages) ? art.extraImages.map(resolveAssetPath) : []
  };
}
