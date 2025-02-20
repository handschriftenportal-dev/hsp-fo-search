export function isStringArray(item: any): item is string[] {
  return Array.isArray(item) && item.every((x) => typeof x === 'string')
}
