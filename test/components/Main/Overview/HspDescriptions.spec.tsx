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
import { render, screen } from '@testing-library/react'
import { TestProviders } from 'test/testutils'
import { HspDescriptions } from 'src/components/Main/Overview/HspDescriptions'
import { HspDescription } from 'src/contexts/discovery'

describe('<HspDescriptions/>', function () {
  // ------------------------------------------------------
  it('has a description section', function () {
    render(
      <TestProviders>
        <HspDescriptions hspDescriptions={[]} />
      </TestProviders>
    )

    expect(
      screen.getByLabelText('overview.manuscriptDescriptions')
    ).toHaveProperty('id', 'hsp-descriptions')
  })

  it('displays descriptions sorted by date descending', function () {
    const template: HspDescription = {
      'catalog-id-display': null,
      'catalog-iiif-manifest-url-display': null,
      'catalog-iiif-manifest-range-url-display': null,
      'desc-author-display': null,
      'desc-publish-date-display': null,
      'dimensions-display': null,
      'format-display': null,
      'group-id': 'ID-1',
      'has-notation-display': null,
      id: 'REPLACE',
      'idno-display': 'idno',
      'illuminated-display': 'no',
      'language-display': null,
      'leaves-count-display': '328 Bll.',
      'material-display': [],
      'object-type-display': null,
      'orig-date-lang-display': [],
      'orig-place-display': [],
      'persistent-url-display': null,
      'repository-display': 'Repo',
      'settlement-display': 'Settlement',
      'status-display': null,
      'title-display': 'REPLACE',
      type: 'hsp:description',
    }
    const descriptions: HspDescription[] = [
      {
        ...template,
        id: 'HSP-desc-1',
        'title-display': 'Description 1',
      },
      {
        ...template,
        id: 'HSP-desc-2',
        'title-display': 'Description 2',
      },
      {
        ...template,
        'desc-publish-date-display': 2013,
        id: 'HSP-desc-3',
        'title-display': 'Description 3 - 2013',
      },
      {
        ...template,
        id: 'HSP-desc-4',
        'title-display': 'Description 4',
      },
      {
        ...template,
        id: 'HSP-desc-5',
        'desc-publish-date-display': 2016,
        'title-display': 'Description 5 - 2016',
      },
      {
        ...template,
        id: 'HSP-desc-6',
        'desc-publish-date-display': 2013,
        'title-display': 'Description 6 - 2013',
      },
      {
        ...template,
        id: 'HSP-desc-7',
        'catalog-iiif-manifest-url-display': 'example',
        'desc-publish-date-display': 2010,
        'title-display': 'Description 7 - 2010',
        type: 'hsp:description_retro',
      },
      {
        ...template,
        id: 'HSP-desc-8',
        'title-display': 'Description 8',
      },
    ]

    const { queryAllByText } = render(
      <TestProviders>
        <HspDescriptions hspDescriptions={descriptions} />
      </TestProviders>
    )

    const elements = queryAllByText(/Description \d/)
    expect(elements[0]?.textContent).toMatch('Description 5 - 2016')
    expect(elements[1]?.textContent).toMatch('Description 3 - 2013')
    expect(elements[2]?.textContent).toMatch('Description 6 - 2013')
    expect(elements[3]?.textContent).toMatch('Description 7 - 2010')
    expect(elements[4]?.textContent).toMatch('Description 1')
    expect(elements[5]?.textContent).toMatch('Description 2')
    expect(elements[6]?.textContent).toMatch('Description 4')
    expect(elements[7]?.textContent).toMatch('Description 8')
  })
})
