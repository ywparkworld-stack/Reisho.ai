// Small kana that combine with preceding character (do not count as own mora)
const SMALL_KANA = new Set([
  'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゃ', 'ゅ', 'ょ', 'ゎ', 'ゕ', 'ゖ',
  'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ャ', 'ュ', 'ョ', 'ヮ', 'ヵ', 'ヶ',
])

const IGNORED = new Set([' ', '　', '\n', '\r', '\t'])

export function countMora(text: string): number {
  let count = 0
  for (const char of text) {
    if (SMALL_KANA.has(char) || IGNORED.has(char)) continue
    count++
  }
  return count
}

export function hasKanji(text: string): boolean {
  return /[一-鿿㐀-䶿]/.test(text)
}

export const HAIKU_PATTERN = [5, 7, 5] as const
export type HaikuLines = [string, string, string]

export function validateHaiku(lines: HaikuLines): boolean {
  return lines.every((line, i) => countMora(line) === HAIKU_PATTERN[i])
}
