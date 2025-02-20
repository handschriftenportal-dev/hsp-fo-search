import React from 'react'

import * as config from 'src/components/config'
import { Facets, Stats } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'
import { FilterQuery, RangeFilterData } from 'src/contexts/location'

import { ListFilter } from './ListFilter'
import { RangeFilter } from './RangeFilter'

interface Props {
  className?: string
  filterQuery: FilterQuery
  filterName: string
  facets: Facets
  stats: Stats
  onChange: (selected: FilterQuery[keyof FilterQuery]) => void
}

export function Filter(props: Props) {
  const { filterName, className, facets, stats, filterQuery, onChange } = props
  const filterType = config.filterTypes[filterName]
  const { t } = useTranslation()
  const isList = filterType === 'list' || filterType === 'boolean-list'

  // //////////////////////////////////////////////////////
  // Assemble List Filter
  // //////////////////////////////////////////////////////

  if (isList) {
    const options = facets[filterName]

    if (!options || options.length === 0) {
      return <span>{t('filterPanel', 'noData')}</span>
    }

    return (
      <ListFilter
        className={className}
        filterName={filterName}
        isBool={filterType === 'boolean-list'}
        options={options}
        selected={(filterQuery[filterName] as string[]) || []}
        onChange={onChange}
      />
    )
  }

  // //////////////////////////////////////////////////////
  // Assemble Range Filter
  // //////////////////////////////////////////////////////

  if (filterType === 'range') {
    const isOrigDateFilter = filterName === 'orig-date-facet'
    let minmax = [stats[filterName]?.min, stats[filterName]?.max]
    // TODO: add back missingCount when data is in facet info, instead of stats
    // let missingCount = stats[filterName]?.missing
    if (isOrigDateFilter) {
      minmax = [
        stats['orig-date-from-facet']?.min,
        stats['orig-date-to-facet']?.max,
      ]
      // missingCount = Math.min(
      //   stats['orig-date-from-facet']?.missing,
      //   stats['orig-date-to-facet']?.missing
      // )
    }

    let options = minmax.every((x) => typeof x === 'number')
      ? (minmax as [number, number])
      : undefined

    if (!options) {
      return <span>{t('filterPanel', 'noData')}</span>
    }

    options = options && [Math.floor(options[0]), Math.ceil(options[1])]

    const textMissing = `${t('filterPanel', 'missing')}` // (${missingCount})`

    return (
      <RangeFilter
        exactOption={isOrigDateFilter}
        label={filterName}
        textMissing={textMissing}
        options={options}
        selected={filterQuery[filterName] as RangeFilterData | undefined}
        onChange={onChange}
        unit={config.filterUnits[filterName]}
      />
    )
  }

  return null
}
