import {
  ComparisonOperator,
  extendedSearchTextFields,
} from 'src/components/config'
import { useTranslation } from 'src/contexts/i18n'
import { SearchGroup, SearchListProps } from 'src/contexts/types'

import { getGroupedArray } from './getGroupedArray'
import { parseFromRSQL } from './parseRsql'

function getComparisonTranslation(
  operator: string,
  t: (...args: string[]) => string,
): string {
  switch (operator) {
    case ComparisonOperator.NEQ:
      return t('extendedSearch', 'boolNeq')
    case ComparisonOperator.LE:
      return t('extendedSearch', 'boolLe')
    case ComparisonOperator.LT:
      return t('extendedSearch', 'boolLt')
    case ComparisonOperator.GE:
      return t('extendedSearch', 'boolGe')
    case ComparisonOperator.GT:
      return t('extendedSearch', 'boolGt')
    default:
      return t('extendedSearch', 'boolEq')
  }
}

const getElementExpression = (
  element: SearchListProps,
  t: (...args: any[]) => string,
) => {
  const translatedSearchField =
    element.searchField === 'FIELD-GROUP-ALL'
      ? t('searchBar', 'allFields')
      : t('data', element.searchField, '__field__')
  const fieldType = (
    extendedSearchTextFields.find(
      (textField) => textField.name === element.searchField,
    ) as { type: string }
  ).type
  const searchTerm =
    fieldType === 'text'
      ? element.searchTerm
      : t('data', element.searchField, element.searchTerm)
  const comparisonTranslation = getComparisonTranslation(
    element.comparisonOperator,
    t,
  )
  const translatedEntry = `"${translatedSearchField}" ${comparisonTranslation} "${searchTerm}"`

  return translatedEntry
}

function getSearchExpression(
  searchList: SearchGroup,
  t: (...args: string[]) => string,
) {
  function getExpression(arr: any[]): string {
    let result = ''

    arr.forEach((elem) => {
      if (typeof elem === 'object' && 'id' in elem) {
        const expression = getElementExpression(elem, t)
        result += expression
      }
      if (Array.isArray(elem)) {
        const innerString = getExpression(elem)
        result += `(${innerString})`
      }
      if (elem === ';' || elem === ',') {
        result += ' ' + elem + ' '
      }
    })

    return result
  }
  const expressionArray = getGroupedArray(searchList)
  return getExpression(expressionArray)
}

export function useGetExtendedSearchTerm(): (
  searchExpression: string,
) => string {
  const { t } = useTranslation()

  return (searchExpression: string) => {
    const { searchList } = parseFromRSQL(searchExpression)

    return getSearchExpression(searchList[0], t)
  }
}
