import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import { useMediaQuery, useTheme } from '@material-ui/core'
import Backdrop from '@material-ui/core/Backdrop'
import Collapse from '@material-ui/core/Collapse'
import MuiGrid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CloseIcon from '@material-ui/icons/Close'

import { Help } from 'src/components/shared/Help'
import { Tooltip } from 'src/components/shared/Tooltip'
import { actions } from 'src/contexts/actions'
import { useHspObjectsByQuery } from 'src/contexts/discovery'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { useTriggerLink } from 'src/contexts/link'
import { FilterQuery, toSearchParams } from 'src/contexts/location'
import { selectors } from 'src/contexts/state'
import { setTabIndexHits } from 'src/utils/setTabIndex'

import { Grid } from '../../Grid'
import { Filter } from './Filter'
import { FilterButton } from './FilterButton'
import { FilterButtonWrapper } from './FilterButtonWrapper'
import { FilterList } from './FilterList'

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
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    paddingLeft: theme.spacing(2.5),
    flexWrap: 'wrap-reverse',
  },
  headLeft: {
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
  const [isApplyBtn, setIsApplyBtn] = useState(false)
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })

  const params = useParsedParams()
  const modifiedFq =
    useSelector(selectors.getModifiedFilterQuery) || params.fq || {}

  // the unfiltered result gives us all possible filters for the unfiltered query
  const { data: unfilteredResult } = useHspObjectsByQuery({
    ...params,
    q: params.q,
    qf: params.qf,
    start: 0,
    rows: 1,
  })
  const unfilteredStats = unfilteredResult?.metadata.stats || {}

  // the predicted result gives us the remaining filters when applying the filter query.
  const { data: predictedResult } = useHspObjectsByQuery({
    ...params,
    fq: modifiedFq,
  })
  const predictedFacets = predictedResult?.metadata.facets || {}

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
    selected: FilterQuery[keyof FilterQuery],
  ) {
    const _selected =
      Array.isArray(selected) && selected.length === 0 ? undefined : selected

    dispatch(
      actions.setModifiedFilterQuery({
        ...modifiedFq,
        [filterName]: _selected,
      }),
    )
  }

  function closeAndDiscard() {
    toggle()
    dispatch(
      actions.setModifiedFilterQuery({
        ...params.fq,
      }),
    )
  }

  if (isTouch) {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty(
        '--hsp-search-window-vh',
        `${vh}px`,
      )
    }
    ;['resize', 'orientationchange'].forEach((evt) =>
      window.addEventListener(evt, handleResize),
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
    } else if (showFilterList === true && body) {
      body.style.overflow = 'hidden'
      setTabIndexHits(-1)
    }
  }, [showFilterList])

  useEffect(() => {
    const close = (e: { key: string }) => {
      if (e.key === 'Escape') {
        toggle()
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

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
        <div className="left" />
        <FilterButtonWrapper mobile={mobile}>
          {!isApplyBtn && (
            <FilterButton
              isApplyBtn={isApplyBtn}
              title={t('filterPanel', 'filters')}
              onClick={toggle}
            />
          )}
        </FilterButtonWrapper>

        <Collapse
          in={showFilterList}
          // By default the child will mount even if the component is closed.
          // But we want to render the child not before the component opens.
          mountOnEnter={true}
          // By default the child stays mounted even if the component closes.
          // But we want the child to unmount if the component closes.
          unmountOnExit={true}
          onEnter={() => setIsApplyBtn(true)}
          onExited={() => setIsApplyBtn(false)}
        >
          <Grid className={clsx(cls.filterPanel)}>
            <MuiGrid container justifyContent="center">
              <MuiGrid item xs={12} className={cls.head}>
                <div className={cls.headLeft}>
                  <Filter
                    filterName="described-object-facet"
                    filterQuery={modifiedFq}
                    facets={predictedFacets}
                    stats={unfilteredStats}
                    onChange={(selected) =>
                      handleFilterChanged('described-object-facet', selected)
                    }
                  />
                  <Filter
                    filterName="digitized-object-facet"
                    filterQuery={modifiedFq}
                    facets={predictedFacets}
                    stats={unfilteredStats}
                    onChange={(selected) =>
                      handleFilterChanged('digitized-object-facet', selected)
                    }
                  />
                  <Filter
                    filterName="digitized-iiif-object-facet"
                    filterQuery={modifiedFq}
                    facets={predictedFacets}
                    stats={unfilteredStats}
                    onChange={(selected) =>
                      handleFilterChanged(
                        'digitized-iiif-object-facet',
                        selected,
                      )
                    }
                  />
                </div>
                <div className={cls.headRight}>
                  <Typography className={cls.results} variant="button">
                    {predictedResult &&
                      tt(
                        {
                          numFound:
                            predictedResult.metadata.numFound.toString(),
                        },
                        'filterPanel',
                        'filterResult',
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
              </MuiGrid>
              <FilterList
                facets={predictedFacets}
                stats={unfilteredStats}
                filterQuery={modifiedFq}
                onChange={handleFilterChanged}
              />
            </MuiGrid>

            <div className={cls.bottom}>
              <Help
                html={t('filterPanel', 'help')}
                aria-label={t('filterPanel', 'helpLabel')}
              ></Help>
            </div>
          </Grid>
        </Collapse>
        <FilterButtonWrapper mobile={mobile}>
          {isApplyBtn && (
            <FilterButton
              isApplyBtn={isApplyBtn}
              title={t('filterPanel', 'applyFilters')}
              onClick={handleApplyFilter}
            />
          )}
        </FilterButtonWrapper>
        <Backdrop open={showFilterList} />
      </div>
    </div>
  )
}
