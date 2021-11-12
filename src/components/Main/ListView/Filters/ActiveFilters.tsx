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
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import * as config from 'src/components/config'
import { useSelector } from 'react-redux'
import { useTranslation } from 'src/contexts/i18n'
import { useTriggerLink } from 'src/contexts/routing'
import { isStringArray } from 'src/utils/isStringArray'
import { FilterChip } from './FilterChip'
import {
  ParsedParams,
  useParsedParams,
  RangeFilterData,
  isRangeFilterData,
  toSearchParams,
} from 'src/contexts/location'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    marginTop: 5,
    marginRight: 5,
  }
}))

interface Props {
  className?: string;
}

export function ActiveFilters(props: Props) {
  const { className } = props
  const cls = useStyles()
  const { t } = useTranslation()
  const triggerLink = useTriggerLink()
  const params = useParsedParams()
  const { fq, ...queryWithoutFq } = params

  if (!fq || Object.keys(fq).length === 0) {
    return null
  }

  const handleRemoveChip = function(filterName: string, value: string | RangeFilterData) {
    const newQuery: ParsedParams = { ...queryWithoutFq }
    const { [filterName]: thisFilter, ...newFilters } = fq

    if (thisFilter === undefined) {
      return
    }
    if (typeof value === 'string') {
      const newFilterForField = (thisFilter as string[]).filter((v) => v !== value)
      if (newFilterForField.length > 0) {
        newFilters[filterName] = newFilterForField
      }
    }
    if (Object.keys(newFilters).length > 0) {
      newQuery.fq = newFilters
    }
    newQuery.start = 0
    triggerLink({
      path: '/',
      hash: '',
      params: toSearchParams(newQuery),
    })
  }

  const renderMultivalueFilterChip = function(filterName: string, value: string) {
    const labelValue = value === '__MISSING__'
      ? t('filterPanel', 'missing')
      : t('data', filterName, value)
    return (<FilterChip
      key={`chip-filter-${filterName}-${value}`}
      className={cls.chip}
      label={`${t('data', filterName, '__field__')}: ${labelValue}`}
      onRemove={() => handleRemoveChip(filterName, value)}
    />)
  }

  const renderBooleanFilterChip = function(filterName: string, value: string) {
    return (<FilterChip
      key={`chip-filter-${filterName}`}
      className={cls.chip}
      label={`${t('data', filterName, '__field__')}`}
      onRemove={() => handleRemoveChip(filterName, value)}
    />)
  }

  const renderRangeFilterChip = function(filterName: string, value: RangeFilterData) {
    return (<FilterChip
      key={`chip-filter-${filterName}`}
      className={cls.chip}
      label={`${t('data', filterName, '__field__')}: ${value.from} - ${value.to}` +
        (value.exact ? `, ${t('filterPanel', 'exactPeriod')}` : '') +
        (value.missing ? `, ${t('filterPanel', 'missing')}` : '')}
      onRemove={() => handleRemoveChip(filterName, value)}
    />)
  }

  return (
    <div
      data-testid="discovery-list-view-active-filters"
      className={clsx(cls.root, className)}
    >
      {
        Object.keys(fq).map((filterName) => {
          const values = fq[filterName]
          const isBool = config.filterTypes[filterName] === 'boolean-list'
          if (isStringArray(values) && values.length > 0) {
            if (isBool) {
              return renderBooleanFilterChip(filterName, 'true')
            }
            return values.map(value => renderMultivalueFilterChip(filterName, value))
          } else if (isRangeFilterData(values)) {
            return renderRangeFilterChip(filterName, values)
          } else {
            return null
          }
        })
      }
      <Button
        onClick={() => {
          triggerLink({
            path: '/',
            hash: '',
            params: toSearchParams({
              ...queryWithoutFq,
              start: 0,
            })
          })
        }}
      >
        {t('filterPanel', 'removeAllFilters')}
      </Button>
    </div>
  )
}
