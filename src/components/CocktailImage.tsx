import type { Cocktail } from '../types'
import CocktailGlass from './CocktailGlass'
import { getCocktailImage } from '../lib/cocktailImages'

// Drop-in replacement for <CocktailGlass /> that shows a real photo when
// one exists for this cocktail (src/assets/cocktails/<id>.*), and falls
// back to the original illustrated glass artwork otherwise. Same props,
// so every call site can swap components without other changes.
export default function CocktailImage({
  cocktail,
  displayName,
  size = 160,
  rounded = true,
  className = '',
}: {
  cocktail: Cocktail
  // Localized name for alt text / aria-label. Defaults to the English
  // cocktail.name when the caller doesn't pass one (e.g. hasn't localized).
  displayName?: string
  size?: number
  rounded?: boolean
  className?: string
}) {
  const photo = getCocktailImage(cocktail.id)
  const name = displayName ?? cocktail.name

  if (!photo) {
    return <CocktailGlass cocktail={cocktail} displayName={name} size={size} rounded={rounded} className={className} />
  }

  // Call sites either pass sizing classes (w-full + an aspect-* class) and
  // expect the image to fill its container responsively, or pass nothing
  // and expect a fixed size×size box (matching the SVG fallback's
  // width/height attributes). Only fall back to an inline pixel size when
  // the caller didn't already hand us sizing classes.
  const hasSizingClass = /\bw-|\baspect-/.test(className)

  return (
    <img
      src={photo}
      alt={name}
      loading="lazy"
      className={`${className} block object-cover ${rounded ? 'rounded-[20px]' : ''}`}
      style={hasSizingClass ? undefined : { width: size, height: size }}
    />
  )
}
