export type Unit =
  | 'main'
  | 'searchBar'
  | 'overviewNavigation'
  | 'searchBarOrOverviewNavigation'

export type UnitContainers = Partial<Record<Unit, HTMLElement>>
