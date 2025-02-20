import { render } from '@testing-library/react'
import React from 'react'
import { TestProviders } from 'test/testutils'

import { ListFilter } from 'src/components/Main/ListView/Filters/ListFilter'

type Options = Record<string, number>
interface Params {
  className?: string
  filterName: string
  isBool?: boolean
  options: Options
  selected: (string | boolean)[]
  onChange: (selected: (string | boolean)[]) => void
  sort?: 'alpha'
}

describe('<ListFilter />', function () {
  function renderListFilter(params: Params) {
    const { filterName, isBool, options, selected, onChange } = params

    return render(
      <TestProviders>
        <ListFilter
          isBool={isBool}
          filterName={filterName}
          options={options}
          selected={selected}
          onChange={onChange}
        />
      </TestProviders>,
    )
  }

  it('renders <ListFilter /> correctly when type ist boolean-list', async function () {
    const options = {
      filterName: 'test',
      isBool: true,
      options: { true: 5 },
      selected: [],
      onChange: () => {},
    }
    const { getByDisplayValue } = renderListFilter(options)
    getByDisplayValue('true')
  })
})
