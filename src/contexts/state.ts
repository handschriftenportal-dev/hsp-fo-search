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

import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createAction, isType, AnyAction } from '../utils/stateUtils'
import { FilterQuery } from './location'
import { ResourceInfo } from './types'


export interface State {
  modifiedFilterQuery?: FilterQuery;
  showFilterList: boolean;
  hitListVariant: 'expanded' | 'collapsed' | 'keyData' | 'citations'
  selectedResources: ResourceInfo[]
}

export const actions = {
  setState: createAction<State>('SET_STATE'),
  setModifiedFilterQuery: createAction<FilterQuery | undefined>('SET_MODIFIED_FILTER_QUERY'),
  toggleFilterList: createAction<void>('TOGGLE_FILTER_LIST'),
  setHitListVariant: createAction<State['hitListVariant']>('SET_HIT_LIST_VARIANT'),
  setSelectedResources: createAction<State['selectedResources']>('SET_SELECTED_RESOURCES')
}

export const selectors = {
  getModifiedFilterQuery: (state: State) => state.modifiedFilterQuery,
  getShowFilterList: (state: State) => state.showFilterList,
  getHitListVariant: (state: State) => state.hitListVariant,
  getSelectedResources: (state: State) => state.selectedResources,
}

export const defaultState: State = {
  showFilterList: false,
  hitListVariant: 'keyData',
  selectedResources: []
}

export function reducer(state = defaultState, action: AnyAction): State {
  if (isType(action, actions.setState)) {
    return action.payload
  }

  if (isType(action, actions.setModifiedFilterQuery)) {
    return {
      ...state,
      modifiedFilterQuery: action.payload
    }
  }

  if (isType(action, actions.toggleFilterList)) {
    return {
      ...state,
      showFilterList: !state.showFilterList
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

  return state
}

export const makeStore = (initialState?: State) => createStore(
  reducer,
  initialState,
  composeWithDevTools(),
)
