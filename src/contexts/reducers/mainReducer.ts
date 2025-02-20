import { createReducer } from '@reduxjs/toolkit'

import { actions } from '../actions'
import { toSearchParams } from '../location'
import { MainState } from '../types'

export const mainState: MainState = {
  location: {
    pathname: '/',
    hash: '',
    search: toSearchParams({}),
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

export const mainReducer = createReducer<MainState>(mainState, (builder) => {
  builder.addCase(actions.setState, (state, action) => {
    return action.payload.main
  })
  builder.addCase(actions.setLocation, (state, action) => {
    state.location = action.payload
  })
  builder.addCase(actions.setI18nConfig, (state, action) => {
    state.i18nConfig = action.payload
  })
  builder.addCase(actions.setModifiedFilterQuery, (state, action) => {
    state.modifiedFilterQuery = action.payload
  })
  builder.addCase(actions.toggleFilterList, (state) => {
    state.showFilterList = !state.showFilterList
  })
  builder.addCase(actions.setHitListVariant, (state, action) => {
    state.hitListVariant = action.payload
  })
  builder.addCase(actions.setSelectedResources, (state, action) => {
    state.selectedResources = action.payload
  })
  builder.addCase(actions.setRetroDescDisplayEnabled, (state, action) => {
    state.retroDescDisplayEnabled = action.payload
  })
})
