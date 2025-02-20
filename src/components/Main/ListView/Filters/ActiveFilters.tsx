import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import * as config from 'src/components/config'
import { actions } from 'src/contexts/actions'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { useTriggerLink } from 'src/contexts/link'
import {
  ParsedParams,
  RangeFilterData,
  isRangeFilterData,
  toSearchParams,
} from 'src/contexts/location'
import { isBooleanArray } from 'src/utils/isBooleanArray'
import { isStringArray } from 'src/utils/isStringArray'

import { FilterChip } from './FilterChip'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3),
    },
  },
  chip: {
    marginTop: 5,
    marginRight: 5,
  },
}))

interface Props {
  className?: string
}

export function ActiveFilters(props: Props) {
  const { className } = props
  const cls = useStyles()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const triggerLink = useTriggerLink()
  const params = useParsedParams()
  const { fq, ...queryWithoutFq } = params

  if (!fq || Object.keys(fq).length === 0) {
    return null
  }

  const handleRemoveChip = function (
    filterName: string,
    value: string | boolean | RangeFilterData,
  ) {
    const newQuery: ParsedParams = { ...queryWithoutFq }
    const { [filterName]: thisFilter, ...newFilters } = fq

    if (thisFilter === undefined) {
      return
    }
    if (typeof value === 'string') {
      const newFilterForField = (thisFilter as string[]).filter(
        (v) => v !== value,
      )
      if (newFilterForField.length > 0) {
        newFilters[filterName] = newFilterForField
      }
    }
    if (Object.keys(newFilters).length > 0) {
      newQuery.fq = newFilters
    }
    newQuery.start = 0
    dispatch(actions.setModifiedFilterQuery(undefined))
    triggerLink({
      pathname: '/',
      hash: '',
      search: toSearchParams(newQuery),
    })
  }

  const renderMultivalueFilterChip = function (
    filterName: string,
    value: string,
  ) {
    const labelValue =
      value === '__MISSING__'
        ? t('filterPanel', 'missing')
        : t('data', filterName, value)
    return (
      <FilterChip
        key={`chip-filter-${filterName}-${value}`}
        className={cls.chip}
        label={`${t('data', filterName, '__field__')}: ${labelValue}`}
        onRemove={() => handleRemoveChip(filterName, value)}
      />
    )
  }

  const renderBooleanFilterChip = function (
    filterName: string,
    value: boolean,
  ) {
    return (
      <FilterChip
        key={`chip-filter-${filterName}`}
        className={cls.chip}
        label={`${t('data', filterName, '__field__')}`}
        onRemove={() => handleRemoveChip(filterName, value)}
      />
    )
  }

  const renderRangeFilterChip = function (
    filterName: string,
    value: RangeFilterData,
  ) {
    return (
      <FilterChip
        key={`chip-filter-${filterName}`}
        className={cls.chip}
        label={
          `${t('data', filterName, '__field__')}: ${value.from} - ${value.to}` +
          (value.exact ? `, ${t('filterPanel', 'exactPeriod')}` : '') +
          (value.missing ? `, ${t('filterPanel', 'missing')}` : '')
        }
        onRemove={() => handleRemoveChip(filterName, value)}
      />
    )
  }

  return (
    <div
      data-testid="discovery-list-view-active-filters"
      className={clsx(cls.root, className)}
    >
      {Object.keys(fq).map((filterName) => {
        const values = fq[filterName]
        if (isStringArray(values) && values.length > 0) {
          return values.map((value) =>
            renderMultivalueFilterChip(filterName, value),
          )
        } else if (isBooleanArray(values) && values.length > 0) {
          return renderBooleanFilterChip(filterName, true)
        } else if (isRangeFilterData(values)) {
          return renderRangeFilterChip(filterName, values)
        } else {
          return null
        }
      })}
      <Button
        onClick={() => {
          dispatch(actions.setModifiedFilterQuery(undefined))
          triggerLink({
            pathname: '/',
            hash: '',
            search: toSearchParams({
              ...queryWithoutFq,
              start: 0,
            }),
          })
        }}
      >
        {t('filterPanel', 'removeAllFilters')}
      </Button>
    </div>
  )
}
