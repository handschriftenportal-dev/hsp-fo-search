/*
 * MIT License
 *
 * Copyright (c) 2021 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { WebModule } from 'hsp-web-module'
import { makeStore, actions, State, selectors } from './contexts/state'
import { createLocationStore } from './contexts/location'
import { createI18nStore } from './contexts/i18n'
import { Config, defaultConfig } from './contexts/config'
import { Events } from './contexts/events'
import { Unit, UnitContainers } from './contexts/units'
import { createReactQueryClient } from './contexts/cache'
import { ResourceInfo } from './contexts/types'


export type HspSearch = WebModule<Config, State, Events, Unit> & {
  setSelectedResources: (resources: ResourceInfo[]) => void
  getSelectedResources: () => ResourceInfo[]
}

export type CreateHspSearch = (config: Config) => HspSearch
export const createHspSearch: CreateHspSearch = (config) => {

  const fullConfig = { ...defaultConfig, ...config }
  let containers: UnitContainers | undefined
  const eventTarget = new EventTarget()
  const store = makeStore()

  const locationStore = createLocationStore({
    path: '/',
    params: new URLSearchParams(),
    hash: '',
  })

  // initialy set language to 'de'
  const i18nStore = createI18nStore({
    language: 'de',
    disableTranslation: false,
  })

  const reactQueryClient =
    createReactQueryClient(fullConfig.cacheOptions)

  store.subscribe(() => {
    eventTarget.dispatchEvent(new CustomEvent('stateChanged', {
      detail: store.getState()
    }))
  })

  return {
    eventTarget,

    addEventListener(type, listener) {
      eventTarget.addEventListener(type, listener as any)
    },

    getConfig() {
      return fullConfig
    },

    async mount(_containers) {
      if (!containers) {
        containers = _containers
        const { mount } = await import('src/contexts/mounting')
        mount({
          containers,
          store,
          config: fullConfig,
          eventTarget,
          i18nStore,
          locationStore,
          reactQueryClient,
        })
      }
    },

    async unmount() {
      if (containers) {
        const { unmount } = await import('src/contexts/mounting')
        unmount(containers)
        containers = undefined
      }
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
      return locationStore.get()
    },

    setLocation(location) {
      locationStore.set(location)
    },

    getLanguage() {
      return i18nStore.get().language
    },

    setLanguage(lang) {
      i18nStore.set({
        ...i18nStore.get(),
        language: lang
      })
    },

    setSelectedResources(resources) {
      store.dispatch(actions.setSelectedResources(resources))
    },

    getSelectedResources() {
      return selectors.getSelectedResources(store.getState())
    }
  }
}

// export module constructor to window
const _window = window as any
_window.createHspSearch = createHspSearch
