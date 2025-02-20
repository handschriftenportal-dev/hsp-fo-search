import { parseFromRSQL } from 'src/utils/extendedSearch'

jest.mock('uuid', () => ({ v4: () => '00' }))

const settlementLeipzig = {
  id: '00',
  searchField: 'settlement-search',
  searchTerm: 'Leipzig',
  comparisonOperator: '==',
}
const settlementNotBerlin = {
  id: '00',
  searchField: 'settlement-search',
  searchTerm: 'Berlin',
  comparisonOperator: '!=',
}
const bindingSearch = {
  id: '00',
  searchField: 'binding-search',
  searchTerm: 'alles',
  comparisonOperator: '==',
}
const fieldGroupAll = {
  id: '00',
  searchField: 'FIELD-GROUP-ALL',
  searchTerm: 'test',
  comparisonOperator: '==',
}

test('parseFromRsql', function () {
  const settlementEqualsLeipzig = {
    searchList: [
      {
        groupId: 'base',
        groupLogicOperators: [],
        elements: [settlementLeipzig],
      },
    ],
  }

  expect(parseFromRSQL('settlement-search==Leipzig')).toStrictEqual(
    settlementEqualsLeipzig,
  )

  const settlementEqualsLeipzigOrSettlementNotEqualsBerlin = {
    searchList: [
      {
        groupId: 'base',
        groupLogicOperators: [','],
        elements: [settlementLeipzig, settlementNotBerlin],
      },
    ],
  }
  expect(
    parseFromRSQL('settlement-search==Leipzig,settlement-search!=Berlin'),
  ).toStrictEqual(settlementEqualsLeipzigOrSettlementNotEqualsBerlin)

  const groupSearchQuery = {
    searchList: [
      {
        groupId: 'base',
        groupLogicOperators: [','],
        elements: [
          settlementLeipzig,
          {
            groupId: '00',
            groupLogicOperators: [';'],
            elements: [settlementNotBerlin, bindingSearch],
          },
        ],
      },
    ],
  }
  // implicit
  expect(
    parseFromRSQL(
      'settlement-search==Leipzig,settlement-search!=Berlin;binding-search==alles',
    ),
  ).toStrictEqual(groupSearchQuery)
  // explicit
  expect(
    parseFromRSQL(
      'settlement-search==Leipzig,(settlement-search!=Berlin;binding-search==alles)',
    ),
  ).toStrictEqual(groupSearchQuery)

  const groupSearchFirstPartGroup = {
    searchList: [
      {
        groupId: 'base',
        groupLogicOperators: [','],
        elements: [
          {
            groupId: '00',
            groupLogicOperators: [';'],
            elements: [settlementLeipzig, settlementNotBerlin],
          },
          bindingSearch,
        ],
      },
    ],
  }

  expect(
    parseFromRSQL(
      'settlement-search==Leipzig;settlement-search!=Berlin,binding-search==alles',
    ),
  ).toStrictEqual(groupSearchFirstPartGroup)

  const nestedGroupSearchQuery = {
    searchList: [
      {
        elements: [
          settlementLeipzig,
          {
            elements: [
              settlementNotBerlin,
              {
                elements: [bindingSearch, fieldGroupAll],
                groupId: '00',
                groupLogicOperators: [','],
              },
            ],
            groupId: '00',
            groupLogicOperators: [';'],
          },
        ],
        groupId: 'base',
        groupLogicOperators: [','],
      },
    ],
  }
  expect(
    parseFromRSQL(
      'settlement-search==Leipzig,settlement-search!=Berlin;(binding-search==alles,FIELD-GROUP-ALL==test)',
    ),
  ).toStrictEqual(nestedGroupSearchQuery)

  const twoGroupsWithThreeElements = {
    searchList: [
      {
        elements: [
          {
            elements: [
              settlementLeipzig,
              settlementNotBerlin,
              settlementLeipzig,
            ],
            groupId: '00',
            groupLogicOperators: [';', ';'],
          },
          {
            elements: [bindingSearch, fieldGroupAll, bindingSearch],
            groupId: '00',
            groupLogicOperators: [';', ';'],
          },
        ],
        groupId: 'base',
        groupLogicOperators: [','],
      },
    ],
  }
  expect(
    parseFromRSQL(
      '(settlement-search==Leipzig;settlement-search!=Berlin;settlement-search==Leipzig),(binding-search==alles;FIELD-GROUP-ALL==test;binding-search==alles)',
    ),
  ).toStrictEqual(twoGroupsWithThreeElements)
})
