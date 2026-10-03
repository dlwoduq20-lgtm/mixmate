// Maps a cocktail id -> its real photo, when one has been dropped into
// src/assets/cocktails/<id>.(jpg|jpeg|png|webp). Uses Vite's import.meta.glob
// so photos are bundled as real asset files in a normal build (fast,
// cacheable, lazy-loadable) and automatically inlined as data: URIs by
// vite-plugin-singlefile in the single-file build used for the Claude
// Artifact / standalone mixmate.html. No manual registration needed —
// just add a correctly-named file and rebuild.
const modules = import.meta.glob('../assets/cocktails/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const COCKTAIL_IMAGE_MAP: Record<string, string> = {}
for (const path in modules) {
  const filename = path.split('/').pop() ?? ''
  const id = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  COCKTAIL_IMAGE_MAP[id] = modules[path]
}

export function getCocktailImage(id: string): string | undefined {
  return COCKTAIL_IMAGE_MAP[id]
}
