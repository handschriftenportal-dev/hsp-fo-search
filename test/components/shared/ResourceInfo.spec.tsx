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
import { TestProviders } from 'test/testutils/TestProviders'
import { hspObjectsByQueryOutput as result } from 'test/testutils/fixtures'
import { ResourceInfo } from 'src/components/shared/ResourceInfo'

function renderResourceInfo() {
  return render(
    <TestProviders>
      <ResourceInfo
        numOfDescriptions={result.payload[0].hspDescriptions.length}
        numOfDigitizeds={result.payload[0].hspDigitizeds.length}
        vertical={false}
        linkToDetailView={{
          pathname: '/',
          hash: '',
          search: 'hspobjectid=4711',
        }}
      />
    </TestProviders>
  )
}

describe('<ResouceInfo />', function () {
  // ------------------------------------------------------
  it('has a link that points to the description section of the overview page', function () {
    const { getByRole } = renderResourceInfo()

    expect(
      getByRole('link', { name: 'overview.showManuscriptDescriptions' })
    ).toHaveProperty(
      'href',
      'http://localhost/?hspobjectid=4711#hsp-descriptions'
    )
  })

  // ------------------------------------------------------
  it('has a link that points to the digitizeds section of the overview page', function () {
    const { getByRole } = renderResourceInfo()

    expect(
      getByRole('link', { name: 'overview.showDigitalImages' })
    ).toHaveProperty(
      'href',
      'http://localhost/?hspobjectid=4711#hsp-digitizeds'
    )
  })
})
