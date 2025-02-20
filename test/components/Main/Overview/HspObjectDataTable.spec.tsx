import { render } from '@testing-library/react'
import React from 'react'
import { TestProviders, hspObjectByIdOutput } from 'test/testutils'

import { HspObjectDataTable } from 'src/components/Main/Overview/HspObjectDataTable'

describe('<HspObjectDataTable/>', function () {
  it('renders', function () {
    render(
      <TestProviders>
        <HspObjectDataTable hspObject={hspObjectByIdOutput.payload.hspObject} />
      </TestProviders>,
    )
  })
})
