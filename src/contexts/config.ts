import { WebModuleConfig } from 'hsp-web-module'
import { createContext, useContext } from 'react'

import { ThemeOptions } from '@material-ui/core/styles'

export type Config = WebModuleConfig & {
  theme?: ThemeOptions
  discoveryEndpoint: string
  cacheOptions?: {
    staleTime: number // milisecond
    retry: number | boolean
  }
}

export const ConfigContext = createContext<Required<Config> | undefined>(
  undefined,
)
export const useConfig = () => useContext(ConfigContext) as Required<Config>

export const defaultConfig: Required<Config> = {
  classNamePrefix: 'hsp-search',
  enableRouting: false,
  customFetch: window.fetch,
  createAbsoluteURL({ pathname, search, hash }) {
    const url = new URL(pathname, window.location.origin)
    url.search = search
    url.hash = hash
    return url
  },
  cacheOptions: {
    staleTime: 3 * 60 * 1000,
    retry: 3,
  },
  theme: {},
  discoveryEndpoint: 'http://example.com/api/',
}
