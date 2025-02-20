import React from 'react'

import { useLocation, useParsedParams } from 'src/contexts/hooks'
import { ParsedParams } from 'src/contexts/location'

import { ExtendedSearchView } from './ExtendedSearchView'
import { ListView } from './ListView'
import { Overview } from './Overview'

interface Props {
  className?: string
}

export function Main({ className }: Props) {
  const { hspobjectid }: ParsedParams = useParsedParams()

  const { pathname } = useLocation()
  let children = null

  if (hspobjectid) {
    children = <Overview className={className} />
  } else if (pathname === '/extended') {
    children = <ExtendedSearchView />
  } else {
    children = <ListView className={className} />
  }

  return <div id="hsp-search-main">{children}</div>
}
