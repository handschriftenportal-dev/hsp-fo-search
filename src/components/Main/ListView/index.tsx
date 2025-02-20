import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { ErrorPage } from 'src/components/shared/ErrorPage'
import { useHspObjectsByQuery } from 'src/contexts/discovery'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'

import { Grid } from '../Grid'
import { Filters } from './Filters'
import { ActiveFilters } from './Filters/ActiveFilters'
import { Hits } from './Hits'
import { Tools } from './Tools'
import { Paging } from './Tools/Paging'

// tracking
// import { useSiteSearchTracking, useRouteTracking } from 'src/app/tracking'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  marginTop: {
    marginTop: theme.spacing(10),
  },
  activeFilters: {
    marginTop: theme.spacing(3),
  },
  tools: {
    marginTop: theme.spacing(4),
  },
  hits: {
    marginTop: theme.spacing(3),
  },
  bottomPaging: {
    margin: 'auto',
    width: '50%',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
}))

interface Props {
  className?: string
}

export function ListView({ className }: Readonly<Props>) {
  // tracking
  // useRouteTracking('Search')
  // useSiteSearchTracking('Search')
  const cls = useStyles()
  const params = useParsedParams()
  const { t } = useTranslation()
  const [showError, setShowError] = useState(false)

  const {
    data: searchResult,
    error: searchResultError,
    isIdle: searchResultIsIdle,
  } = useHspObjectsByQuery(params)

  useEffect(() => {
    if (typeof searchResult === 'undefined') {
      const timeoutId = setTimeout(() => {
        setShowError(true)
      }, 10 * 1000)
      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [searchResult])

  if (searchResultIsIdle) {
    return <p data-testid="discovery-list-view">{t('enterSearchTerm')}</p>
  }

  if (searchResultError || showError) {
    return (
      <ErrorPage
        datatestid={'discovery-list-view'}
        errorMessage={t('searchFailed')}
      />
    )
  }

  if (!searchResult) {
    return <p data-testid="discovery-list-view">{t('loading')}</p>
  }

  return (
    <div className={clsx(cls.root, className)}>
      <Filters />
      <Grid id="searchGrid">
        <div className={cls.marginTop}>
          <ActiveFilters className={cls.activeFilters} />
          <Tools className={cls.tools} result={searchResult} />
        </div>
        <Hits className={cls.hits} result={searchResult} />
        <Paging className={cls.bottomPaging} result={searchResult} />
      </Grid>
    </div>
  )
}
