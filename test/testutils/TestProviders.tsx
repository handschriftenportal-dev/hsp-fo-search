import fetch from 'node-fetch'
import React from 'react'

import { Props as ProviderProps, Providers } from 'src/contexts/Providers'
import { createReactQueryClient } from 'src/contexts/cache'
import { defaultConfig } from 'src/contexts/config'
import { defaultSearchGroupItem } from 'src/contexts/reducers/extendedSearchReducer'
import { mainState } from 'src/contexts/reducers/mainReducer'
import { makeStore } from 'src/contexts/state'

export function TestProviders(props: Partial<ProviderProps>) {
  const defaultProps: ProviderProps = {
    config: {
      ...defaultConfig,
      // use node-fetch in test environment
      customFetch: fetch as any,
      // URL must be absolute because we use node-fetch
      // in the test environment.
      discoveryEndpoint: 'http://example.com/api/',
      cacheOptions: {
        // disable caching
        staleTime: 0,
        retry: false,
      },
    },
    store: makeStore({
      main: {
        ...mainState,
        i18nConfig: {
          ...mainState.i18nConfig,
          disableTranslation: true,
        },
      },
      extendedSearch: { extendedSearchGroups: [defaultSearchGroupItem] },
    }),
    eventTarget: new EventTarget(),
    children: null,
    containers: {},
    reactQueryClient: createReactQueryClient({
      // disable caching
      staleTime: 0,
      retry: false,
    }),
  }

  const effectiveProps = {
    ...defaultProps,
    ...props,
  }

  return <Providers {...effectiveProps}>{props.children}</Providers>
}
