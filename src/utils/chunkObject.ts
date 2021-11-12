/*
 * MIT License
 *
 * Copyright (c) 2021 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * Chunks an object in a given number of parts. If it's no possible to create chunks
 * of the same length then make the chunk sizes as evenly as possible.
 *
 * chunkObject({ a: 1, b: 2, c: 3, d: 4, e: 5 }, 3) -> [[{ a: 1, b: 2}, { c: 3, d: 4 }, { e: 5 }]]
 */
export function chunkObject<T extends Record<string, any>>(obj: T, count: number) {
  const keys = Object.keys(obj)

  const pick = (keys: string[]) => keys.reduce((acc, key) => {
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

  for (let off = 0; off < keys.length; off += quot, rest--) {
    if (rest > 0) {
      chunks.push(pick(keys.slice(off, off + quot + 1)))
      off++
    } else {
      chunks.push(pick(keys.slice(off, off + quot)))
    }
  }

  return chunks as T[]
}
