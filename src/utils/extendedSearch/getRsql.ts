import { SearchGroup } from 'src/contexts/types'

import { getGroupedArray } from './getGroupedArray'

export function getRsql(searchList: SearchGroup[]) {
  function getExpression(arr: any[]): string {
    let result = ''

    arr.forEach((elem) => {
      if (typeof elem === 'object' && 'id' in elem) {
        const searchTerm = elem.searchTerm.length
          ? `'${elem.searchTerm}'`
          : '""'
        const expression = `${elem.searchField}${elem.comparisonOperator}${searchTerm}`
        result += expression
      }
      if (Array.isArray(elem)) {
        const innerString = getExpression(elem)
        result += `(${innerString})`
      }
      if (elem === ';' || elem === ',') {
        result += '' + elem + ''
      }
    })

    return result
  }

  const expression = getExpression(getGroupedArray(searchList[0]))

  return expression
}
