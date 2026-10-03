import type { Cocktail, RecipeIngredient } from './../types'
import { formatAmount, formatAmountKo } from './format'
import type { useLocalize } from '../i18n/localize'
import { euroRo, eulReul } from '../i18n/hangul'
import { splitToppings } from './toppingIngredients'

export interface MixingStep {
  id: string
  label: string
  detail?: string
  timerSeconds?: number
  emoji?: string
}

const METHOD_TIMER: Record<string, { verb: string; seconds: number; emoji: string }> = {
  Shake: { verb: 'Shake', seconds: 10, emoji: '🍸' },
  Stir: { verb: 'Stir', seconds: 20, emoji: '🥄' },
  Blend: { verb: 'Blend', seconds: 15, emoji: '🌀' },
  Build: { verb: 'Stir gently', seconds: 5, emoji: '🧊' },
}

const METHOD_TIMER_KO: Record<string, { verb: string; seconds: number; emoji: string }> = {
  Shake: { verb: '흔들기', seconds: 10, emoji: '🍸' },
  Stir: { verb: '젓기', seconds: 20, emoji: '🥄' },
  Blend: { verb: '갈기', seconds: 15, emoji: '🌀' },
  Build: { verb: '가볍게 젓기', seconds: 5, emoji: '🧊' },
}

type Localize = ReturnType<typeof useLocalize>

export function buildMixingSteps(cocktail: Cocktail, localize?: Localize): MixingStep[] {
  const isKo = !!localize?.isKo
  const steps: MixingStep[] = []
  const hasRim = cocktail.garnish.includes('Rim')
  const glassKo = localize ? localize.glass(cocktail.glass) : cocktail.glass

  if (hasRim) {
    const rimType = cocktail.garnish.includes('Salt') ? 'salt' : 'sugar'
    steps.push({
      id: 'rim',
      label: isKo
        ? `${glassKo} 테두리에 ${eulReul(rimType === 'salt' ? '소금' : '설탕')} 묻힙니다.`
        : `Rim the ${cocktail.glass.toLowerCase()} with ${rimType}.`,
      emoji: '🧂',
    })
  }

  if (cocktail.method === 'Build') {
    steps.push({ id: 'ice', label: isKo ? `${glassKo}에 얼음을 채웁니다.` : `Fill a ${cocktail.glass.toLowerCase()} with ice.`, emoji: '🧊' })
  } else if (cocktail.method === 'Shake' || cocktail.method === 'Stir') {
    const vesselKo = cocktail.method === 'Shake' ? '셰이커' : '믹싱글라스'
    steps.push({
      id: 'vessel-ice',
      label: isKo ? `${vesselKo}에 얼음을 채웁니다.` : `Fill a ${cocktail.method === 'Shake' ? 'shaker' : 'mixing glass'} with ice.`,
      emoji: '🧊',
    })
  } else if (cocktail.method === 'Blend') {
    steps.push({ id: 'blender-ice', label: isKo ? '블렌더에 얼음 1컵을 넣습니다.' : 'Add a cup of ice to the blender.', emoji: '🧊' })
  }

  const muddle = cocktail.ingredients.find((i) => i.name === 'Mint' || i.name === 'Basil')
  if (muddle && cocktail.method !== 'Build') {
    const muddleNameKo = localize ? localize.ingredientName(muddle.ingredientId, muddle.name) : muddle.name
    steps.push({
      id: 'muddle',
      label: isKo ? `${eulReul(muddleNameKo)} 가볍게 으깹니다.` : `Muddle the ${muddle.name.toLowerCase()} gently.`,
      emoji: '🌿',
    })
  }

  // Build-method drinks pour every required ingredient directly into the
  // glass in one motion, so there's nothing to split out. For
  // Shake/Stir/Blend, a carbonated mixer or wine float (see
  // toppingIngredients.ts) never goes in the shaker/mixing glass/blender —
  // it's always poured in afterward, on top of the strained drink.
  const { main: mainIngredients, toppings: requiredToppings } =
    cocktail.method === 'Build'
      ? { main: cocktail.ingredients, toppings: [] as RecipeIngredient[] }
      : splitToppings(cocktail.ingredients)

  for (const ing of mainIngredients) {
    const nameKo = localize ? localize.ingredientName(ing.ingredientId, ing.name) : ing.name
    const amountKo = localize ? formatAmountKo(ing.amount, localize.unit(ing.unit)) : ''
    steps.push({
      id: `add-${ing.ingredientId}`,
      label: isKo ? `${amountKo} ${nameKo} 추가` : `Add ${formatAmount(ing.amount, ing.unit)} ${ing.name}`,
      emoji: '➕',
    })
  }

  const technique = (isKo ? METHOD_TIMER_KO : METHOD_TIMER)[cocktail.method]
  if (cocktail.method === 'Shake' || cocktail.method === 'Stir' || cocktail.method === 'Blend') {
    steps.push({
      id: 'technique',
      label: isKo ? `${technique.seconds}초간 ${technique.verb}` : `${technique.verb} for ${technique.seconds} seconds`,
      timerSeconds: technique.seconds,
      emoji: technique.emoji,
    })
    steps.push({
      id: 'strain',
      label: isKo
        ? `차갑게 식힌 ${glassKo}에 ${cocktail.method === 'Blend' ? '따릅니다' : '걸러 따릅니다'}.`
        : `${cocktail.method === 'Blend' ? 'Pour' : 'Strain'} into a chilled ${cocktail.glass.toLowerCase()}.`,
      emoji: '🍹',
    })
  } else {
    steps.push({
      id: 'stir-gentle',
      label: isKo ? '가볍게 저어 섞습니다.' : 'Stir gently to combine.',
      timerSeconds: technique.seconds,
      emoji: technique.emoji,
    })
  }

  const toppingItems = [...requiredToppings, ...cocktail.optionalIngredients]
  if (toppingItems.length > 0) {
    if (isKo) {
      const namesKo = toppingItems.map((o) => (localize ? localize.ingredientName(o.ingredientId, o.name) : o.name)).join(', ')
      steps.push({ id: 'top', label: `${euroRo(namesKo)} 채웁니다.`, emoji: '🥤' })
    } else {
      const names = toppingItems.map((o) => o.name).join(', ')
      steps.push({ id: 'top', label: `Top with ${names}.`, emoji: '🥤' })
    }
  }

  if (cocktail.garnish && cocktail.garnish !== 'None' && !hasRim) {
    const garnishKo = localize ? localize.garnish(cocktail.garnish) : cocktail.garnish
    steps.push({
      id: 'garnish',
      label: isKo ? `${euroRo(garnishKo)} 장식합니다.` : `Garnish with ${cocktail.garnish.toLowerCase()}.`,
      emoji: '🌿',
    })
  }

  return steps
}
