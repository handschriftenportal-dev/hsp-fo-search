import { v4 as uuidv4 } from 'uuid'

import {
  ComparisonOperator,
  LogicOperator,
  extendedSearchTextFields,
} from 'src/components/config'
import { SearchGroup, SearchListProps } from 'src/contexts/types'

export function removeEmptyElements(
  searchGroup: (SearchGroup | SearchListProps)[],
) {
  return searchGroup.filter((elem) => {
    if ('groupId' in elem && elem.elements) {
      elem.elements = removeEmptyElements(elem.elements)
      return elem.elements.length > 0
    } else {
      return elem
    }
  })
}

export const deleteElement = (
  elements: (SearchGroup | SearchListProps)[],
  groupId: string,
  index: number,
): any => {
  return elements.map((element) => {
    if ('groupId' in element) {
      if (element.groupId === groupId) {
        const elements = [...element.elements]
        elements.splice(index, 1)
        const groupLogicOperators = [...element.groupLogicOperators]
        groupLogicOperators.splice(index - 1, 1)
        const copied = {
          ...element,
          elements,
          groupLogicOperators,
        }
        copied.elements = deleteElement(copied.elements, groupId, index)

        if (copied.elements.length <= 1 && copied.groupId !== 'base') {
          return copied.elements[0]
        }
        return copied
      } else if (element.groupId !== groupId) {
        const copied = { ...element }
        copied.elements = deleteElement(copied.elements, groupId, index)

        return copied
      }
    }
    return element
  })
}

const changeValue = (
  element: SearchListProps,
  value: string | ComparisonOperator,
  property: keyof SearchListProps,
) => {
  const copy = { ...element }
  if (property === 'searchTerm') {
    copy[property] = value
  }
  if (property === 'comparisonOperator') {
    copy[property] = value as ComparisonOperator
  }
  if (property === 'searchField') {
    copy[property] = value
  }
  return copy
}

export const updateElement = (
  elements: (SearchGroup | SearchListProps)[],
  groupId: string,
  updateIndex: number,
  value: string,
  property: keyof SearchListProps,
): any => {
  return elements.map((element) => {
    if ('groupId' in element) {
      if (element.groupId === groupId) {
        const copy = { ...element }
        copy.elements = copy.elements.map((entry, i) => {
          if ('id' in entry && updateIndex === i) {
            const elem = changeValue(entry, value, property)
            return elem
          }
          return entry
        })
        return copy
      }
      if (element.groupId !== groupId) {
        const copied = { ...element }
        copied.elements = updateElement(
          copied.elements,
          groupId,
          updateIndex,
          value,
          property,
        )
        return copied
      }
    }

    return element
  })
}

export const addElement = (
  elements: (SearchGroup | SearchListProps)[],
  groupId: string,
  updateIndex: number,
  logicOperator: LogicOperator,
): any => {
  return elements.map((element) => {
    if ('groupId' in element) {
      if (element.groupId === groupId) {
        const defaultSearchElement = {
          searchField: extendedSearchTextFields[0].name,
          comparisonOperator: ComparisonOperator.EQ,
          searchTerm: '',
          id: uuidv4(),
        }
        const copiedElements = [...element.elements]
        const copiedOperators = [...element.groupLogicOperators]

        const isSameOperators =
          element.groupLogicOperators.every((elem) => elem === logicOperator) ||
          element.groupLogicOperators === undefined
        if (isSameOperators) {
          copiedElements.splice(updateIndex + 1, 0, defaultSearchElement)
          copiedOperators.splice(updateIndex, 0, logicOperator)

          return {
            ...element,
            elements: copiedElements,
            groupLogicOperators: copiedOperators,
          }
        } else {
          const takeOverElement = copiedElements[updateIndex]
          const newGroupElements = [takeOverElement, defaultSearchElement]

          const elements = [
            ...copiedElements.slice(0, updateIndex),
            {
              groupId: uuidv4(),
              groupLogicOperators: [logicOperator],
              elements: newGroupElements,
            },
            ...copiedElements.slice(updateIndex + 1),
          ]
          return { ...element, elements }
        }
      }
      if (element.groupId !== groupId) {
        const copied = { ...element }
        copied.elements = addElement(
          copied.elements,
          groupId,
          updateIndex,
          logicOperator,
        )
        return copied
      }
    }
    return element
  })
}
