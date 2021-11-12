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
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '../Grid'
import { Filters } from './Filters'
import { ActiveFilters } from './Filters/ActiveFilters'
import { Tools } from './Tools'
import { Paging } from './Tools/Paging'
import { Hits } from './Hits'
import clsx from 'clsx'
import { useTranslation } from 'src/contexts/i18n'
import { useParsedParams } from 'src/contexts/location'
import { useHspObjectsByQuery } from 'src/contexts/discovery'

// tracking
// import { useSiteSearchTracking, useRouteTracking } from 'src/app/tracking'


const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  filters: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    [theme.breakpoints.up('sm')]: {
      position: 'sticky',
      top: theme.mixins.toolbar.minHeight
    }
  },
  marginTop: {
    marginTop: theme.spacing(10)
  },
  activeFilters: {
    marginTop: theme.spacing(3),
  },
  tools: {
    marginTop: theme.spacing(4),
  },
  hits: {
    marginTop: theme.spacing(3)
  },
  bottomPaging: {
    margin: 'auto',
    width: '50%',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  }
}))

interface Props {
  className?: string;
}

export function ListView({ className }: Props) {
  // tracking
  // useRouteTracking('Search')
  // useSiteSearchTracking('Search')
  const cls = useStyles()
  const params = useParsedParams()
  const { t } = useTranslation()

  const {
    data: searchResult,
    error: searchResultError,
    isIdle: searchResultIsIdle
  } = useHspObjectsByQuery(params)

  if (searchResultIsIdle) {
    return <p data-testid="discovery-list-view">{t('enterSearchTerm')}</p>
  }

  if (searchResultError) {
    return <p data-testid="discovery-list-view">{t('searchFailed')}</p>
  }

  if (!searchResult) {
    return <p data-testid="discovery-list-view">{t('loading')}</p>
  }

  return (
    <div className={clsx(cls.root, className)}>
      <Filters
        className={cls.filters}
      />
      <Grid >
        <div className={cls.marginTop}>
          <ActiveFilters
            className={cls.activeFilters}
          />
          <Tools
            className={cls.tools}
            result={searchResult}
          />
        </div>
        <Hits
          className={cls.hits}
          result={searchResult}
        />
        <Paging
          className={cls.bottomPaging}
          result={searchResult}
        />
      </Grid>

    </div>
  )
}
