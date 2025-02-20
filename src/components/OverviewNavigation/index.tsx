import clsx from 'clsx'
import { WebModuleLocation } from 'hsp-web-module'
import React, { useCallback, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import {
  HspObjectsByQueryOutput,
  useHspObjectsByQuery,
} from 'src/contexts/discovery'
import { useLocation, useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { WebModuleLink, useTriggerLink } from 'src/contexts/link'
import { ParsedParams, toSearchParams } from 'src/contexts/location'

import BackButton from '../shared/BackButton'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  mobileNavButtonRoot: {
    minWidth: 0,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  mobileNavButtonIcon: {
    margin: 0,
  },
  count: {
    textAlign: 'center',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  currentPage: {
    fontWeight: 700,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
}))

interface Props {
  className?: string
}

export function OverviewNavigation({ className }: Props) {
  const cls = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
  const params = useParsedParams()
  const triggerLink = useTriggerLink()
  const { t } = useTranslation()
  const location = useLocation()

  const {
    data: resultList,
    error: resultListError,
    isIdle,
  } = useHspObjectsByQuery(params)

  const prevInput = useCallback(
    (prevElement) => {
      if (prevElement && location.hash === '#prev') {
        prevElement.focus()
      }
    },
    [location.hash],
  )

  const nextInput = useCallback(
    (nextElement) => {
      if (nextElement && location.hash === '#next') {
        nextElement.focus()
      }
    },
    [location.hash],
  )

  function getNextLocation(
    params: ParsedParams,
    resultList: HspObjectsByQueryOutput,
    hspObjectIds: string[],
    currentIndex: number,
  ) {
    const isLastOfResult =
      resultList.metadata.start + currentIndex + 1 ===
      resultList.metadata.numFound
    const isLastOfPage = currentIndex === hspObjectIds.length - 1
    let nextLocation: WebModuleLocation | undefined
    if (isLastOfResult) {
      nextLocation = undefined
    } else if (isLastOfPage) {
      nextLocation = {
        pathname: '/',
        hash: '#next',
        search: toSearchParams({
          ...params,
          start: (params.start || 0) + resultList.metadata.rows,
          hspobjectid: 'first',
        }),
      }
    } else {
      nextLocation = {
        pathname: '/',
        hash: '#next',
        search: toSearchParams({
          ...params,
          hspobjectid: hspObjectIds[currentIndex + 1],
        }),
      }
    }
    return nextLocation
  }

  function getPrevLocation(
    params: ParsedParams,
    resultList: HspObjectsByQueryOutput,
    hspObjectIds: string[],
    currentIndex: number,
  ) {
    const isFirstOfResult = !params.start && currentIndex === 0
    const isFirstOfPage = currentIndex === 0
    let prevLocation: WebModuleLocation | undefined
    if (isFirstOfResult) {
      prevLocation = undefined
    } else if (isFirstOfPage) {
      prevLocation = {
        pathname: '/',
        hash: '#prev',
        search: toSearchParams({
          ...params,
          start: (params.start ?? 0) - resultList.metadata.rows,
          hspobjectid: 'last',
        }),
      }
    } else {
      prevLocation = {
        pathname: '/',
        hash: '#prev',
        search: toSearchParams({
          ...params,
          hspobjectid: hspObjectIds[currentIndex - 1],
        }),
      }
    }
    return prevLocation
  }

  useEffect(() => {
    if (!resultList) {
      return
    }

    if (params.hspobjectid === 'first') {
      triggerLink({
        pathname: '/',
        hash: '#next',
        search: toSearchParams({
          ...params,
          hspobjectid: resultList.payload[0].hspObject.id,
        }),
      })
    }

    if (params.hspobjectid === 'last') {
      triggerLink({
        pathname: '/',
        hash: '#prev',
        search: toSearchParams({
          ...params,
          hspobjectid:
            resultList.payload[resultList.payload.length - 1].hspObject.id,
        }),
      })
    }
  }, [resultList])

  if (isIdle) {
    return null
  }

  if (resultListError) {
    return null
  }

  if (!resultList) {
    return null
  }

  // Ok, we received the result list.
  // Now we check if hspobjectid is set to 'first' or 'last'.
  // If so, we return null because the useEffect hook will make a redirect
  // with the correct substitution for 'last' or 'first'

  if (params.hspobjectid === 'first' || params.hspobjectid === 'last') {
    return null
  }

  const hspObjectIds = resultList.payload.map((group) => group.hspObject.id)
  const currentIndex = hspObjectIds.findIndex((id) => id === params.hspobjectid)

  // If the target hsp object does not exist on the result list
  // we return null because navigation can not be performed.
  if (currentIndex === -1) {
    return null
  }

  // create navigation urls
  const dummyLocation: WebModuleLocation = {
    pathname: '/',
    hash: '',
    search: '',
  }

  const backLocation: WebModuleLocation = {
    pathname: '/',
    hash: '',
    search: toSearchParams({
      ...params,
      hspobjectid: undefined,
    }),
  }

  const nextLocation = getNextLocation(
    params,
    resultList,
    hspObjectIds,
    currentIndex,
  )

  const prevLocation = getPrevLocation(
    params,
    resultList,
    hspObjectIds,
    currentIndex,
  )

  return (
    <div id="resultNav" tabIndex={-1} className={clsx(cls.root, className)}>
      <BackButton backLocation={backLocation} btnType="back" />
      <Button
        ref={prevInput}
        color="primary"
        variant="contained"
        startIcon={<ArrowBackIcon />}
        component={WebModuleLink}
        location={prevLocation || dummyLocation}
        disabled={!prevLocation}
        classes={{
          root: mobile ? cls.mobileNavButtonRoot : undefined,
          startIcon: mobile ? cls.mobileNavButtonIcon : undefined,
        }}
      >
        {!mobile && t('buttonPrevious')}
      </Button>
      <div className={cls.count}>
        <Typography className={cls.currentPage} display="inline">
          {(resultList.metadata.start + 1 + currentIndex).toString()}
        </Typography>
        <Typography display="inline">
          &#32;
          {t('overview', mobile ? 'ofMobile' : 'ofDesktop')}
          &#32;
          {resultList.metadata.numFound.toString()}
        </Typography>
      </div>
      <Button
        ref={nextInput}
        color="primary"
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        component={WebModuleLink}
        location={nextLocation || dummyLocation}
        disabled={!nextLocation}
        classes={{
          root: mobile ? cls.mobileNavButtonRoot : undefined,
          endIcon: mobile ? cls.mobileNavButtonIcon : undefined,
        }}
      >
        {!mobile && t('buttonNext')}
      </Button>
    </div>
  )
}
