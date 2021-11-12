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

import React, { useMemo } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

import equal from 'fast-deep-equal'
import { useSelector, batch, useDispatch } from 'react-redux'
import { selectors, actions } from 'src/contexts/state'
import { useHspObjectsByQuery } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'
import { useParsedParams, FilterQuery, toSearchParams, ParsedParams } from 'src/contexts/location'
import { useTriggerLink } from 'src/contexts/routing'

import { Grid } from '../../Grid'
import { Filter } from './Filter'
import { FilterList } from './FilterList'


const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(4),
    background: theme.palette.grey[200],
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    flexWrap: 'wrap-reverse',
  },
  headLeft: {
    alignItems: 'left',
    display: 'flex',
    flexGrow: 1,
  },
  headRight: {
    display: 'flex',
    alignItems: 'center',
  },
  applyButton: {
    marginLeft: theme.spacing(2)
  }
}))

interface Props {
  className?: string;
  onClose: () => void;
}

export function FilterPanel(props: Props) {
  const { className, onClose } = props
  const cls = useStyles()
  const dispatch = useDispatch()
  const triggerLink = useTriggerLink()
  const { t, tt } = useTranslation()

  // after a new search the modified filter query == filter query
  const params = useParsedParams()
  const fq = params.fq || {}
  const modifiedFq = useSelector(selectors.getModifiedFilterQuery) || fq

  // the unfiltered result gives us all possible filters for the unfiltered query
  const { data: unfilteredResult } = useHspObjectsByQuery({
    q: params.q,
    qf: params.qf,
    start: 0,
    rows: 1,
  })

  // the predicted result gives us the remaining filters when applying filters
  const { data: predictedResult } = useHspObjectsByQuery({
    ...params,
    fq: modifiedFq,
  })

  const unfilteredFacets = unfilteredResult?.metadata.facets || {}
  const predictedFacets = predictedResult?.metadata.facets || {}
  const unfilteredStats = unfilteredResult?.metadata.stats || {}

  // update filter value counts of unfiltered facets with counts in predicted facets,
  // possibly with 0 if undefined
  for (const filterName in unfilteredFacets) {
    for (const filterValue in unfilteredFacets[filterName]) {
      unfilteredFacets[filterName][filterValue] =
        predictedFacets[filterName]?.[filterValue] || 0
    }
  }

  function handleApplyFilter() {
    if (!equal(fq, modifiedFq)) {
      batch(() => {
        dispatch(actions.setModifiedFilterQuery(undefined))
        dispatch(actions.toggleFilterList())
        triggerLink({
          path: '/',
          hash: '',
          params: toSearchParams({
            ...params,
            start: 0,
            fq: modifiedFq
          })
        })
      })
    }
  }

  function handleFilterChanged(
    filterName: string,
    selected: FilterQuery[keyof FilterQuery]
  ) {
    const _selected = (Array.isArray(selected) && selected.length === 0)
      ? undefined
      : selected

    dispatch(actions.setModifiedFilterQuery({
      ...modifiedFq,
      [filterName]: _selected
    }))
  }

  function closeAndDiscard() {
    onClose()
    dispatch(actions.setModifiedFilterQuery({
      ...fq,
    }))
  }

  return (
    <Grid className={clsx(cls.root, className)}>
      <div className={cls.head}>
        <br />
        <div className={cls.headLeft}>
          <Filter
            filterName="described-object-facet"
            filterQuery={modifiedFq}
            facets={unfilteredFacets}
            stats={unfilteredStats}
            onChange={selected => handleFilterChanged('described-object-facet', selected)}
          />
          <Filter
            filterName="digitized-object-facet"
            filterQuery={modifiedFq}
            facets={unfilteredFacets}
            stats={unfilteredStats}
            onChange={selected => handleFilterChanged('digitized-object-facet', selected)}
          />
          <Filter
            filterName="digitized-iiif-object-facet"
            filterQuery={modifiedFq}
            facets={unfilteredFacets}
            stats={unfilteredStats}
            onChange={selected => handleFilterChanged('digitized-iiif-object-facet', selected)}
          />
        </div>
        <div className={cls.headRight}>
          <Button
            className={cls.applyButton}
            variant="contained"
            color="primary"
            onClick={handleApplyFilter}
          >
            {
              predictedResult
                ? tt({
                  numDocs: predictedResult.metadata.numDocsFound.toString(),
                  numGroups: predictedResult.metadata.numGroupsFound.toString(),
                }, 'filterPanel', 'applyButtonWithResult')
                : t('applyButton')
              }
          </Button>
          <IconButton onClick={closeAndDiscard}>
            <span className="material-icons">
              close
            </span>
          </IconButton>
        </div>
      </div>
      <FilterList
        facets={unfilteredFacets}
        stats={unfilteredStats}
        filterQuery={modifiedFq}
        onChange={handleFilterChanged}
      />
    </Grid>
  )
}
