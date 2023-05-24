/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import React from 'react'
import { render } from '@testing-library/react'
import { TestProviders } from 'test/testutils'
import { ListFilter } from 'src/components/Main/ListView/Filters/ListFilter'

interface Params {
  filterName: string
  isBool: boolean
  options: Record<string, number>
  selected: string[]
  onChange: (selected: string[]) => void
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
      </TestProviders>
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
