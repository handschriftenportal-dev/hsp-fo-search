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
import { render, waitFor } from '@testing-library/react'
import { TestProviders } from 'test/testutils/TestProviders'
import { hspObjectsByQueryOutput } from 'test/testutils/fixtures'
import { useHspObjectsByQuery } from 'src/contexts/discovery'
import { toSearchParams } from 'src/contexts/location'
import { makeStore, defaultState } from 'src/contexts/state'
import { ListView } from 'src/components/Main/ListView'
import 'test/testutils/matchMedia.ts'

// tracking
// import * as tracking from 'src/app/tracking'

jest.mock('src/contexts/discovery')
const useHspObjectsByQueryMock = useHspObjectsByQuery as unknown as jest.Mock

function renderListView() {
  return render(
    <TestProviders
      store={makeStore({
        ...defaultState,
        i18nConfig: {
          ...defaultState.i18nConfig,
          disableTranslation: true,
        },
        location: {
          pathname: '/',
          hash: '',
          search: toSearchParams({
            q: 'foo',
            fq: {
              theFacet: ['bubu', 'kiki'],
            },
          }),
        },
      })}
    >
      <ListView />
    </TestProviders>
  )
}

describe('<ListView/>', function () {
  // ------------------------------------------------------
  it('calls useHspObjectsByQuery with the query object from state', async function () {
    useHspObjectsByQueryMock.mockReset()
    useHspObjectsByQueryMock.mockImplementation(() => {
      return { data: undefined, error: null, isIdle: false }
    })
    renderListView()
    expect(useHspObjectsByQueryMock).toHaveBeenCalledWith({
      q: 'foo',
      fq: {
        theFacet: ['bubu', 'kiki'],
      },
    })
  })

  // ------------------------------------------------------
  it('renders message if fetching is disabled (idIdle) for some reason', async function () {
    useHspObjectsByQueryMock.mockReset()
    useHspObjectsByQueryMock.mockImplementation(() => {
      return { data: undefined, error: null, isIdle: true }
    })
    const { getByText } = renderListView()
    getByText('enterSearchTerm')
  })

  // ------------------------------------------------------
  it('renders message if there was an error while fetching', async function () {
    useHspObjectsByQueryMock.mockReset()
    useHspObjectsByQueryMock.mockImplementation(() => {
      return { data: undefined, error: new Error(), isIdle: false }
    })
    const { getByText } = renderListView()
    getByText('searchFailed')
  })

  // ------------------------------------------------------
  it('renders message if still loading', async function () {
    useHspObjectsByQueryMock.mockReset()
    useHspObjectsByQueryMock.mockImplementation(() => {
      return { data: undefined, error: null, isIdle: false }
    })
    const { getByText } = renderListView()
    getByText('loading')
  })

  // ------------------------------------------------------
  it('renders filters, active filter, tool bar and hits if request was successful', async function () {
    useHspObjectsByQueryMock.mockReset()
    useHspObjectsByQueryMock.mockImplementation(() => {
      return { data: hspObjectsByQueryOutput, error: null, isIdle: false }
    })

    const { getByTestId, getByRole } = renderListView()

    await waitFor(() => {
      getByTestId('discovery-list-view-filters')
      getByTestId('discovery-list-view-tools')
      getByRole('list', { name: 'searchResults' })
      getByTestId('discovery-list-view-active-filters')
    })
  })

  // tracking
  /* it('calls useSiteSearchTracking hook', function() {
    jest.spyOn(tracking, 'useSiteSearchTracking')
    jest.spyOn(tracking, 'useRouteTracking')
    renderListView()
    expect(tracking.useSiteSearchTracking).toHaveBeenCalledWith('Search')
    expect(tracking.useRouteTracking).toHaveBeenCalledWith('Search')
  }) */
})
