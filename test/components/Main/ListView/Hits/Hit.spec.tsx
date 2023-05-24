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
import { render } from '@testing-library/react'
import { TestProviders } from 'test/testutils/TestProviders'
import { hspObjectsByQueryOutput as result } from 'test/testutils/fixtures'
import { Hit } from 'src/components/Main/ListView/Hits/Hit'
import { Highlighting } from 'src/contexts/discovery'

function renderHit(withHighlighting: boolean) {
  return render(
    <TestProviders>
      <Hit
        variant="expanded"
        hspObjectGroup={result.payload[0]}
        highlighting={
          withHighlighting ? (result.metadata.highlighting as Highlighting) : {}
        }
      />
    </TestProviders>
  )
}

describe('<Hit/> with Highlighting', function () {
  it('renders key data and citations', function () {
    const { getByTestId } = renderHit(true)
    getByTestId('discovery-list-view-hits-key-data')
    getByTestId('discovery-list-view-hits-citations')
  })
})

describe('<Hit/> without Highlighting', function () {
  it('renders key data but not citations', function () {
    const { getByTestId, queryByTestId } = renderHit(false)
    getByTestId('discovery-list-view-hits-key-data')
    expect(queryByTestId('discovery-list-view-hits-citations')).toBeNull()
  })
})
