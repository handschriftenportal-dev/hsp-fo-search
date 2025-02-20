/**
 * Chunks an object in a given number of parts. If it's no possible to create chunks
 * of the same length then make the chunk sizes as evenly as possible.
 *
 * chunkObject({ a: 1, b: 2, c: 3, d: 4, e: 5 }, 3) -> [[{ a: 1, b: 2}, { c: 3, d: 4 }, { e: 5 }]]
 */
export function chunkObject<T extends Record<string, any>>(
  obj: T,
  count: number,
) {
  const keys = Object.keys(obj)

  const pick = (keys: string[]) =>
    keys.reduce((acc, key) => {
      return { ...acc, [key]: obj[key] }
    }, {})

  if (count < 1) {
    return []
  }

  if (count > keys.length) {
    throw new Error('count > keys.length')
  }

  const quot = Math.floor(keys.length / count)
  let rest = keys.length % count
  const chunks = []
  let off = 0
  while (off < keys.length) {
    if (rest > 0) {
      chunks.push(pick(keys.slice(off, off + quot + 1)))
      off++
    } else {
      chunks.push(pick(keys.slice(off, off + quot)))
    }
    off += quot
    rest--
  }

  return chunks as T[]
}
