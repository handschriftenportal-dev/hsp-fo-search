import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import {
  TestProviders,
  hspObjectsByQueryOutput as result,
} from 'test/testutils'

import { Citations } from 'src/components/Main/ListView/Hits/Citations'
import { Highlighting } from 'src/contexts/discovery'

test('<Citations />', function () {
  render(
    <TestProviders>
      <Citations
        open={false}
        hspObjectGroup={result.payload[0]}
        highlighting={result.metadata.highlighting as Highlighting}
      />
    </TestProviders>,
  )

  // Initially the citation card is collapsed so we expect the text content to be invisilbe.
  expect(screen.getAllByText(/Wolfenbüttel/i)[0]).not.toBeVisible()

  // Then we open the card
  fireEvent.click(
    screen.getByRole('button', { name: /hit\.showResultContext/i }),
  )

  // Now we should see the text content
  expect(screen.getAllByText(/Wolfenbüttel/i)[0]).toBeVisible()
})
