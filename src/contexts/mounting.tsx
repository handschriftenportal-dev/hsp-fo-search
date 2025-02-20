import React, { FC } from 'react'
import ReactDom, { createPortal } from 'react-dom'

import { Main } from '../components/Main'
import { OverviewNavigation } from '../components/OverviewNavigation'
import { SearchBar } from '../components/SearchBar'
import { SearchBarOrOverviewNavigation } from '../components/SearchBarOrOverviewNavigation'
import { Props as ProviderProps, Providers } from './Providers'
import { Unit, UnitContainers } from './units'

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
    props.containers[nonPortalUnit] as HTMLElement,
  )
}

export function unmount(containers: UnitContainers) {
  const { nonPortalUnit } = splitUnits(containers)
  return ReactDom.unmountComponentAtNode(
    containers[nonPortalUnit] as HTMLElement,
  )
}
