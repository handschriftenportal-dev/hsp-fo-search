import { ComparisonOperator, LogicOperator } from 'src/components/config'
import { getRsql } from 'src/utils/extendedSearch'

jest.mock('uuid', () => ({ v4: () => '00' }))

test('parseFromRsql', function () {
  const noGroup = [
    {
      groupId: 'base',
      groupLogicOperators: [LogicOperator.AND],
      elements: [
        {
          searchField: 'settlement-search',
          comparisonOperator: ComparisonOperator.EQ,
          searchTerm: 'Leipzig',
          id: '123',
        },
        {
          searchField: 'settlement-search',
          comparisonOperator: ComparisonOperator.NEQ,
          searchTerm: 'Muc',
          id: '2',
        },
      ],
    },
  ]
  const noGroupExpression =
    "settlement-search=='Leipzig';settlement-search!='Muc'"
  expect(getRsql(noGroup)).toStrictEqual(noGroupExpression)

  const nestedGroup = [
    {
      groupId: 'base',
      elements: [
        {
          groupId: '1243',
          groupLogicOperators: [LogicOperator.AND],
          elements: [
            {
              searchField: 'settlement-search',
              comparisonOperator: ComparisonOperator.EQ,
              searchTerm: 'Leipzig',
              id: '2',
            },
            {
              groupId: '156',
              groupLogicOperators: [LogicOperator.OR],
              elements: [
                {
                  searchField: 'settlement-search',
                  comparisonOperator: ComparisonOperator.EQ,
                  searchTerm: 'Muc',
                  id: '5',
                },
                {
                  searchField: 'settlement-search',
                  comparisonOperator: ComparisonOperator.EQ,
                  searchTerm: 'Berlin',
                  id: '7',
                },
              ],
            },
          ],
        },
        {
          searchField: 'settlement-search',
          comparisonOperator: ComparisonOperator.EQ,
          searchTerm: 'Leipzig',
          id: '123',
        },
      ],
      groupLogicOperators: [LogicOperator.OR],
    },
  ]
  const nestedExpression =
    "(settlement-search=='Leipzig';(settlement-search=='Muc',settlement-search=='Berlin')),settlement-search=='Leipzig'"

  expect(getRsql(nestedGroup)).toStrictEqual(nestedExpression)
})
