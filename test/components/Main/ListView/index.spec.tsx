import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { TestProviders } from 'test/testutils/TestProviders'
import { hspObjectsByQueryOutput } from 'test/testutils/fixtures'
import 'test/testutils/matchMedia'

import { ListView } from 'src/components/Main/ListView'
import { useHspObjectsByQuery } from 'src/contexts/discovery'
import { toSearchParams } from 'src/contexts/location'
import { defaultSearchGroupItem } from 'src/contexts/reducers/extendedSearchReducer'
import { mainState } from 'src/contexts/reducers/mainReducer'
import { makeStore } from 'src/contexts/state'

// tracking
// import * as tracking from 'src/app/tracking'

jest.mock('src/contexts/discovery')
const useHspObjectsByQueryMock = useHspObjectsByQuery as unknown as jest.Mock

function renderListView() {
  return render(
    <TestProviders
      store={makeStore({
        main: {
          ...mainState,
          i18nConfig: {
            ...mainState.i18nConfig,
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
        },
        extendedSearch: { extendedSearchGroups: [defaultSearchGroupItem] },
      })}
    >
      <ListView />
    </TestProviders>,
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
