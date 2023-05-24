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
import { render, fireEvent, screen } from '@testing-library/react'
import { createMatchMedia } from 'test/testutils/matchMedia'
import { TestProviders } from 'test/testutils/TestProviders'
import { hspTheme } from 'hsp-web-module'
import { SearchBar } from 'src/components/SearchBar'
import { mockLocation } from 'test/testutils'
import '@testing-library/jest-dom'

function renderSearchBar() {
  return render(
    <TestProviders>
      <SearchBar />
    </TestProviders>
  )
}

describe('<SearchBar/>', function () {
  beforeEach(() => {
    mockLocation()
    // set screen size to sm
    ;(window as any).matchMedia = createMatchMedia(
      hspTheme.breakpoints?.values?.sm as number
    )
  })

  // ------------------------------------------------------
  it('if no search field is selected then trigger the correct "all field search" url', function () {
    renderSearchBar()

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'elephant' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: /searchBar\.searchButton/i })
    )

    expect(window.location.href).toBe('http://example.com/?q=elephant&hl=true')
  })

  // ------------------------------------------------------
  // There is some trouble with Material-UI Select Component and event bubbling
  /* it('if a search field is selected trigger the correct search url for that field', function() {
    renderSearchBar()

    const select = screen.getByRole('combobox', { name: /searchBar\.searchFieldSelection/i })
    fireEvent.change(select, { target: { value: 'animals' } })

    fireEvent.change(
      screen.getByRole('searchbox'),
      { target: { value: 'frog' } }
    )

    fireEvent.click(
      screen.getByRole('button', { name: /searchBar\.searchButton/i }))

    expect(window.location.href)
      .toBe('http://example.com/?q=frog&hl=true&qf=animals')
  }) */

  // ------------------------------------------------------
  it('hit enter in the search box works as well', function () {
    renderSearchBar()

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'elephant' },
    })

    fireEvent.keyDown(screen.getByRole('textbox'), { code: 13, key: 'Enter' })

    expect(window.location.href).toBe('http://example.com/?q=elephant&hl=true')
  })
})

it('Advanced search button and select has a special className', async function () {
  renderSearchBar()

  screen.getByRole('button', { name: /searchBar.advancedButton/i })

  const advancedButton = await screen.getByRole('button', {
    name: /searchBar.advancedButton/i,
  })
  expect(advancedButton).toHaveClass('searchAdvBtn')

  const searchSelect = await screen.getByLabelText(
    'searchBar.searchFieldSelection'
  ).parentElement
  expect(searchSelect).toHaveClass('searchSelect')
})
