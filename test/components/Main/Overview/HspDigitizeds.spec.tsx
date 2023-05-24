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
import { render, screen, fireEvent } from '@testing-library/react'
import { TestProviders } from 'test/testutils'
import { HspDigitizeds } from 'src/components/Main/Overview/HspDigitizeds'
import { HspDigitized } from 'src/contexts/discovery'

const hspDigitizeds: HspDigitized[] = [
  {
    id: 'id-with-manifest',
    'digitization-date-display': null,
    'digitization-organization-display': 'UBL',
    'digitization-place-display': 'Leipzig',
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
    </TestProviders>
  )
}

describe('<HspDescriptions/>', function () {
  // ------------------------------------------------------
  it('has a digitizeds section', function () {
    renderHspDigized([hspDigitizeds[0]])

    expect(screen.getByLabelText('overview.digitalImages')).toHaveProperty(
      'id',
      'hsp-digitizeds'
    )
  })

  it('renders a FabButton which fires events and has white outline', function () {
    renderHspDigized([hspDigitizeds[0]])

    const fabButton = screen.getByRole('button', {
      name: 'resources.addDigitalImage',
    })
    expect(fabButton).toBeTruthy()

    expect(screen.getByRole('button').getAttribute('class')).toContain(
      'digitizedOutline'
    )
  })
})
