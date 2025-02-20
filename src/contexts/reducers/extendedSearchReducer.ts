import { createReducer } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

import {
  ComparisonOperator,
  extendedSearchTextFields,
} from 'src/components/config'

import { actions } from '../actions'
import {
  GroupedExtendedSearchState,
  SearchGroup,
  SearchListProps,
} from '../types'
import {
  addElement,
  deleteElement,
  removeEmptyElements,
  updateElement,
} from './modifyElement'

export const defaultExtendedSearchListItem: SearchListProps = {
  searchField: extendedSearchTextFields[0].name,
  comparisonOperator: ComparisonOperator.EQ,
  searchTerm: '',
  id: uuidv4(),
}

export const defaultSearchGroupItem: SearchGroup = {
  groupId: 'base',
  groupLogicOperators: [],
  elements: [defaultExtendedSearchListItem],
}

export const groupedExtendedSearchItem: GroupedExtendedSearchState = {
  extendedSearchGroups: [defaultSearchGroupItem],
}

export const extSearchReducer = createReducer<GroupedExtendedSearchState>(
  groupedExtendedSearchItem,
  (builder) => {
    builder.addCase(actions.setExtSearchList, (state, action) => {
      state.extendedSearchGroups = action.payload
    })
    builder.addCase(actions.removeFromExtSearchList, (state, action) => {
      const { index, groupId } = action.payload

      const newState = deleteElement(state.extendedSearchGroups, groupId, index)

      removeEmptyElements(newState)

      state.extendedSearchGroups = newState
    })
    builder.addCase(actions.setNewExtSearchValue, (state, action) => {
      const { index, groupId, value, property } = action.payload

      const newState = updateElement(
        state.extendedSearchGroups,
        groupId,
        index,
        value,
        property,
      )

      state.extendedSearchGroups = newState
    })

    builder.addCase(actions.addToExtSearchList, (state, action) => {
      const { index, logicOperator, groupId } = action.payload

      const newState = addElement(
        state.extendedSearchGroups,
        groupId,
        index,
        logicOperator,
      )

      state.extendedSearchGroups = newState
    })
  },
)
