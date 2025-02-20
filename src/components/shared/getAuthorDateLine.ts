import { HspDescription } from 'src/contexts/discovery'

export function getAuthorDateLine(desc: HspDescription) {
  const authors = desc['author-display']
  const date = desc['publish-year-display']
  return (
    (authors || date) &&
    `${authors?.join('; ') || ''} (${date || ''}):`.replace(' ()', '')
  )
}
