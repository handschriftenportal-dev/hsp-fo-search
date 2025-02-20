import { render, screen } from '@testing-library/react'
import React from 'react'
import { TestProviders } from 'test/testutils'

import { HspDigitizeds } from 'src/components/Main/Overview/HspDigitizeds'
import { HspDigitized } from 'src/contexts/discovery'

const hspDigitizeds: HspDigitized[] = [
  {
    id: 'id-with-manifest',
    'digitization-date-display': null,
    'digitization-institution-display': 'UBL',
    'digitization-settlement-display': 'Leipzig',
    'external-uri-display': null,
    'issuing-date-display': null,
    'group-id': 'group-id-1',
    'manifest-uri-display': 'http://example.com/iiif/1',
    'subtype-display': 'komplettVomOriginal',
    'thumbnail-uri-display': 'http://example.com/images/1.jpg',
    type: 'hsp:digitized',
  },
]

function renderHspDigized(digis: HspDigitized[]) {
  return render(
    <TestProviders>
      <HspDigitizeds hspDigitizeds={digis} />
    </TestProviders>,
  )
}

describe('<HspDescriptions/>', function () {
  // ------------------------------------------------------
  it('has a digitizeds section', function () {
    renderHspDigized([hspDigitizeds[0]])

    expect(screen.getByLabelText('overview.digitalImages')).toHaveProperty(
      'id',
      'hsp-digitizeds',
    )
  })

  it('renders a FabButton which fires events and has white outline', function () {
    renderHspDigized([hspDigitizeds[0]])

    const fabButton = screen.getByRole('button', {
      name: 'resources.addDigitalImage',
    })
    expect(fabButton).toBeTruthy()

    expect(screen.getByRole('button').getAttribute('class')).toContain(
      'digitizedOutline',
    )
  })
})
