/*
 * MIT License
 *
 * Copyright (c) 2021 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import React from 'react'
import { fireEvent, render, wait, screen } from '@testing-library/react'
import { TestProviders } from 'test/testutils'
import { HspDigitized } from 'src/contexts/discovery'
import { Thumbnails } from 'src/components/Main/ListView/Hits/Thumbnails'


const hspDigitizeds: HspDigitized[] = [
  {
    'id': 'id-with-manifest',
    'digitization-date-display': null,
    'digitization-organization-display': 'UBL',
    'digitization-place-display': 'Leipzig',
    'external-uri-display': null,
    'issuing-date-display': null,
    'group-id': 'group-id-1',
    'manifest-uri-display': 'http://example.com/iiif/1',
    'subtype-display': 'komplettVomOriginal',
    'thumbnail-uri-display': 'http://example.com/images/1.jpg',
    'type': 'hsp:digitized',
  },
  {
    'id': 'id-without-thumbnail',
    'digitization-date-display': null,
    'digitization-organization-display': 'UBL',
    'digitization-place-display': 'Leipzig',
    'external-uri-display': null,
    'issuing-date-display': null,
    'group-id': 'group-id-1',
    'manifest-uri-display': 'http://example.com/iiif/2',
    'subtype-display': 'komplettVomOriginal',
    'thumbnail-uri-display': null,
    'type': 'hsp:digitized',
  },
  {
    'id': 'id-with-external',
    'digitization-date-display': null,
    'digitization-organization-display': 'UBL',
    'digitization-place-display': 'Leipzig',
    'external-uri-display': 'http://example.com/gallery/3',
    'issuing-date-display': null,
    'group-id': 'group-id-1',
    'manifest-uri-display': null,
    'subtype-display': 'komplettVomOriginal',
    'thumbnail-uri-display': 'http://example.com/images/3.jpg',
    'type': 'hsp:digitized',
  },
  {
    'id': 'id-without-uris',
    'digitization-date-display': null,
    'digitization-organization-display': 'UBL',
    'digitization-place-display': 'Leipzig',
    'external-uri-display': null,
    'issuing-date-display': null,
    'group-id': 'group-id-1',
    'manifest-uri-display': null,
    'subtype-display': 'komplettVomOriginal',
    'thumbnail-uri-display': 'http://example.com/images/4.jpg',
    'type': 'hsp:digitized',
  },
]

function renderThumbnails(digis: HspDigitized[]) {
  return render(
    <TestProviders>
      <Thumbnails hspDigitizeds={digis} />
    </TestProviders>
  )
}

describe('<Thumbnails />', function() {
  it('filters out HspDigitizeds without thumbnails', function() {
    render(
      <TestProviders>
        <Thumbnails hspDigitizeds={hspDigitizeds} />
      </TestProviders>
    )

    expect(screen.getAllByRole('tab').length).toBe(3)
  })

  it(`if the resource has an manifest uri a click on the thumbnail
    fires openResourceClicked event`, function(done) {

    const target = new EventTarget()

    target.addEventListener('openResourceClicked', e => {
      expect((e as any).detail).toEqual({
        type: 'iiif:manifest',
        id: 'http://example.com/iiif/1',
      })
      done()
    })

    render(
      <TestProviders eventTarget={target}>
        <Thumbnails hspDigitizeds={[hspDigitizeds[0]]} />
      </TestProviders>
    )

    const thumbnailButton = screen.getByRole('button', { name: 'resources.openManifestInWorkarea' })
    fireEvent.click(thumbnailButton)
  })

  it('renders link to external resources', function() {
    render(
      <TestProviders>
        <Thumbnails hspDigitizeds={[hspDigitizeds[2]]} />
      </TestProviders>
    )

    const a = screen.getByRole('link')
    expect(a).toHaveProperty('href', 'http://example.com/gallery/3')
  })
})


