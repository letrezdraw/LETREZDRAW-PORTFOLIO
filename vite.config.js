import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function runScanArtwork() {
  try {
    const script = join(__dirname, 'scripts', 'scan-artwork.mjs')
    execSync(`node "${script}"`, { stdio: 'inherit', cwd: __dirname })
  } catch (e) {
    console.warn('[vite] scan-artwork failed:', e.message)
  }
}

function scanArtworkPlugin() {
  return {
    name: 'scan-artwork',
    buildStart() {
      runScanArtwork()
    },
    configureServer() {
      runScanArtwork()
    },
  }
}

// https://vite.dev/config/
const githubRepo = process.env.GITHUB_REPOSITORY;
const githubRepoName = githubRepo ? githubRepo.split('/')[1] : '';
const defaultBase =
  process.env.VITE_BASE ||
  (githubRepoName ? `/${githubRepoName}/` : '/');

export default defineConfig({
  base: defaultBase.replace(/\/?$/, '/').replace(/\/{2,}/g, '/'),
  plugins: [scanArtworkPlugin(), react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/postprocessing')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap', 'three', 'postprocessing'],
  },
})
