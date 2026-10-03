// Ingredient substitution tips, with an opt-in role in matching.
//
// This data is read in two places:
//   - CocktailDetail always uses it to suggest an owned stand-in for a
//     missing ingredient, with a short note on how the flavor differs —
//     purely informational, regardless of the setting below.
//   - src/lib/matching.ts reads it too, but only when a caller passes
//     `useSubstitutes: true` (wired to the "대체 재료로 매칭" toggle in
//     My Bar / useAppStore's `useSubstitutesInMatching`). When that's on,
//     an owned stand-in counts toward a cocktail's "makeable" / READY
//     status instead of leaving the ingredient "missing" — the swap is
//     reported back via `CocktailMatch.substitutedIngredients` so the UI
//     can always show which ingredient is standing in for which, rather
//     than silently treating them as identical. With the toggle off
//     (or for any caller that omits the option), matching behaves exactly
//     as before: substitutes are inspiration only, never counted.
//
// Each key is a required ingredient id (as used in cocktails.ts /
// ingredients.ts). Its value lists other ingredient ids that make a
// reasonable flavor-similar stand-in, ordered from closest to furthest,
// together with a short note (Korean and English) on the difference.
// Lists are intentionally not perfectly symmetric — e.g. Scotch suggests
// Irish whiskey as a mellower option, but Irish whiskey doesn't suggest
// Scotch, since trading up to a smokier spirit changes the drink more than
// the reverse swap does.

export interface SubstitutionEntry {
  ingredientId: string
  noteKo: string
  note: string
}

