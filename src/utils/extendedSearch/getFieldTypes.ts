import { extendedSearchTextFields } from 'src/components/config'
import { SearchGroup, SearchListProps } from 'src/contexts/types'

function findEntry(
  groupId: string,
  index: number,
  searchGroups: (SearchGroup | SearchListProps)[],
): SearchListProps | undefined {
  for (const elem of searchGroups) {
    if ('groupId' in elem && elem.groupId === groupId) {
      return elem.elements[index] as SearchListProps
    } else if ('elements' in elem && elem.elements.length > 0) {
      const entry = findEntry(groupId, index, elem.elements)
      if (entry !== undefined) {
        return entry
      }
    }
  }
  return undefined
}

export function getFieldTypes(
  groupId: string,
  index: number,
  newFieldName: string,
  searchGroups: SearchGroup[],
): { oldFieldType: string; newFieldType: string } {
  const oldEntry = findEntry(groupId, index, searchGroups)
  let oldFieldType = ''
  if (oldEntry !== undefined) {
    oldFieldType = (
      extendedSearchTextFields.find(
        (entry) => entry.name === oldEntry.searchField,
      ) as { type: string }
    ).type
  }

  const newFieldType = (
    extendedSearchTextFields.find((entry) => entry.name === newFieldName) as {
      type: string
    }
  ).type

  return { oldFieldType, newFieldType }
}
