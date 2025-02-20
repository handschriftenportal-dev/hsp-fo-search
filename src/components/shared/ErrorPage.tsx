import React from 'react'

import { useSetMetatag } from 'src/contexts/Metatags'

interface Props {
  datatestid?: string
  errorMessage: string
}

export function ErrorPage(props: Props) {
  const { datatestid, errorMessage } = props

  useSetMetatag({ key: 'name', value: 'robots', content: 'noindex' })

  return <p data-testid={datatestid}>{errorMessage}</p>
}
