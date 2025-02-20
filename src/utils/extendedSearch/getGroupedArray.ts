import { LogicOperator } from '@rsql/ast'

import { SearchGroup, SearchListProps } from 'src/contexts/types'

/* 
transforms a GroupedSearch into an array
groupedArray = [{SearchListElement | GroupedSearch}, 'operator',  {SearchListElement | GroupedSearch}]
*/

export function getGroupedArray(searchList: SearchGroup): any {
  const groupedArray: (SearchGroup | SearchListProps | LogicOperator)[] = []
  searchList.elements.forEach((elem, index) => {
    if ('id' in elem) {
      groupedArray.push(elem)
    }
    if ('groupId' in elem) {
      const innerGroup = getGroupedArray(elem)
      groupedArray.push(innerGroup)
    }
    if (index < searchList.elements.length - 1) {
      groupedArray.push(searchList.groupLogicOperators[index])
    }
  })
  return groupedArray
}
