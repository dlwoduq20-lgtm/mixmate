// Small helpers for picking the correct Korean particle after a
// dynamically-generated word (ingredient name, glass, garnish, etc.).
// Works on the actual trailing syllable, so it stays correct no matter
// what word ends up there.

function finalConsonantIndex(str: string): number {
  const ch = str.trim().slice(-1)
  const code = ch.charCodeAt(0)
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28
  return -1 // non-Hangul (digits, Latin letters, punctuation, ...)
}

// 을/를 (object particle)
export function eulReul(word: string): string {
  const idx = finalConsonantIndex(word)
  if (idx <= 0) return `${word}를`
  return `${word}을`
}

// 으로/로 ("with"/"as"/"into" particle) — no batchim or ㄹ-final -> 로
export function euroRo(word: string): string {
  const idx = finalConsonantIndex(word)
  if (idx === -1 || idx === 0 || idx === 8) return `${word}로`
  return `${word}으로`
}

// 과/와 ("and" particle)
export function gwaWa(word: string): string {
  const idx = finalConsonantIndex(word)
  if (idx <= 0) return `${word}와`
  return `${word}과`
}

// 은/는 (topic particle)
export function eunNeun(word: string): string {
  const idx = finalConsonantIndex(word)
  if (idx <= 0) return `${word}는`
  return `${word}은`
}
