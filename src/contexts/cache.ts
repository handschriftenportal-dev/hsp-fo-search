import { QueryClient } from 'react-query'

import { Config } from './config'

export function createReactQueryClient(
  options: Required<Config>['cacheOptions'],
) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: options.staleTime,
        retry: options.retry,
      },
    },
  })
}
