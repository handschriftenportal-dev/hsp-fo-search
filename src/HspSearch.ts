/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { WebModule } from 'hsp-web-module'
import { makeStore, actions, State, selectors } from './contexts/state'
import { Config, defaultConfig } from './contexts/config'
import { Events } from './contexts/events'
import { Unit, UnitContainers } from './contexts/units'
import { createReactQueryClient } from './contexts/cache'
import { ResourceInfo } from './contexts/types'
import { route } from './contexts/route'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

export type HspSearch = WebModule<Config, State, Events, Unit> & {
  setSelectedResources: (resources: ResourceInfo[]) => void
  getSelectedResources: () => ResourceInfo[]
}

function HspSearch(config: Config): HspSearch {
  const fullConfig = { ...defaultConfig, ...config }
  let containers: UnitContainers | undefined
  let internalUnmount: ((containers: UnitContainers) => boolean) | undefined
  const eventTarget = new EventTarget()
  const store = makeStore()

  const reactQueryClient = createReactQueryClient(fullConfig.cacheOptions)

  store.subscribe(() => {
    eventTarget.dispatchEvent(
      new CustomEvent('stateChanged', {
        detail: store.getState(),
      })
    )
  })

  return {
    eventTarget,

    addEventListener(type, listener) {
      eventTarget.addEventListener(type, listener as any)
      return () => {
        eventTarget.removeEventListener(type, listener as any)
      }
    },

    getConfig() {
      return fullConfig
    },

    async mount(_containers) {
      if (!containers) {
        containers = _containers
        const { mount, unmount } = await import('src/contexts/mounting')
        internalUnmount = unmount
        mount({
          containers,
          store,
          config: fullConfig,
          eventTarget,
          reactQueryClient,
        })
      }
    },

    unmount() {
      if (internalUnmount && containers) {
        const result = internalUnmount(containers)
        containers = undefined
        return result
      }
      return false
    },

    isMounted() {
      return !!containers
    },

    getState() {
      return store.getState()
    },

    setState(state) {
      store.dispatch(actions.setState(state))
    },

    getLocation() {
      return selectors.getLocation(store.getState())
    },

    setLocation(location) {
      store.dispatch(actions.setLocation(location))
    },

    getLanguage() {
      return selectors.getI18nConfig(store.getState()).language
    },

    setLanguage(lang) {
      const i18nConfig = selectors.getI18nConfig(store.getState())
      store.dispatch(actions.setI18nConfig({ ...i18nConfig, language: lang }))
    },

    setSelectedResources(resources) {
      store.dispatch(actions.setSelectedResources(resources))
    },

    getSelectedResources() {
      return selectors.getSelectedResources(store.getState())
    },

    setFeatures(flags) {
      store.dispatch(
        actions.setRetroDescDisplayEnabled(!!flags.retroDescDisplay)
      )
    },
  }
}

/**
 * Module factory function
 */

export type CreateHspSearch = (config: Config) => HspSearch

export const createHspSearch: CreateHspSearch = (config) => {
  const search = HspSearch(config)
  if (config.enableRouting) {
    route(search)
  }
  return search
}

// export module factory to window
;(window as any).createHspSearch = createHspSearch
