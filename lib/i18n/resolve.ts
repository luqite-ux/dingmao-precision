export type LocalizedValue = Record<string, string | null | undefined> | null | undefined

export function resolveLocalized(
  value: LocalizedValue,
  requestedLanguage: string,
  defaultLanguage: string,
): string {
  if (!value) return ''

  const requested = value[requestedLanguage]?.trim()
  if (requested) return requested

  const fallback = value[defaultLanguage]?.trim()
  if (fallback) return fallback

  return Object.values(value).find((entry) => entry?.trim())?.trim() ?? ''
}
