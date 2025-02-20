import { Book } from 'schema-dts'

import { HspObject } from 'src/contexts/discovery'

export function hspObjectToBook(
  hspObject: HspObject | undefined,
): Book | undefined {
  if (
    hspObject &&
    hspObject['persistent-url-display'] &&
    hspObject['title-display']
  ) {
    return {
      '@id': hspObject['persistent-url-display'],
      '@type': 'Book',
      author: 'Person',
      name: hspObject['title-display'],
      url: hspObject['persistent-url-display'],
      workExample: [],
    }
  }
}
