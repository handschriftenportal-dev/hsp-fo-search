import { HspThemeProvider } from 'hsp-web-module'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { Store } from 'redux'

import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles'

import { Config, ConfigContext } from './config'
import { EventTargetContext } from './events'
import { CombinedState } from './types'
import { UnitContainers } from './units'

export interface Props {
  children?: React.ReactNode
  store: Store<CombinedState>
  config: Required<Config>
  eventTarget: EventTarget
  containers: UnitContainers
  reactQueryClient: QueryClient
}

export function Providers(props: Props) {
  const generateClassName = createGenerateClassName({
    seed: props.config.classNamePrefix,
  })

  return (
    <Provider store={props.store}>
      <ConfigContext.Provider value={props.config}>
        <EventTargetContext.Provider value={props.eventTarget}>
          <QueryClientProvider client={props.reactQueryClient}>
            <StylesProvider generateClassName={generateClassName}>
              <HspThemeProvider themeOptions={props.config.theme}>
                <SnackbarProvider
                  maxSnack={3}
                  autoHideDuration={4000}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  {props.children}
                </SnackbarProvider>
              </HspThemeProvider>
            </StylesProvider>
          </QueryClientProvider>
        </EventTargetContext.Provider>
      </ConfigContext.Provider>
    </Provider>
  )
}
