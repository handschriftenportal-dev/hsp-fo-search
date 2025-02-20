import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { TestProviders } from 'test/testutils'

import { Thumbnails } from 'src/components/Main/ListView/Hits/Thumbnails'
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
  {
    id: 'id-without-thumbnail',
    'digitization-date-display': null,
    'digitization-institution-display': 'UBL',
    'digitization-settlement-display': 'Leipzig',
    'external-uri-display': null,
    'issuing-date-display': null,
    'group-id': 'group-id-1',
    'manifest-uri-display': 'http://example.com/iiif/2',
    'subtype-display': 'komplettVomOriginal',
    'thumbnail-uri-display': null,
    type: 'hsp:digitized',
  },
  {
    id: 'id-with-external',
    'digitization-date-display': null,
    'digitization-institution-display': 'UBL',
    'digitization-settlement-display': 'Leipzig',
    'external-uri-display': 'http://example.com/gallery/3',
    'issuing-date-display': null,
    'group-id': 'group-id-1',
    'manifest-uri-display': null,
    'subtype-display': 'komplettVomOriginal',
    'thumbnail-uri-display': 'http://example.com/images/3.jpg',
    type: 'hsp:digitized',
  },
  {
    id: 'id-without-uris',
    'digitization-date-display': null,
    'digitization-institution-display': 'UBL',
    'digitization-settlement-display': 'Leipzig',
    'external-uri-display': null,
    'issuing-date-display': null,
    'group-id': 'group-id-1',
    'manifest-uri-display': null,
    'subtype-display': 'komplettVomOriginal',
    'thumbnail-uri-display': 'http://example.com/images/4.jpg',
    type: 'hsp:digitized',
  },
]

function renderThumbnails(digis: HspDigitized[], target?: EventTarget) {
  return render(
    <TestProviders eventTarget={target}>
      <Thumbnails hspDigitizeds={digis} />
    </TestProviders>,
  )
}

describe('<Thumbnails />', function () {
  it('filters out HspDigitizeds without thumbnails', function () {
    renderThumbnails(hspDigitizeds)

    expect(screen.getAllByRole('tab').length).toBe(3)
  })

  it(`if the resource has an manifest uri a click on the thumbnail
    fires openResourceClicked event`, function (done) {
    const target = new EventTarget()

    target.addEventListener('openResourceClicked', (e) => {
      expect((e as any).detail).toEqual({
        type: 'iiif:manifest',
        id: 'http://example.com/iiif/1',
      })
      done()
    })

    renderThumbnails([hspDigitizeds[0]], target)

    const thumbnailButton = screen.getByRole('button', {
      name: 'resources.openManifestInWorkarea',
    })
    fireEvent.click(thumbnailButton)
  })

  it('renders link to external resources', function () {
    renderThumbnails([hspDigitizeds[2]])

    const a = screen.getByRole('link')
    expect(a).toHaveProperty('href', 'http://example.com/gallery/3')
  })

  it('Thumbnails have a FabButton and fire event to add digitized image to workspace', function (done) {
    const target = new EventTarget()

    target.addEventListener('selectResourceClicked', (e) => {
      expect((e as any).detail).toEqual({
        type: 'iiif:manifest',
        id: 'http://example.com/iiif/1',
      })
      done()
    })

    renderThumbnails([hspDigitizeds[0]], target)

    const fabButton = screen.getByRole('button', {
      name: 'resources.addDigitalImage',
    })
    expect(fabButton).toBeTruthy()
    fireEvent.click(fabButton)
  })
})
