import { render } from '@testing-library/react'
import React from 'react'
import { TestProviders } from 'test/testutils/TestProviders'
import { hspObjectsByQueryOutput as result } from 'test/testutils/fixtures'

import { DirectResourceLinks } from 'src/components/shared/DirectResourceLinks'

function renderResourceInfo() {
  return render(
    <TestProviders>
      <DirectResourceLinks
        numOfDescriptions={result.payload[0].hspDescriptions.length}
        numOfDigitizeds={result.payload[0].hspDigitizeds.length}
        vertical={false}
        linkToDetailView={{
          pathname: '/',
          hash: '',
          search: 'hspobjectid=4711',
        }}
      />
    </TestProviders>,
  )
}

describe('<ResouceInfo />', function () {
  // ------------------------------------------------------
  it('has a link that points to the description section of the overview page', function () {
    const { getByRole } = renderResourceInfo()

    expect(
      getByRole('link', { name: 'overview.showManuscriptDescriptions' }),
    ).toHaveProperty(
      'href',
      'http://localhost/?hspobjectid=4711#hsp-descriptions',
    )
  })

  // ------------------------------------------------------
  it('has a link that points to the digitizeds section of the overview page', function () {
    const { getByRole } = renderResourceInfo()

    expect(
      getByRole('link', { name: 'overview.showDigitalImages' }),
    ).toHaveProperty(
      'href',
      'http://localhost/?hspobjectid=4711#hsp-digitizeds',
    )
  })
})
