import { render, screen, within } from '@testing-library/react'
import React from 'react'
import { TestProviders } from 'test/testutils/TestProviders'
import { hspObjectsByQueryOutput } from 'test/testutils/fixtures'

import { Hits } from 'src/components/Main/ListView/Hits'

function renderHits() {
  return render(
    <TestProviders>
      <Hits result={hspObjectsByQueryOutput} />
    </TestProviders>,
  )
}

describe('<Hits/>', function () {
  // ------------------------------------------------------
  it('renders a hit element for each group in search results', function () {
    renderHits()
    const hits = screen.getByRole('list', { name: 'searchResults' })
    within(hits).getAllByText(/Cod. Guelf. 64 Weiss./i)
    within(hits).getAllByText(/Cod. Guelf. 81 Weiss./i)
  })
})
