// Korean labels for the small fixed vocabularies used across cocktail data
// (category/baseSpirit/difficulty/method/glass/garnish). The recipes'
// names/descriptions/instructions themselves stay English for now.
export const CATEGORY_NAMES_KO: Record<string, string> = {
  Classic: '클래식',
  Gin: '진',
  Vodka: '보드카',
  Rum: '럼',
  Whiskey: '위스키',
  Tequila: '데킬라',
  Brandy: '브랜디',
  Tiki: '티키',
  Sour: '사워',
  Highball: '하이볼',
  Martini: '마티니',
  Sparkling: '스파클링',
}

export const BASE_SPIRIT_NAMES_KO: Record<string, string> = {
  Gin: '진',
  Vodka: '보드카',
  Rum: '럼',
  Whiskey: '위스키',
  Tequila: '데킬라',
  Mezcal: '메스칼',
  Brandy: '브랜디',
  Liqueur: '리큐어',
  Wine: '와인',
  Multiple: '혼합',
}

export const DIFFICULTY_NAMES_KO: Record<string, string> = {
  Easy: '쉬움',
  Medium: '보통',
  Hard: '어려움',
}

export const METHOD_NAMES_KO: Record<string, string> = {
  Build: '빌드',
  Stir: '스터',
  Shake: '셰이크',
  Blend: '블렌드',
}

export const GLASS_NAMES_KO: Record<string, string> = {
  'Clay Cup': '토기 컵',
  Collins: '콜린스 글라스',
  'Copper Mug': '코퍼 머그',
  Coupe: '쿠페 글라스',
  Flute: '플루트 글라스',
  Highball: '하이볼 글라스',
  'Hurricane Glass': '허리케인 글라스',
  'Julep Tin': '줄렙 틴',
  Martini: '마티니 글라스',
  Mug: '머그',
  Rocks: '록스 글라스',
  'Shot Glass': '샷 글라스',
  'Tiki Mug': '티키 머그',
  'Wine Glass': '와인 글라스',
}

// Garnish strings as they appear on Cocktail.garnish (free text, not an
// ingredient id) — kept as its own small glossary so it works even where
// the wording doesn't exactly match an ingredient name.
export const GARNISH_NAMES_KO: Record<string, string> = {
  None: '없음',
  'Apple Slice': '사과 슬라이스',
  Basil: '바질',
  'Celery Salt': '셀러리 소금',
  'Chocolate Drizzle': '초콜릿 드리즐',
  'Cocktail Cherry': '칵테일 체리',
  Ginger: '생강',
  'Grapefruit Wedge': '자몽 조각',
  'Lemon Twist': '레몬 트위스트',
  'Lemon Wedge': '레몬 조각',
  'Lemon Wheel': '레몬 슬라이스',
  'Lime Wedge': '라임 조각',
  'Lime Wheel': '라임 슬라이스',
  'Mint Sprig': '민트 잎',
  Nutmeg: '넛멕',
  Olive: '올리브',
  'Orange Peel': '오렌지 필',
  'Orange Twist': '오렌지 트위스트',
  'Orange Wheel': '오렌지 슬라이스',
  'Peach Slice': '복숭아 슬라이스',
  'Pineapple Wedge': '파인애플 조각',
  Raspberry: '라즈베리',
  'Salt Rim': '소금 림',
  'Sugar Rim': '설탕 림',
}
