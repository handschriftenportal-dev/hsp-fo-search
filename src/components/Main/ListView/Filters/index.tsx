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

import React, { useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'

import { useSelector, batch, useDispatch } from 'react-redux'
import { selectors, actions } from 'src/contexts/state'
import { useHspObjectsByQuery } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'
import { FilterQuery, toSearchParams } from 'src/contexts/location'
import { useParsedParams } from 'src/contexts/hooks'
import { useTriggerLink } from 'src/contexts/link'

import { Grid } from '../../Grid'
import { Filter } from './Filter'
import { FilterList } from './FilterList'
import { FilterButton } from './FilterButton'
import { Tooltip } from 'src/components/shared/Tooltip'
import { Help } from 'src/components/shared/Help'
import { setTabIndexHits } from 'src/utils/setTabIndex'

const useStyles = makeStyles((theme) => ({
  drawer: {
    position: 'relative',
  },
  filterPanel: {
    paddingBottom: theme.spacing(4),
    background: theme.palette.platinum.main,
    transition: '2s',
    overscrollBehavior: 'none',
    [theme.breakpoints.up('sm')]: {
      maxHeight: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    // header height = ~170px / ~80px, "apply filters" button height = ~30px
    // TODO: needs proper fix, see issue #16314
    '@media (orientation: landscape)': {
      [theme.breakpoints.down('md')]: {
        maxHeight: 'calc(var(--hsp-search-window-vh, 1vh) * 100 - 80px - 30px)',
        overflowY: 'auto',
        overflowX: 'hidden',
      },
    },
    [theme.breakpoints.down('xs')]: {
      maxHeight: 'calc(var(--hsp-search-window-vh, 1vh) * 100 - 170px - 30px)',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
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
  bottom: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  results: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(4),
  },
  filters: {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  filtersOpen: {
    // comment out for drawer
    position: 'sticky',
    [theme.breakpoints.up('sm')]: {
      top: 80,
    },
  },
  filtersClose: {
    position: 'absolute',
  },
}))

export function Filters() {
  const cls = useStyles()
  const dispatch = useDispatch()
  const triggerLink = useTriggerLink()
  const showFilterList = useSelector(selectors.getShowFilterList)
  const { t, tt } = useTranslation()
  const isTouch = window.matchMedia('(pointer:coarse)').matches

  const params = useParsedParams()
  const modifiedFq =
    useSelector(selectors.getModifiedFilterQuery) || params.fq || {}

  // the unfiltered result gives us all possible filters for the unfiltered query
  const { data: unfilteredResult } = useHspObjectsByQuery({
    q: params.q,
    qf: params.qf,
    start: 0,
    rows: 1,
  })

  // the predicted result gives us the remaining filters when applying the filter query.
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

  function toggle() {
    dispatch(actions.toggleFilterList())
  }

  function handleApplyFilter() {
    batch(() => {
      toggle()
      dispatch(actions.setModifiedFilterQuery(undefined))
      triggerLink({
        pathname: '/',
        hash: '',
        search: toSearchParams({
          ...params,
          start: 0,
          fq: modifiedFq,
        }),
      })
    })
  }

  function handleFilterChanged(
    filterName: string,
    selected: FilterQuery[keyof FilterQuery]
  ) {
    const _selected =
      Array.isArray(selected) && selected.length === 0 ? undefined : selected

    dispatch(
      actions.setModifiedFilterQuery({
        ...modifiedFq,
        [filterName]: _selected,
      })
    )
  }

  function closeAndDiscard() {
    toggle()
    dispatch(
      actions.setModifiedFilterQuery({
        ...params.fq,
      })
    )
  }

  if (isTouch) {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty(
        '--hsp-search-window-vh',
        `${vh}px`
      )
    }
    ;['resize', 'orientationchange'].forEach((evt) =>
      window.addEventListener(evt, handleResize)
    )
    handleResize()
  }

  // React.useEffect(toggle, []) // use for lighthouse a11y testing
  useEffect(() => {
    const body = document.body

    if (showFilterList !== true && body) {
      body.style.overflow = 'auto'
      body.style.paddingRight = 'unset'
      setTabIndexHits(0)
      // setTabIndexSearchBar(0)
    } else if (showFilterList === true && body) {
      body.style.overflow = 'hidden'
      setTabIndexHits(-1)
      // setTabIndexSearchBar(-1)
    }
  }, [showFilterList])

  return (
    <div
      aria-label="filter-drawer"
      data-testid="discovery-list-view-filters"
      className={
        showFilterList
          ? clsx(cls.filters, cls.filtersOpen)
          : clsx(cls.filters, cls.filtersClose)
      }
    >
      <div>
        <Collapse
          in={showFilterList}
          // By default the child will mount even if the component is closed.
          // But we want to render the child not before the component opens.
          mountOnEnter={true}
          // By default the child stays mounted even if the component closes.
          // But we want the child to unmount if the component closes.
          unmountOnExit={true}
        >
          <Grid className={clsx(cls.filterPanel)}>
            <div className={cls.head}>
              <br />
              <div className={cls.headLeft}>
                <Filter
                  filterName="described-object-facet"
                  filterQuery={modifiedFq}
                  facets={unfilteredFacets}
                  stats={unfilteredStats}
                  onChange={(selected) =>
                    handleFilterChanged('described-object-facet', selected)
                  }
                />
                <Filter
                  filterName="digitized-object-facet"
                  filterQuery={modifiedFq}
                  facets={unfilteredFacets}
                  stats={unfilteredStats}
                  onChange={(selected) =>
                    handleFilterChanged('digitized-object-facet', selected)
                  }
                />
                <Filter
                  filterName="digitized-iiif-object-facet"
                  filterQuery={modifiedFq}
                  facets={unfilteredFacets}
                  stats={unfilteredStats}
                  onChange={(selected) =>
                    handleFilterChanged('digitized-iiif-object-facet', selected)
                  }
                />
              </div>
              <div className={cls.headRight}>
                <Typography className={cls.results} variant="button">
                  {predictedResult &&
                    tt(
                      {
                        numFound: predictedResult.metadata.numFound.toString(),
                      },
                      'filterPanel',
                      'filterResult'
                    )}
                </Typography>
                <Tooltip title={t('filterPanel', 'discardChanges')}>
                  <IconButton
                    onClick={closeAndDiscard}
                    aria-label={t('filterPanel', 'discardChanges')}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <FilterList
              facets={unfilteredFacets}
              stats={unfilteredStats}
              filterQuery={modifiedFq}
              onChange={handleFilterChanged}
            />
            <div className={cls.bottom}>
              <Help
                html={t('filterPanel', 'help')}
                aria-label={t('filterPanel', 'helpLabel')}
              ></Help>
            </div>
          </Grid>
        </Collapse>
        <FilterButton
          active={showFilterList}
          title={
            showFilterList
              ? t('filterPanel', 'applyFilters')
              : t('filterPanel', 'filters')
          }
          onClick={showFilterList ? handleApplyFilter : toggle}
          toggle={toggle}
        />
        <Backdrop open={showFilterList} />
      </div>
    </div>
  )
}
