export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter'
export type GreetingKey = 'night' | 'morning' | 'afternoon' | 'evening'

export function currentSeason(date: Date = new Date()): Season {
  const month = date.getMonth() + 1 // 1-12
  if (month >= 3 && month <= 5) return 'Spring'
  if (month >= 6 && month <= 8) return 'Summer'
  if (month >= 9 && month <= 11) return 'Autumn'
  return 'Winter'
}

export function greetingKeyForTime(date: Date = new Date()): GreetingKey {
  const h = date.getHours()
  if (h < 5) return 'night'
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
