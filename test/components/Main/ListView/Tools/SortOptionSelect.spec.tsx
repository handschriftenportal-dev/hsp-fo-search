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
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen } from '@testing-library/react'
import { TestProviders } from 'test/testutils/TestProviders'
import { SortOptionSelect } from 'src/components/Main/ListView/Tools/SortOptionSelect'
import { mockLocation } from 'test/testutils'

function renderSortOptionSelect() {
  return render(
    <TestProviders>
      <SortOptionSelect />
    </TestProviders>
  )
}

describe('<SortOptionSelect/>', function() {
  it('has sort option select box', function() {
    renderSortOptionSelect()
    expect(screen.getByRole('combobox', { name: 'sortOptionName' })).toBeVisible()
  })

  it('includes all sort options', function() {
    renderSortOptionSelect()
    expect(screen.getByRole('option', { name: /sortOptions\.scoreDesc/i })).toHaveValue('score-desc')
    expect(screen.getByRole('option', { name: /sortOptions\.msIdentifierAsc/i })).toHaveValue('ms-identifier-asc')
    expect(screen.getByRole('option', { name: /sortOptions\.msIdentifierDesc/i })).toHaveValue('ms-identifier-desc')
    expect(screen.getByRole('option', { name: /sortOptions\.origDateAsc/i })).toHaveValue('orig-date-asc')
    expect(screen.getByRole('option', { name: /sortOptions\.origDateDesc/i })).toHaveValue('orig-date-desc')
  })

  it('requests ordered list when selecting valid sort option', function() {
    const sortOption = 'ms-identifier-asc'
    mockLocation()
    renderSortOptionSelect()
    fireEvent.change(
      screen.getByRole('combobox', { name: 'sortOptionName' }),
      { target: { value: sortOption } }
    )

    expect(window.location.href)
      .toBe('http://example.com/?sort=' + sortOption)
  })
})
