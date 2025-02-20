import { render } from '@testing-library/react'
import React from 'react'
import { TestProviders } from 'test/testutils/TestProviders'
import { hspObjectsByQueryOutput as result } from 'test/testutils/fixtures'

import { Hit } from 'src/components/Main/ListView/Hits/Hit'
import { Highlighting } from 'src/contexts/discovery'

function renderHit(withHighlighting: boolean) {
  return render(
    <TestProviders>
      <Hit
        variant="expanded"
        hspObjectGroup={result.payload[0]}
        highlighting={
          withHighlighting ? (result.metadata.highlighting as Highlighting) : {}
        }
      />
    </TestProviders>,
  )
}

describe('<Hit/> with Highlighting', function () {
  it('renders key data and citations', function () {
    const { getByTestId } = renderHit(true)
    getByTestId('discovery-list-view-hits-key-data')
    getByTestId('discovery-list-view-hits-citations')
  })
})

describe('<Hit/> without Highlighting', function () {
  it('renders key data but not citations', function () {
    const { getByTestId, queryByTestId } = renderHit(false)
    getByTestId('discovery-list-view-hits-key-data')
    expect(queryByTestId('discovery-list-view-hits-citations')).toBeNull()
  })
})
