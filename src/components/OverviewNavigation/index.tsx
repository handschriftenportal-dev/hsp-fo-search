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

import React, { useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { Link, useTriggerLink } from 'src/contexts/routing'
import { useParsedParams, toSearchParams } from 'src/contexts/location'
import { useTranslation } from 'src/contexts/i18n'
import { useHspObjectsByQuery } from 'src/contexts/discovery'
import { WebModuleLocation } from 'hsp-web-module'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  count: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  backButton: {
    marginRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: theme.palette.background.default
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  }
}))

interface Props {
  className?: string;
}

export function OverviewNavigation({ className }: Props) {
  const cls = useStyles()
  const params = useParsedParams()
  const triggerLink = useTriggerLink()
  const { t, tt } = useTranslation()

  const { data: resultList, error: resultListError, isIdle } = useHspObjectsByQuery(params)

  useEffect(() => {
    if (!resultList) {
      return
    }

    if (params.hspobjectid === 'first') {
      triggerLink({
        path: '/',
        hash: '',
        params: toSearchParams({
          ...params,
          hspobjectid: resultList.payload[0].hspObject.id,
        })
      })
    }

    if (params.hspobjectid === 'last') {
      triggerLink({
        path: '/',
        hash: '',
        params: toSearchParams({
          ...params,
          hspobjectid: resultList.payload[resultList.payload.length - 1].hspObject.id,
        })
      })
    }
  }, [resultList])

  //
  // observe the fetch progress
  //

  if (isIdle) {
    return null
  }

  if (resultListError) {
    return null
  }

  if (!resultList) {
    return null
  }

  //
  // Ok, we received the result list.
  // Now we check if hspobjectid is set to 'first' or 'last'.
  // If so, we return null because the useEffect hook will make a redirect
  // with the correct substitution for 'last' or 'first'
  //
  if (params.hspobjectid === 'first' || params.hspobjectid === 'last') {
    return null
  }

  const hspObjectIds = resultList.payload.map(group => group.hspObject.id)
  const currentIndex = hspObjectIds.findIndex(id => id === params.hspobjectid)

  //
  // If the target hsp object does not exist on the result list
  // we return null because navigation can not be performed.
  //
  if (currentIndex === -1) {
    return null
  }

  //
  // create navigation urls
  //

  const isFirstOfResult = !params.start && currentIndex === 0
  const isLastOfResult = (resultList.metadata.start + currentIndex + 1) === resultList.metadata.numGroupsFound
  const isFirstOfPage = currentIndex === 0
  const isLastOfPage = currentIndex === hspObjectIds.length - 1

  const backUrl: WebModuleLocation = {
    path: '/',
    hash: '',
    params: toSearchParams({
      ...params,
      hspobjectid: undefined
    })
  }

  let nextUrl: WebModuleLocation | undefined
  let prevUrl: WebModuleLocation | undefined

  if (isLastOfResult) {
    nextUrl = undefined
  } else if (isLastOfPage) {
    nextUrl = {
      path: '/',
      hash: '',
      params: toSearchParams({
        ...params,
        start: (params.start || 0) + resultList.metadata.rows,
        hspobjectid: 'first'
      })
    }
  } else {
    nextUrl = {
      path: '/',
      hash: '',
      params: toSearchParams({
        ...params,
        hspobjectid: hspObjectIds[currentIndex + 1],
      })
    }
  }

  if (isFirstOfResult) {
    prevUrl = undefined
  } else if (isFirstOfPage) {
    prevUrl = {
      path: '/',
      hash: '',
      params: toSearchParams({
        ...params,
        start: (params.start || 0) - resultList.metadata.rows,
        hspobjectid: 'last'
      })
    }
  } else {
    prevUrl = {
      path: '/',
      hash: '',
      params: toSearchParams({
        ...params,
        hspobjectid: hspObjectIds[currentIndex - 1],
      })
    }
  }

  return (
    <div
      id="hsp-search-overview-navigation"
      className={clsx(cls.root, className)}>
      <Button
        className={cls.backButton}
        startIcon={<span className="material-icons">search</span>}
        component={Link}
        linkInfo={backUrl}
      >
        {t('overview', 'buttonBackToSearch')}
      </Button>
      <Button
        size="small"
        color="primary"
        variant="contained"
        startIcon={<span className="material-icons">arrow_back</span>}
        component={Link}
        linkInfo={prevUrl || ''}
        disabled={!prevUrl}
      >
        {t('buttonPrevious')}
      </Button>
      <Typography className={cls.count}>
        {
          tt({
            index: (resultList.metadata.start + 1 + currentIndex).toString(),
            numGroups: (resultList.metadata.numGroupsFound).toString(),
          }, 'overview', 'position')
        }
      </Typography>
      <Button
        size="small"
        color="primary"
        variant="contained"
        endIcon={<span className="material-icons">arrow_forward</span>}
        component={Link}
        linkInfo={nextUrl || ''}
        disabled={!nextUrl}
      >
        {t('buttonNext')}
      </Button>
    </div>
  )
}
