import { Dispatch } from 'react'

import {
  ComparisonOperator,
  extendedSearchTextFields,
} from 'src/components/config'
import { actions } from 'src/contexts/actions'

export const resetSearchEntry = (
  index: number,
  searchTermValue: string,
  dispatch: Dispatch<unknown>,
  groupId: string,
  type?: string,
) => {
  dispatch(
    actions.setNewExtSearchValue({
      index,
      value: ComparisonOperator.EQ,
      groupId,
      property: 'comparisonOperator',
    }),
  )
  if (type === 'enum') {
    const defaultTerm = (
      extendedSearchTextFields.find(
        (entry) => entry.name === searchTermValue,
      ) as {
        values: string[]
      }
    ).values[0]
    dispatch(
      actions.setNewExtSearchValue({
        index,
        value: defaultTerm,
        groupId,
        property: 'searchTerm',
      }),
    )
  } else {
    dispatch(
      actions.setNewExtSearchValue({
        index,
        value: searchTermValue,
        groupId,
        property: 'searchTerm',
      }),
    )
  }
}
