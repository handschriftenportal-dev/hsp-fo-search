import { fireEvent, render, screen } from '@testing-library/react'
import { hspTheme } from 'hsp-web-module'
import React from 'react'
import { mockLocation } from 'test/testutils'
import { TestProviders } from 'test/testutils/TestProviders'
import { createMatchMedia } from 'test/testutils/matchMedia'

import { SearchBar } from 'src/components/SearchBar'

function renderSearchBar() {
  return render(
    <TestProviders>
      <SearchBar />
    </TestProviders>,
  )
}

describe('<SearchBar/>', () => {
  beforeEach(() => {
    mockLocation()
    // set screen size to sm
    ;(window as any).matchMedia = createMatchMedia(
      hspTheme.breakpoints?.values?.sm as number,
    )
  })

  it('should add empty filter object if no search query is entered', () => {
    renderSearchBar()

    fireEvent.click(
      screen.getByRole('button', { name: /searchBar\.searchButton/i }),
    )

    expect(window.location.href).toBe('http://example.com/?hl=true&fq=%7B%7D')
  })

  it('should trigger the correct "all field search" URL if no search field is selected', () => {
    renderSearchBar()

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'elephant' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: /searchBar\.searchButton/i }),
    )

    expect(window.location.href).toBe('http://example.com/?q=elephant&hl=true')
  })

  // TODO: There is some trouble with Material-UI Select Component and event bubbling
  xit('should trigger the correct search URL for the selected search field', () => {
    renderSearchBar()

    const select = screen.getByRole('combobox', {
      name: /searchBar\.searchFieldSelection/i,
    })
    fireEvent.change(select, { target: { value: 'animals' } })

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'frog' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: /searchBar\.searchButton/i }),
    )

    expect(window.location.href).toBe(
      'http://example.com/?q=frog&hl=true&qf=animals',
    )
  })

  it('should work when hitting enter in the search box', () => {
    renderSearchBar()

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'elephant' },
    })

    fireEvent.keyDown(screen.getByRole('textbox'), { code: 13, key: 'Enter' })

    expect(window.location.href).toBe('http://example.com/?q=elephant&hl=true')
  })

  it('should have a special className for extended search button and select', async () => {
    renderSearchBar()

    screen.getByRole('button', { name: /extendedSearch.extendedSearch/i })

    const searchSelect = await screen.getByLabelText(
      'searchBar.searchFieldSelection',
    ).parentElement
    expect(searchSelect?.getAttribute('class')).toMatch(/searchSelect/gi)
  })
})
