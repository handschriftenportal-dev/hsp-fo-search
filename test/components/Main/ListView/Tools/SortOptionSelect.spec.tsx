import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { mockLocation } from 'test/testutils'
import { TestProviders } from 'test/testutils/TestProviders'

import { SortOptionSelect } from 'src/components/Main/ListView/Tools/SortOptionSelect'

function renderSortOptionSelect() {
  return render(
    <TestProviders>
      <SortOptionSelect />
    </TestProviders>,
  )
}

describe('<SortOptionSelect/>', () => {
  it('renders sort option select box', () => {
    renderSortOptionSelect()
    expect(
      screen.getByRole('combobox', { name: 'sortOptionName' }),
    ).toBeVisible()
  })

  it('includes all sort options', () => {
    renderSortOptionSelect()
    expect(
      screen.getByRole('option', { name: /sortOptions\.scoreDesc/i }),
    ).toHaveValue('score-desc')
    expect(
      screen.getByRole('option', { name: /sortOptions\.msIdentifierAsc/i }),
    ).toHaveValue('ms-identifier-asc')
    expect(
      screen.getByRole('option', { name: /sortOptions\.msIdentifierDesc/i }),
    ).toHaveValue('ms-identifier-desc')
    expect(
      screen.getByRole('option', { name: /sortOptions\.origDateAsc/i }),
    ).toHaveValue('orig-date-asc')
    expect(
      screen.getByRole('option', { name: /sortOptions\.origDateDesc/i }),
    ).toHaveValue('orig-date-desc')
  })

  it('requests ordered list when selecting valid sort option', () => {
    const sortOption = 'ms-identifier-asc'
    mockLocation()
    renderSortOptionSelect()

    fireEvent.change(screen.getByRole('combobox', { name: 'sortOptionName' }), {
      target: { value: sortOption },
    })

    expect(window.location.href).toBe(`http://example.com/?sort=${sortOption}`)
  })
})
