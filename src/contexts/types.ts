/**
 * Shared types
 */
import { WebModuleLanguage, WebModuleLocation } from 'hsp-web-module'

import { ComparisonOperator, LogicOperator } from 'src/components/config'

import { I18nConfig } from './i18n'
import { FilterQuery } from './location'

export interface MainState {
  location: WebModuleLocation
  i18nConfig: I18nConfig
  modifiedFilterQuery?: FilterQuery
  showFilterList: boolean
  hitListVariant: 'expanded' | 'collapsed' | 'keyData' | 'citations'
  selectedResources: ResourceInfo[]
  retroDescDisplayEnabled: boolean
}

export interface CombinedState {
  main: MainState
  extendedSearch: GroupedExtendedSearchState
}

export type LanguageMap = Record<WebModuleLanguage, string>

export interface ResourceInfo {
  type: 'hsp:description' | 'hsp:description_retro' | 'iiif:manifest'
  id: string
  query?: string
}

export interface SearchListProps {
  searchField: string
  comparisonOperator: ComparisonOperator
  searchTerm: string | string[]
  id: string
}

export interface SearchGroup {
  groupId: string
  groupLogicOperators: LogicOperator[]
  elements: (SearchListProps | SearchGroup)[]
}

export interface GroupedExtendedSearchState {
  extendedSearchGroups: SearchGroup[]
}
