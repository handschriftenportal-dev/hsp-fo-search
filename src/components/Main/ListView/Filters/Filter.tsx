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
import { useTranslation } from 'src/contexts/i18n'
import * as config from 'src/components/config'
import { Facets, Stats } from 'src/contexts/discovery'
import { FilterQuery, RangeFilterData } from 'src/contexts/location'

import { ListFilter } from './ListFilter'
import { RangeFilter } from './RangeFilter'

interface Props {
  className?: string;
  filterQuery: FilterQuery;
  filterName: string;
  facets: Facets;
  stats: Stats;
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
        selected={filterQuery[filterName] as string[] || []}
        onChange={onChange}
        sort="count"
        showMax={5}
      />
    )
  }

  // //////////////////////////////////////////////////////
  // Assemble Range Filter
  // //////////////////////////////////////////////////////

  if (filterType === 'range') {
    const isOrigDateFilter = filterName === 'orig-date-facet'
    const minmax = isOrigDateFilter
      ? [
          stats['orig-date-from-facet']?.min,
          stats['orig-date-to-facet']?.max
        ]
      : [
          stats[filterName]?.min,
          stats[filterName]?.max
        ]

    let options = minmax.every(x => typeof x === 'number')
      ? minmax as [number, number]
      : undefined

    if (!options) {
      return <span>{t('filterPanel', 'noData')}</span>
    }

    options = options && [
      Math.floor(options[0]),
      Math.ceil(options[1])
    ]

    return (
      <RangeFilter
        exactOption={isOrigDateFilter}
        label={filterName}
        options={options}
        selected={filterQuery[filterName] as RangeFilterData | undefined}
        onChange={onChange}
        unit={config.filterUnits[filterName]}
      />
    )
  }

  return null
}
