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
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { TestProviders } from 'test/testutils/TestProviders'
import { hspObjectsByQueryOutput as result } from 'test/testutils/fixtures'
import { mockLocation } from 'test/testutils/mockLocation'
import { KeyData } from 'src/components/Main/ListView/Hits/KeyData'
import { ParsedParams, createLocationStore, toSearchParams } from 'src/contexts/location'


function renderKeyData(params?: ParsedParams) {
  const locationStore = createLocationStore({
    path: '/',
    hash: '',
    params: toSearchParams(params || {})
  })

  return render(
    <TestProviders
      locationStore={locationStore}
    >
      <KeyData
        open={true}
        hspObjectGroup={result.payload[0]}
      />
    </TestProviders>
  )
}


describe('<KeyData/>', function() {
  // ------------------------------------------------------
  it('headline is composed of "settlement", "repository", "idno"', function() {
    renderKeyData()

    screen.getByRole('heading', {
      name: 'Wolfenbüttel, Herzog August Bibliothek Wolfenbüttel, Cod. Guelf. 64 Weiss.',
    })
  })

  // ------------------------------------------------------
  it('headline is a link to the overview page of the hsp object', async function() {
    mockLocation()
    renderKeyData()

    fireEvent.click(screen.getByRole('heading', { name: /wolfenbüttel/i }))

    expect(window.location.href)
      .toBe('http://example.com/?hspobjectid=HSP-4b772fbc-9b9d-43df-bf8f-7e6c53364e36')
  })

  // ------------------------------------------------------
  it('link to overview page contains the other query params if there any', function() {
    renderKeyData({
      q: 'foo',
      hl: true,
      qf: 'idno',
    })

    fireEvent.click(screen.getByRole('heading', { name: /wolfenbüttel/i }))

    expect(window.location.href)
      .toBe('http://example.com/?hspobjectid=HSP-4b772fbc-9b9d-43df-bf8f-7e6c53364e36&q=foo&hl=true&qf=idno')
  })

  // ------------------------------------------------------
  it('renders title', function() {
    renderKeyData()
    screen.getByText('#title-display')
  })

  // ------------------------------------------------------
  it(`renders details that are composed of "object-type", "material",
    "leaves-count", "dimensions", "orig-place", "orig-date-lang"`, function() {
    renderKeyData()
    screen.getByText(/object-type-display/i)
    screen.getByText(/material-display/i)
    screen.getByText(/leaves-count-display/i)
    screen.getByText(/dimensions-display/i)
    screen.getByText(/orig-place-display/i)
    screen.getByText(/orig-date-lang-display/i)
  })

  // ------------------------------------------------------
  it('renders correct resource counts', function() {
    renderKeyData()
    expect(
      screen.getByRole('link', { name: 'overview.showManuscriptDescriptions' }).textContent
    ).toMatch('2')

    expect(
      screen.getByRole('link', { name: 'overview.showDigitalImages' }).textContent
    ).toMatch('0')
  })
})
