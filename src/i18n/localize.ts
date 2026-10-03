import { useTranslation } from 'react-i18next'
import { INGREDIENT_NAMES_KO, INGREDIENT_CATEGORY_NAMES_KO } from './ingredientNames.ko'
import {
  CATEGORY_NAMES_KO,
  BASE_SPIRIT_NAMES_KO,
  DIFFICULTY_NAMES_KO,
  METHOD_NAMES_KO,
  GLASS_NAMES_KO,
  GARNISH_NAMES_KO,
} from './cocktailEnums.ko'
import { UNIT_NAMES_KO } from './units.ko'
import { FOOD_PAIRING_NAMES_KO } from './foodPairings.ko'
import { COCKTAIL_NAMES_KO } from './cocktailNames.ko'

// Localizes the fixed vocabularies used across cocktail data (ingredient
// names, categories, units, glass/method/garnish, food pairings) so the
// whole app UI reads naturally in Korean. Recipe step sentences themselves
// are generated locale-aware from the structured data (see
// lib/koInstructions.ts and lib/mixingSteps.ts) rather than stored as
// pre-written text. Falls back to the original English string whenever a
// translation is missing, so nothing ever renders blank.
export function useLocalize() {
  const { i18n } = useTranslation()
  const isKo = i18n.language === 'ko'

  return {
    isKo,
    cocktailName: (id: string, fallback: string) => (isKo ? (COCKTAIL_NAMES_KO[id] ?? fallback) : fallback),
    ingredientName: (id: string, fallback: string) => (isKo ? (INGREDIENT_NAMES_KO[id] ?? fallback) : fallback),
    ingredientCategory: (name: string) => (isKo ? (INGREDIENT_CATEGORY_NAMES_KO[name] ?? name) : name),
    cocktailCategory: (name: string) => (isKo ? (CATEGORY_NAMES_KO[name] ?? name) : name),
    baseSpirit: (name: string) => (isKo ? (BASE_SPIRIT_NAMES_KO[name] ?? name) : name),
    difficulty: (name: string) => (isKo ? (DIFFICULTY_NAMES_KO[name] ?? name) : name),
    method: (name: string) => (isKo ? (METHOD_NAMES_KO[name] ?? name) : name),
    glass: (name: string) => (isKo ? (GLASS_NAMES_KO[name] ?? name) : name),
    garnish: (name: string) => (isKo ? (GARNISH_NAMES_KO[name] ?? name) : name),
    unit: (name: string) => (isKo ? (UNIT_NAMES_KO[name] ?? name) : name),
    foodPairing: (name: string) => (isKo ? (FOOD_PAIRING_NAMES_KO[name] ?? name) : name),
  }
}
