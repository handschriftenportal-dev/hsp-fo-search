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

import React, { FC } from 'react'
import ReactDom, { createPortal } from 'react-dom'
import { UnitContainers, Unit } from './units'
import { Providers, Props as ProviderProps } from './Providers'
import { Main } from '../components/Main'
import { SearchBar } from '../components/SearchBar'
import { OverviewNavigation } from '../components/OverviewNavigation'
import { SearchBarOrOverviewNavigation } from '../components/SearchBarOrOverviewNavigation'

const components: Record<Unit, FC<any>> = {
  main: Main,
  searchBar: SearchBar,
  overviewNavigation: OverviewNavigation,
  searchBarOrOverviewNavigation: SearchBarOrOverviewNavigation,
}

function splitUnits(containers: UnitContainers) {
  const units = Object.keys(containers) as Unit[]

  if (units.length === 0) {
    throw new Error('mount(): unit container was empty.')
  }

  return {
    nonPortalUnit: units[0],
    portalUnits: units.slice(1),
  }
}

export function mount(props: ProviderProps) {
  const { nonPortalUnit, portalUnits } = splitUnits(props.containers)
  const NonPortalComponent = components[nonPortalUnit]

  ReactDom.render(
    <Providers {...props}>
      <div id="hsp-search-root">
        {portalUnits.map((unit) => {
          const Component = components[unit]
          const container = props.containers[unit] as HTMLElement
          return createPortal(<Component />, container)
        })}
        <NonPortalComponent />
      </div>
    </Providers>,
    props.containers[nonPortalUnit] as HTMLElement
  )
}

export function unmount(containers: UnitContainers) {
  const { nonPortalUnit } = splitUnits(containers)
  return ReactDom.unmountComponentAtNode(
    containers[nonPortalUnit] as HTMLElement
  )
}
