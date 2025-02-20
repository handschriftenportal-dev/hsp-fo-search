export function isBooleanArray(item: any): item is boolean[] {
  return Array.isArray(item) && item.every((x) => typeof x === 'boolean')
}