export const SUBSTITUTIONS: Record<string, SubstitutionEntry[]> = {
  // Whiskey family
  bourbon: [
    { ingredientId: 'rye-whiskey', noteKo: '조금 더 스파이시하고 드라이한 맛이에요', note: 'A bit spicier and drier' },
    { ingredientId: 'blended-whiskey', noteKo: '무난하게 비슷한 맛을 낼 수 있어요', note: 'An easy, similar-tasting stand-in' },
    { ingredientId: 'irish-whiskey', noteKo: '더 부드럽고 순한 맛이 나요', note: 'Smoother and milder' },
  ],
  'rye-whiskey': [
    { ingredientId: 'bourbon', noteKo: '조금 더 달콤하고 부드러운 맛이에요', note: 'A bit sweeter and smoother' },
    { ingredientId: 'blended-whiskey', noteKo: '무난하게 비슷한 맛을 낼 수 있어요', note: 'An easy, similar-tasting stand-in' },
  ],
  'irish-whiskey': [
    { ingredientId: 'blended-whiskey', noteKo: '비슷하게 부드러운 맛이에요', note: 'Similarly smooth' },
    { ingredientId: 'bourbon', noteKo: '조금 더 달콤하고 묵직해져요', note: 'A bit sweeter and fuller-bodied' },
  ],
  'scotch-whisky': [
    { ingredientId: 'blended-whiskey', noteKo: '스모키함은 줄지만 무난하게 즐길 수 있어요', note: 'Less smoky, but an easy, enjoyable swap' },
    { ingredientId: 'irish-whiskey', noteKo: '스모키함 대신 더 부드러운 맛이 나요', note: 'Smoother in place of the smoke' },
  ],
  'blended-whiskey': [
    { ingredientId: 'bourbon', noteKo: '조금 더 달콤하고 진한 맛이에요', note: 'A bit sweeter and richer' },
    { ingredientId: 'irish-whiskey', noteKo: '비슷하게 부드러운 맛이에요', note: 'Similarly smooth' },
  ],

  // Gin family
  gin: [
    { ingredientId: 'old-tom-gin', noteKo: '조금 더 달콤한 맛이에요', note: 'A bit sweeter' },
    { ingredientId: 'navy-strength-gin', noteKo: '향은 비슷하고 도수만 더 세져요', note: 'Same character, just higher-proof' },
  ],
  'old-tom-gin': [
    { ingredientId: 'gin', noteKo: '조금 더 드라이하고 산뜻한 맛이에요', note: 'Drier and crisper' },
  ],
  'navy-strength-gin': [
    { ingredientId: 'gin', noteKo: '향은 비슷하고 도수만 약해져요', note: 'Same character, just lower-proof' },
  ],

  // Rum family
  'white-rum': [
    { ingredientId: 'spiced-rum', noteKo: '향신료 향이 더해져요', note: 'Adds warm spice notes' },
    { ingredientId: 'dark-rum', noteKo: '더 진하고 묵직한 단맛이에요', note: 'Deeper, richer sweetness' },
  ],
  'dark-rum': [
    { ingredientId: 'spiced-rum', noteKo: '비슷하게 진한 향이에요', note: 'Similarly rich aromatics' },
    { ingredientId: 'white-rum', noteKo: '더 가볍고 산뜻한 맛이에요', note: 'Lighter and crisper' },
  ],
  'spiced-rum': [
    { ingredientId: 'dark-rum', noteKo: '향신료 향은 줄지만 비슷하게 진해요', note: 'Less spice, but similarly rich' },
    { ingredientId: 'white-rum', noteKo: '더 가벼운 맛이에요', note: 'Lighter overall' },
  ],
  'overproof-rum': [
    { ingredientId: 'white-rum', noteKo: '향은 비슷하고 도수만 약해져요', note: 'Same character, just lower-proof' },
    { ingredientId: 'dark-rum', noteKo: '더 진한 향으로 즐길 수 있어요', note: 'A richer, more intense pour' },
  ],

  // Tequila / Mezcal
  'tequila-blanco': [
    { ingredientId: 'tequila-reposado', noteKo: '오크 향이 살짝 더해져요', note: 'Adds a touch of oak' },
    { ingredientId: 'mezcal', noteKo: '스모키한 향이 더해져요', note: 'Adds smoky character' },
  ],
  'tequila-reposado': [
    { ingredientId: 'tequila-blanco', noteKo: '더 산뜻하고 가벼운 맛이에요', note: 'Crisper and lighter' },
  ],
  mezcal: [
    { ingredientId: 'tequila-blanco', noteKo: '스모키함은 줄지만 무난하게 즐길 수 있어요', note: 'Less smoky, but an easy, enjoyable swap' },
  ],

  // Brandy / Cognac
  brandy: [
    { ingredientId: 'cognac', noteKo: '거의 같은 맛이에요', note: 'Nearly identical in flavor' },
    { ingredientId: 'apple-brandy', noteKo: '사과 향이 더해져요', note: 'Adds an apple note' },
  ],
  cognac: [
    { ingredientId: 'brandy', noteKo: '거의 같은 맛이에요', note: 'Nearly identical in flavor' },
  ],
  'apple-brandy': [
    { ingredientId: 'brandy', noteKo: '사과 향은 줄지만 비슷한 느낌이에요', note: 'Less apple, but a similar feel' },
  ],
  pisco: [
    { ingredientId: 'brandy', noteKo: '포도 베이스로 비슷한 느낌이에요', note: 'Another grape-based spirit with a similar feel' },
  ],

  // Citrus juices
  'lime-juice': [
    { ingredientId: 'lemon-juice', noteKo: '산미는 비슷하고 향이 조금 더 부드러워요', note: 'Similar tartness, a slightly softer aroma' },
  ],
  'lemon-juice': [
    { ingredientId: 'lime-juice', noteKo: '산미는 비슷하고 향이 조금 더 산뜻해요', note: 'Similar tartness, a slightly brighter aroma' },
  ],

  // Citrus fruit (garnish / muddle)
  lime: [
    { ingredientId: 'lemon', noteKo: '산미는 비슷하고 향이 조금 더 부드러워요', note: 'Similar tartness, a slightly softer aroma' },
  ],
  lemon: [
    { ingredientId: 'lime', noteKo: '산미는 비슷하고 향이 조금 더 산뜻해요', note: 'Similar tartness, a slightly brighter aroma' },
  ],

  // Orange liqueurs
  'triple-sec': [
    { ingredientId: 'cointreau', noteKo: '더 고급스럽고 부드러운 맛이에요', note: 'A more refined, smoother pour' },
    { ingredientId: 'blue-cura-ao', noteKo: '맛은 비슷하고 색만 파랗게 달라져요', note: 'Same flavor, just blue' },
  ],
  cointreau: [
    { ingredientId: 'triple-sec', noteKo: '조금 더 가벼운 대체품이에요', note: 'A lighter, everyday substitute' },
  ],
  'blue-cura-ao': [
    { ingredientId: 'triple-sec', noteKo: '맛은 비슷하고 파란색은 사라져요', note: 'Same flavor, minus the blue color' },
  ],

  // Vermouth
  'dry-vermouth': [
    { ingredientId: 'blanc-vermouth', noteKo: '조금 더 달콤한 맛이에요', note: 'A bit sweeter' },
  ],
  'sweet-vermouth': [
    { ingredientId: 'blanc-vermouth', noteKo: '단맛이 조금 덜해져요', note: 'A touch less sweet' },
  ],
  'blanc-vermouth': [
    { ingredientId: 'dry-vermouth', noteKo: '단맛이 줄고 더 드라이해져요', note: 'Less sweet and drier' },
    { ingredientId: 'sweet-vermouth', noteKo: '단맛이 더해져요', note: 'Adds more sweetness' },
  ],

  // Campari / Aperol
  campari: [
    { ingredientId: 'aperol', noteKo: '쓴맛이 줄고 더 가벼워져요', note: 'Less bitter and lighter' },
  ],
  aperol: [
    { ingredientId: 'campari', noteKo: '쓴맛이 더 진해져요', note: 'More intensely bitter' },
  ],

  // Syrups & sweeteners
  'simple-syrup': [
    { ingredientId: 'agave-syrup', noteKo: '비슷한 단맛에 향이 조금 달라요', note: 'Similar sweetness with a slightly different note' },
    { ingredientId: 'honey-syrup', noteKo: '은은한 꿀 향이 더해져요', note: 'Adds a gentle honey note' },
  ],
  'agave-syrup': [
    { ingredientId: 'simple-syrup', noteKo: '향은 사라지고 단맛만 비슷해요', note: 'Loses the aroma, keeps a similar sweetness' },
  ],
  'honey-syrup': [
    { ingredientId: 'simple-syrup', noteKo: '꿀 향은 사라지고 단맛만 비슷해요', note: 'Loses the honey note, keeps a similar sweetness' },
    { ingredientId: 'agave-syrup', noteKo: '비슷한 단맛이에요', note: 'Similar sweetness' },
  ],
  'demerara-syrup': [
    { ingredientId: 'simple-syrup', noteKo: '카라멜 풍미는 줄고 단맛만 비슷해요', note: 'Less caramel depth, similar sweetness' },
  ],
  'maple-syrup': [
    { ingredientId: 'honey-syrup', noteKo: '비슷하게 은은한 단맛이에요', note: 'Similarly gentle sweetness' },
    { ingredientId: 'simple-syrup', noteKo: '풍미는 사라지고 단맛만 비슷해요', note: 'Loses the flavor, keeps a similar sweetness' },
  ],
  'vanilla-syrup': [
    { ingredientId: 'simple-syrup', noteKo: '바닐라 향은 사라지고 단맛만 비슷해요', note: 'Loses the vanilla note, keeps a similar sweetness' },
  ],

  // Cream / dairy
  'heavy-cream': [
    { ingredientId: 'milk', noteKo: '더 가벼운 질감이에요', note: 'A lighter texture' },
    { ingredientId: 'coconut-cream', noteKo: '코코넛 향이 더해져요', note: 'Adds a coconut note' },
  ],
  milk: [
    { ingredientId: 'heavy-cream', noteKo: '더 진하고 묵직한 질감이에요', note: 'A richer, heavier texture' },
  ],
  'coconut-cream': [
    { ingredientId: 'heavy-cream', noteKo: '코코넛 향은 사라지고 질감만 비슷해요', note: 'Loses the coconut note, keeps a similar texture' },
  ],

  // Carbonated mixers
  'soda-water': [
    { ingredientId: 'tonic-water', noteKo: '은은한 단맛과 쌉쌀함이 더해져요', note: 'Adds a gentle sweetness and bitterness' },
  ],
  'tonic-water': [
    { ingredientId: 'soda-water', noteKo: '쌉쌀한 맛이 사라지고 산뜻해져요', note: 'Loses the bitterness for a cleaner finish' },
  ],
  'ginger-beer': [
    { ingredientId: 'ginger-ale', noteKo: '생강의 매콤함과 탄산감이 조금 약해져요', note: 'A bit milder ginger heat and fizz' },
  ],
  'ginger-ale': [
    { ingredientId: 'ginger-beer', noteKo: '생강 향이 더 강해지고 탄산감이 세져요', note: 'Bolder ginger and a stronger fizz' },
  ],
  champagne: [
    { ingredientId: 'prosecco', noteKo: '조금 더 과일 향이 나는 맛이에요', note: 'A slightly fruitier pour' },
  ],
  prosecco: [
    { ingredientId: 'champagne', noteKo: '더 드라이한 맛이에요', note: 'A drier pour' },
  ],

  // Bitters
  'orange-bitters': [
    { ingredientId: 'angostura-bitters', noteKo: '시트러스 향 대신 스파이스 향이 더해져요', note: 'Trades the citrus note for warm spice' },
  ],
  'peychauds-bitters': [
    { ingredientId: 'angostura-bitters', noteKo: '색과 향이 조금 더 진해져요', note: 'A bit deeper in color and aroma' },
  ],
  'angostura-bitters': [
    { ingredientId: 'orange-bitters', noteKo: '스파이스 향 대신 시트러스 향이 더해져요', note: 'Trades the warm spice for a citrus note' },
  ],

  // Muddled herbs
  mint: [
    { ingredientId: 'basil', noteKo: '시원한 향 대신 은은한 허브 향이 나요', note: 'A gentle herbal note in place of the cool freshness' },
  ],
  basil: [
    { ingredientId: 'mint', noteKo: '은은한 허브 향 대신 시원한 향이 나요', note: 'A cool freshness in place of the gentle herbal note' },
  ],
}

export function getSubstitutes(ingredientId: string): SubstitutionEntry[] {
  return SUBSTITUTIONS[ingredientId] ?? []
}
