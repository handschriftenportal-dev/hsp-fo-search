import {
  AND,
  ComparisonNode,
  ExpressionNode,
  LogicNode,
  OR,
  getSelector,
  getValue,
  isComparisonNode,
  isLogicNode,
  isLogicOperator,
} from '@rsql/ast'
import { parse } from '@rsql/parser'
import { v4 as uuidv4 } from 'uuid'

import { ComparisonOperator, LogicOperator } from 'src/components/config'
import { SearchGroup, SearchListProps } from 'src/contexts/types'

function emitComparison(node: ComparisonNode): SearchListProps {
  return {
    searchField: getSelector(node),
    comparisonOperator: node.operator as ComparisonOperator,
    searchTerm: getValue(node),
    id: uuidv4(),
  }
}

function splitIntoParts(parts: any): any {
  function traverse(elementParts: any[]) {
    const left: any = []
    const ops: any = []
    const right: any = []
    elementParts.forEach((elem, index) => {
      if (Array.isArray(elem) && index === 0) {
        const [leftRec, opsRec, rightRec] = traverse(elem)
        left.push(...leftRec)
        ops.push(...opsRec)
        right.push(...rightRec)
      } else if (index === 0 && 'id' in elem) {
        left.push(elem)
      } else if (index === 0 && 'groupId' in elem) {
        left.push(elem)
      } else if (index === 1) {
        ops.push(elem)
      } else if (index === 2 && 'id' in elem) {
        right.push(elem)
      } else if (index === 2 && 'groupId' in elem) {
        right.push(elem)
      }
    })
    return [left, ops, right]
  }

  const [left, ops, right] = traverse(parts)
  return [left, ops, right]
}

function getNewGroup(groupArray: any[]): SearchGroup {
  const [left, ops, right] = splitIntoParts(groupArray)

  const newGroup = {
    groupId: uuidv4(),
    groupLogicOperators: ops,
    elements: [...left, ...right],
  }
  return newGroup
}

function emitLogic(node: LogicNode) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  let left = getSearchGroupParts(node.left)
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  let right = getSearchGroupParts(node.right)

  if (isLogicOperator(node.operator, AND)) {
    if (isLogicNode(node.left, OR)) {
      const newGroup = getNewGroup(left)
      left = newGroup
    }

    if (isLogicNode(node.right, OR)) {
      const newGroup = getNewGroup(right)
      right = newGroup
    }
  }
  if (isLogicOperator(node.operator, OR)) {
    if (isLogicNode(node.left, AND)) {
      const newGroup = getNewGroup(left)
      left = newGroup
    }
    if (isLogicNode(node.right, AND)) {
      const newGroup = getNewGroup(right)
      right = newGroup
    }
  }

  const operator = node.operator === 'and' || node.operator === ';' ? AND : OR

  return [left, operator, right]
}

function getSearchGroupParts(ast: ExpressionNode): any {
  if (isComparisonNode(ast)) {
    return emitComparison(ast)
  } else if (isLogicNode(ast)) {
    return emitLogic(ast)
  }
}

function getGroup(searchParts: any, group: any) {
  for (const element of searchParts) {
    if (typeof element === 'object' && 'id' in element) {
      group.elements.push(element)
    } else if (typeof element === 'object' && 'groupId' in element) {
      group.elements.push(element)
    } else if (
      typeof element === 'string' &&
      (element === ',' || element === ';')
    ) {
      group.groupLogicOperators.push(element as LogicOperator)
    } else if (Array.isArray(element)) {
      getGroup(element, group)
    }
  }
  return group
}

function getSearchGroup(parts: SearchListProps | any[]) {
  const group: SearchGroup = {
    groupId: 'base',
    elements: [],
    groupLogicOperators: [],
  }
  if (typeof parts === 'object' && 'id' in parts) {
    group.elements.push(parts)
  }

  if (Array.isArray(parts)) {
    getGroup(parts, group)
  }

  return group
}

export function parseFromRSQL(expression: string): {
  searchList: SearchGroup[]
} {
  let searchList: SearchGroup[] = []

  if (expression.length > 0) {
    const ast = parse(expression)

    const searchGroupParts = getSearchGroupParts(ast)

    searchList = [getSearchGroup(searchGroupParts)]
  }

  return { searchList }
}
