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
import { render, screen, fireEvent } from '@testing-library/react'
import { TestProviders, hspObjectsByQueryOutput as result } from 'test/testutils'
import { Highlighting } from 'src/contexts/discovery'
import { Citations } from 'src/components/Main/ListView/Hits/Citations'


test('<Citations />', function() {
  render(
    <TestProviders>
      <Citations
        open={false}
        hspObjectGroup={result.payload[0]}
        highlighting={result.metadata.highlighting as Highlighting}
      />
    </TestProviders>
  )

  // Initially the citation card is collapsed so we expect the text content to be invisilbe.
  expect(screen.getAllByText(/Wolfenbüttel/i)[0]).not.toBeVisible()

  // Then we open the card
  fireEvent.click(screen.getByRole('button', { name: /hit\.showResultContext/i }))

  // Now we should see the text content
  expect(screen.getAllByText(/Wolfenbüttel/i)[0]).toBeVisible()
})
