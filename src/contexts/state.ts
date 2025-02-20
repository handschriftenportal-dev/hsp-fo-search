import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { extSearchReducer } from './reducers/extendedSearchReducer'
import { mainReducer } from './reducers/mainReducer'
import { CombinedState } from './types'

export const selectors = {
  getLocation: (state: CombinedState) => state.main.location,
  getI18nConfig: (state: CombinedState) => state.main.i18nConfig,
  getModifiedFilterQuery: (state: CombinedState) =>
    state.main.modifiedFilterQuery,
  getShowFilterList: (state: CombinedState) => state.main.showFilterList,
  getHitListVariant: (state: CombinedState) => state.main.hitListVariant,
  getSelectedResources: (state: CombinedState) => state.main.selectedResources,
  getRetroDescDisplayEnabled: (state: CombinedState) =>
    state.main.retroDescDisplayEnabled,
  getExtendedSearchGroups: (state: CombinedState) =>
    state.extendedSearch.extendedSearchGroups,
  getExtendedSearchListOperators: (state: CombinedState) =>
    state.extendedSearch.extendedSearchGroups[0].groupLogicOperators,
}

const rootReducer = combineReducers<CombinedState>({
  main: mainReducer,
  extendedSearch: extSearchReducer,
})

export const makeStore = (initialState?: CombinedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    devTools: true,
  })
