import { publicAsset } from './publicAsset';

/** Resolve static paths for current Vite base (GitHub Pages, etc.). */
export function resolveAssetPath(p) {
  if (!p) return '';
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  const clean = String(p).replace(/^\/+/, '');
  return publicAsset(clean);
}

export function hydrateArtwork(art) {
  const resolveImages = (imgs) => {
    if (!imgs) return [];
    if (Array.isArray(imgs)) {
      return imgs.map((img) => {
        if (typeof img === 'string') return resolveAssetPath(img);
        return {
          original: resolveAssetPath(img.original),
          thumb: resolveAssetPath(img.thumb),
          web: resolveAssetPath(img.web),
          hd: resolveAssetPath(img.hd)
        };
      });
    }
    return [];
  };

  return {
    ...art,
    image: resolveAssetPath(art.image),
    imageThumb: resolveAssetPath(art.imageThumb || art.image),
    imageWeb: resolveAssetPath(art.imageWeb || art.image),
    imageHd: resolveAssetPath(art.imageHd || art.image),
    imageSecondary: resolveAssetPath(art.imageSecondary),
    extraImages: resolveImages(art.extraImages)
  };
}
