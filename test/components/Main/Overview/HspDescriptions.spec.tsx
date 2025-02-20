import { render, screen } from '@testing-library/react'
import React from 'react'
import { TestProviders } from 'test/testutils'

import { HspDescriptions } from 'src/components/Main/Overview/HspDescriptions'
import { HspDescription } from 'src/contexts/discovery'

describe('<HspDescriptions/>', function () {
  // ------------------------------------------------------
  it('has a description section', function () {
    render(
      <TestProviders>
        <HspDescriptions hspDescriptions={[]} />
      </TestProviders>,
    )

    expect(
      screen.getByLabelText('overview.manuscriptDescriptions'),
    ).toHaveProperty('id', 'hsp-descriptions')
  })

  it('displays descriptions sorted by date descending', function () {
    const template: HspDescription = {
      'catalog-id-display': null,
      'catalog-iiif-manifest-url-display': null,
      'catalog-iiif-manifest-range-url-display': null,
      'author-display': null,
      'publish-year-display': null,
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
        'publish-year-display': 2013,
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
        'publish-year-display': 2016,
        'title-display': 'Description 5 - 2016',
      },
      {
        ...template,
        id: 'HSP-desc-6',
        'publish-year-display': 2013,
        'title-display': 'Description 6 - 2013',
      },
      {
        ...template,
        id: 'HSP-desc-7',
        'catalog-iiif-manifest-url-display': 'example',
        'publish-year-display': 2010,
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
      </TestProviders>,
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
