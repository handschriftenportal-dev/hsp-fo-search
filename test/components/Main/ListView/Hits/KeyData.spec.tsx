import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { TestProviders } from 'test/testutils/TestProviders'
import { hspObjectsByQueryOutput as result } from 'test/testutils/fixtures'
import { mockLocation } from 'test/testutils/mockLocation'

import { KeyData } from 'src/components/Main/ListView/Hits/KeyData'
import { ParsedParams, toSearchParams } from 'src/contexts/location'
import { defaultSearchGroupItem } from 'src/contexts/reducers/extendedSearchReducer'
import { mainState } from 'src/contexts/reducers/mainReducer'
import { makeStore } from 'src/contexts/state'

function renderKeyData(params?: ParsedParams) {
  const store = makeStore({
    main: {
      ...mainState,
      i18nConfig: {
        ...mainState.i18nConfig,
        disableTranslation: true,
      },
      location: {
        pathname: '/',
        hash: '',
        search: toSearchParams(params || {}),
      },
    },
    extendedSearch: { extendedSearchGroups: [defaultSearchGroupItem] },
  })

  return render(
    <TestProviders store={store}>
      <KeyData open={true} hspObjectGroup={result.payload[0]} />
    </TestProviders>,
  )
}

describe('<KeyData/>', function () {
  // ------------------------------------------------------
  it('headline is composed of "settlement", "repository", "idno"', function () {
    renderKeyData()

    screen.getByRole('heading', {
      name: 'Wolfenbüttel, Herzog August Bibliothek Wolfenbüttel, Cod. Guelf. 64 Weiss.',
    })
  })

  // ------------------------------------------------------
  it('headline is a link to the overview page of the hsp object', async function () {
    mockLocation()
    renderKeyData()

    fireEvent.click(screen.getByRole('heading', { name: /wolfenbüttel/i }))

    expect(window.location.href).toBe(
      'http://example.com/?hspobjectid=HSP-4b772fbc-9b9d-43df-bf8f-7e6c53364e36',
    )
  })

  // ------------------------------------------------------
  it('link to overview page contains the other query params if there any', function () {
    renderKeyData({
      q: 'foo',
      hl: true,
      qf: 'idno',
    })

    fireEvent.click(screen.getByRole('heading', { name: /wolfenbüttel/i }))

    expect(window.location.href).toBe(
      'http://example.com/?hspobjectid=HSP-4b772fbc-9b9d-43df-bf8f-7e6c53364e36&q=foo&hl=true&qf=idno',
    )
  })

  // ------------------------------------------------------
  it('renders title', function () {
    renderKeyData()
    screen.getByText('#title-display')
  })

  // ------------------------------------------------------
  it(`renders details that are composed of "object-type", "material",
    "leaves-count", "dimensions", "orig-place", "orig-date-lang"`, function () {
    renderKeyData()
    screen.getByText(/object-type-display/i)
    screen.getByText(/material-display/i)
    screen.getByText(/leaves-count-display/i)
    screen.getByText(/dimensions-display/i)
    screen.getByText(/orig-place-display/i)
    screen.getByText(/orig-date-lang-display/i)
  })

  // ------------------------------------------------------
  it('renders correct resource counts', function () {
    renderKeyData()
    expect(
      screen.getByRole('link', { name: 'overview.showManuscriptDescriptions' })
        .textContent,
    ).toMatch('2')

    expect(
      screen.getByRole('link', { name: 'overview.showDigitalImages' })
        .textContent,
    ).toMatch('0')
  })
})
