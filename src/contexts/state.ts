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

import { WebModuleLocation } from 'hsp-web-module'
import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createAction, isType, AnyAction } from '../utils/stateUtils'
import { FilterQuery, toSearchParams } from './location'
import { I18nConfig } from './i18n'
import { ResourceInfo } from './types'

export interface State {
  location: WebModuleLocation
  i18nConfig: I18nConfig
  modifiedFilterQuery?: FilterQuery
  showFilterList: boolean
  hitListVariant: 'expanded' | 'collapsed' | 'keyData' | 'citations'
  selectedResources: ResourceInfo[]
  retroDescDisplayEnabled: boolean
}

export const actions = {
  setState: createAction<State>('SET_STATE'),
  setLocation: createAction<WebModuleLocation>('SET_LOCATION'),
  setI18nConfig: createAction<I18nConfig>('SET_I18N_CONFIG'),
  setModifiedFilterQuery: createAction<FilterQuery | undefined>(
    'SET_MODIFIED_FILTER_QUERY'
  ),
  toggleFilterList: createAction<void>('TOGGLE_FILTER_LIST'),
  setHitListVariant: createAction<State['hitListVariant']>(
    'SET_HIT_LIST_VARIANT'
  ),
  setSelectedResources: createAction<State['selectedResources']>(
    'SET_SELECTED_RESOURCES'
  ),
  setRetroDescDisplayEnabled: createAction<boolean>(
    'SET_RETRO_DESC_DISPLAY_ENABLED'
  ),
}

export const selectors = {
  getLocation: (state: State) => state.location,
  getI18nConfig: (state: State) => state.i18nConfig,
  getModifiedFilterQuery: (state: State) => state.modifiedFilterQuery,
  getShowFilterList: (state: State) => state.showFilterList,
  getHitListVariant: (state: State) => state.hitListVariant,
  getSelectedResources: (state: State) => state.selectedResources,
  getRetroDescDisplayEnabled: (state: State) => state.retroDescDisplayEnabled,
}

export const defaultState: State = {
  location: {
    pathname: '/',
    hash: '',
    search: toSearchParams({
      fq: {
        'described-object-facet': ['true'],
      },
    }),
  },
  i18nConfig: {
    language: 'de',
    disableTranslation: false,
  },
  showFilterList: false,
  hitListVariant: 'expanded',
  selectedResources: [],
  retroDescDisplayEnabled: false,
}

export function reducer(state = defaultState, action: AnyAction): State {
  if (isType(action, actions.setState)) {
    return action.payload
  }

  if (isType(action, actions.setLocation)) {
    return {
      ...state,
      location: action.payload,
    }
  }

  if (isType(action, actions.setI18nConfig)) {
    return {
      ...state,
      i18nConfig: action.payload,
    }
  }

  if (isType(action, actions.setModifiedFilterQuery)) {
    return {
      ...state,
      modifiedFilterQuery: action.payload,
    }
  }

  if (isType(action, actions.toggleFilterList)) {
    return {
      ...state,
      showFilterList: !state.showFilterList,
    }
  }

  if (isType(action, actions.setHitListVariant)) {
    return {
      ...state,
      hitListVariant: action.payload,
    }
  }

  if (isType(action, actions.setSelectedResources)) {
    return {
      ...state,
      selectedResources: action.payload,
    }
  }

  if (isType(action, actions.setRetroDescDisplayEnabled)) {
    return {
      ...state,
      retroDescDisplayEnabled: action.payload,
    }
  }
  return state
}

export const makeStore = (initialState?: State) =>
  createStore(reducer, initialState, composeWithDevTools())
