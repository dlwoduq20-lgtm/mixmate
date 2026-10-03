// Generates Korean recipe-step sentences for a cocktail from its structured
// data (method/glass/garnish/ingredients), mirroring the English
// `instructions` array's logic and content 1:1 — instead of storing a
// second, hand-translated copy of 137 recipes, we regenerate the same
// steps in Korean from the same underlying data the English text was
// generated from.
import type { Cocktail, RecipeIngredient } from '../types'
import type { useLocalize } from '../i18n/localize'
import { eulReul, euroRo } from '../i18n/hangul'
import { formatAmountKo } from './format'
import { splitToppings } from './toppingIngredients'

type Localize = ReturnType<typeof useLocalize>

function joinIngredientsKo(list: RecipeIngredient[], localize: Localize): string {
  return list
    .map((ing) => `${formatAmountKo(ing.amount, localize.unit(ing.unit))} ${localize.ingredientName(ing.ingredientId, ing.name)}`)
    .join(', ')
}

export function buildKoreanInstructions(cocktail: Cocktail, localize: Localize): string[] {
  const { method, garnish } = cocktail
  const glassKo = localize.glass(cocktail.glass)
  const garnishKo = localize.garnish(garnish)
  const steps: string[] = []

  const hasRim = garnish === 'Salt Rim' || garnish === 'Sugar Rim' || garnish.includes('Rim')
  if (hasRim) {
    const rimKo = garnish.includes('Salt') ? '소금' : '설탕'
    steps.push(`${glassKo} 테두리에 ${eulReul(rimKo)} 묻힙니다.`)
  }

  // Build-method drinks pour every required ingredient directly into the
  // glass in one motion. For Shake/Stir/Blend, a carbonated mixer or wine
  // float (see toppingIngredients.ts) never goes in with the rest — it's
  // always poured on top after straining, regardless of method.
  const { main: mainIngredients, toppings: requiredToppings } =
    method === 'Build' ? { main: cocktail.ingredients, toppings: [] as RecipeIngredient[] } : splitToppings(cocktail.ingredients)
  const list = joinIngredientsKo(mainIngredients, localize)
  const toppingItems = [...requiredToppings, ...cocktail.optionalIngredients]

  if (method === 'Build') {
    steps.push(`${glassKo}에 얼음을 채웁니다.`)
    steps.push(`${eulReul(list)} 잔에 그대로 넣습니다.`)
    if (toppingItems.length > 0) {
      const topList = joinIngredientsKo(toppingItems, localize)
      steps.push(`${euroRo(topList)} 채웁니다.`)
    }
    steps.push('가볍게 저어 섞습니다.')
  } else if (method === 'Stir') {
    steps.push(`믹싱글라스에 얼음과 함께 ${eulReul(list)} 넣습니다.`)
    steps.push('충분히 차가워질 때까지 20~30초간 저어줍니다.')
    steps.push(`차갑게 식힌 ${glassKo}에 걸러 따릅니다.`)
    if (toppingItems.length > 0) {
      const topList = joinIngredientsKo(toppingItems, localize)
      steps.push(`${euroRo(topList)} 채웁니다.`)
    }
  } else if (method === 'Shake') {
    const hasMuddle = cocktail.ingredients.some((i) => i.name === 'Mint' || i.name === 'Basil')
    if (hasMuddle) steps.push('셰이커에 민트(또는 바질)를 넣고 가볍게 으깹니다.')
    steps.push(`셰이커에 얼음과 함께 ${eulReul(list)} 넣습니다.`)
    steps.push('10~15초간 강하게 흔들어 충분히 차갑게 만듭니다.')
    const isDoubleStrain = cocktail.ingredients.some((i) => i.name === 'Egg White')
    steps.push(isDoubleStrain ? `차갑게 식힌 ${glassKo}에 두 번 걸러 따릅니다.` : `차갑게 식힌 ${glassKo}에 걸러 따릅니다.`)
    if (toppingItems.length > 0) {
      const topList = joinIngredientsKo(toppingItems, localize)
      steps.push(`${euroRo(topList)} 채웁니다.`)
    }
  } else if (method === 'Blend') {
    steps.push(`블렌더에 얼음 1컵과 ${eulReul(list)} 넣습니다.`)
    steps.push('부드럽고 슬러시 같은 질감이 될 때까지 갈아줍니다.')
    steps.push(`${glassKo}에 따릅니다.`)
    if (toppingItems.length > 0) {
      const topList = joinIngredientsKo(toppingItems, localize)
      steps.push(`${euroRo(topList)} 채웁니다.`)
    }
  }

  if (garnish && garnish !== 'None' && !garnish.includes('Rim')) {
    steps.push(`${euroRo(garnishKo)} 장식합니다.`)
  }

  return steps
}
