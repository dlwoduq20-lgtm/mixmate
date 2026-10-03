import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), tailwindcss(), ...(mode === 'singlefile' ? [viteSingleFile()] : [])],
  build: {
    // Single-file mode inlines everything into one HTML document (used for
    // the Artifact-hosted build); the default mode keeps normal asset
    // splitting for the downloadable source/dist.
  },
}))
