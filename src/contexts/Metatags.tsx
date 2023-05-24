/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { useEffect } from 'react'

export type keyAttribute = 'name' | 'property'

export interface SetMetatagParams {
  key: keyAttribute
  value: string
  content: string
}

export const setMetatag = (
  setMetatagParams: SetMetatagParams
): HTMLMetaElement | undefined => {
  const { key, value, content } = setMetatagParams
  const metatag: HTMLMetaElement | null = document.querySelector(
    `meta[${key}="${value}"]`
  )
  if (metatag) {
    const currentContent = metatag.getAttribute('content')
    if (currentContent !== content) {
      console.warn(
        `not overriding existing metatag ${value} with current content ${currentContent} with new content ${content}.`
      )
    } else {
      metatag.setAttribute('content', content)
    }
  } else {
    const newMetatag: HTMLMetaElement = document.createElement('meta')
    newMetatag.setAttribute(key, value)
    newMetatag.content = content
    document.head.appendChild(newMetatag)
    return newMetatag
  }
}

export const useSetMetatag = (setMetatagParams: SetMetatagParams) => {
  const { key, value, content } = setMetatagParams
  useEffect(() => {
    if (content) {
      const element: HTMLMetaElement | undefined = setMetatag(setMetatagParams)
      return () => {
        element?.remove && element.remove()
      }
    }
  }, [key, value, content])
}

// To prevent a component which is mounted multiple times to set the title multiple times (e.g. paging),
// first check, if the title needs to be replaced, or is already the proposed title.

export const useSetTitle = (proposedTitle: string | null | undefined) => {
  useEffect(() => {
    if (typeof proposedTitle !== 'string') {
      return
    }
    const oldTitle = document.title
    if (oldTitle !== proposedTitle) {
      document.title = proposedTitle
    }
    return () => {
      if (oldTitle !== proposedTitle) {
        document.title = oldTitle
      }
    }
  }, [proposedTitle])
}
