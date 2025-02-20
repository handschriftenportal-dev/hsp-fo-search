/**
 * A place for react hooks to decouple src/contexts/state.js from other context files
 * and prevent cyclic dependencies.
 */
import { useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { ConfigContext } from 'src/contexts/config'
import { selectors } from 'src/contexts/state'

import { ParsedParams, parseSearchParams } from './location'

export function useLocation() {
  return useSelector(selectors.getLocation)
}

export function useParsedParams(): ParsedParams {
  const { search } = useLocation()
  return useMemo(() => parseSearchParams(search), [search])
}

export function useSearchModuleLocation() {
  const context = useContext(ConfigContext)
  const { isExtended } = useParsedParams()
  const { pathname } = useLocation()

  const inSimpleSearch = !isExtended
  const isMounted = window.location.pathname?.startsWith('/search')
  const inExtendedView = context?.enableRouting
    ? pathname === '/extended'
    : pathname === '/extended' && isMounted
  const notInExtendedView = context?.enableRouting
    ? !inExtendedView
    : pathname !== '/extended' || !isMounted
  const extendedButNotInExtendedView = isExtended && notInExtendedView

  return {
    inExtendedView,
    notInExtendedView,
    extendedButNotInExtendedView,
    inSimpleSearch,
    isExtended,
    isMounted,
  }
}
