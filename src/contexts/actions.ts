import { WebModuleLocation } from 'hsp-web-module'

import { LogicOperator } from 'src/components/config'
import { createAction } from 'src/utils/stateUtils'

import { I18nConfig } from './i18n'
import { FilterQuery } from './location'
import {
  CombinedState,
  GroupedExtendedSearchState,
  MainState,
  SearchListProps,
} from './types'

export const actions = {
  setState: createAction<CombinedState>('SET_STATE'),
  setLocation: createAction<WebModuleLocation>('SET_LOCATION'),
  setI18nConfig: createAction<I18nConfig>('SET_I18N_CONFIG'),
  setModifiedFilterQuery: createAction<FilterQuery | undefined>(
    'SET_MODIFIED_FILTER_QUERY',
  ),
  toggleFilterList: createAction<void>('TOGGLE_FILTER_LIST'),
  setHitListVariant: createAction<MainState['hitListVariant']>(
    'SET_HIT_LIST_VARIANT',
  ),
  setSelectedResources: createAction<MainState['selectedResources']>(
    'SET_SELECTED_RESOURCES',
  ),
  setRetroDescDisplayEnabled: createAction<boolean>(
    'SET_RETRO_DESC_DISPLAY_ENABLED',
  ),
  setExtSearchList: createAction<
    GroupedExtendedSearchState['extendedSearchGroups']
  >('SET_EXT_SEARCH_LIST'),
  addToExtSearchList: createAction<{
    index: number
    groupId: string
    logicOperator: LogicOperator
  }>('ADD_TO_EXT_SEARCH_LIST'),

  removeFromExtSearchList: createAction<{ index: number; groupId: string }>(
    'REMOVE_FROM_EXT_SEARCH_LIST',
  ),

  setNewExtSearchValue: createAction<{
    index: number
    groupId: string
    value: string
    property: keyof SearchListProps
  }>('SET_NEW_EXT_SEARCH_TERM'),

  setNewOrderExtSearch: createAction<{ startIndex: number; endIndex: number }>(
    'SET_NEW_ORDER_EXT_SEARCH',
  ),
}
