# `public/ARTWORK/` — dynamic gallery source

Each **subfolder** = one artwork. The folder name encodes **order**, **title**, and **category**:

    <ORDER> <TITLE...> <CATEGORY>

- **ORDER**: integer sort order (1, 2, 10, …)
- **TITLE**: one or more words (everything between order and category)
- **CATEGORY**: last token; use underscores if you want (shown with spaces on the site)

### Examples

| Folder name | Order | Title | Category |
|-------------|-------|-------|------------|
| `1 FLOW CHARACTER_DESIGN` | 1 | FLOW | CHARACTER DESIGN |
| `2 MY BIG SCENE ENVIRONMENT_ART` | 2 | MY BIG SCENE | ENVIRONMENT ART |

### Files inside the folder

Name files with a **leading number** and any common image extension:

| File | Role |
|------|------|
| `1.png` (or `.jpg` / `.webp` / …) | **Main** image — slider, web view, lightbox hero |
| `2.jpg`, `3.png`, … | **Extra** images — shown in the lightbox “RELATED_ASSETS” strip |

Only folders that contain **`1.*`** are included.

### Regenerate the manifest

The site reads `public/artwork-manifest.json`, built by:

    npm run scan:artwork

`vite dev` / `vite build` also run the scanner automatically.

If the manifest is **empty** or missing entries, the gallery falls back to `src/data/artworks.js` (legacy `public/artwork/` paths).

### Profile image (unchanged)

Still: `public/artwork/profile.jpg` for the About section.
