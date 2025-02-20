import { useEffect } from 'react'

export type keyAttribute = 'name' | 'property'

export interface SetMetatagParams {
  key: keyAttribute
  value: string
  content: string
}

export const setMetatag = (
  setMetatagParams: SetMetatagParams,
): HTMLMetaElement | undefined => {
  const { key, value, content } = setMetatagParams
  const metatag: HTMLMetaElement | null = document.querySelector(
    `meta[${key}="${value}"]`,
  )
  if (metatag) {
    const currentContent = metatag.getAttribute('content')
    if (currentContent !== content) {
      console.warn(
        `not overriding existing metatag ${value} with current content ${currentContent} with new content ${content}.`,
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
