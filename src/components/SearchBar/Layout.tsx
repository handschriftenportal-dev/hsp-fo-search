import clsx from 'clsx'
import { WebModuleLocation } from 'hsp-web-module'
import React, { ReactElement } from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import {
  useLocation,
  useParsedParams,
  useSearchModuleLocation,
} from 'src/contexts/hooks'
import { ParsedParams, toSearchParams } from 'src/contexts/location'

import BackButton from '../shared/BackButton'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    [theme.breakpoints.up('md')]: {
      alignItems: 'center',
    },
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column',
    },
  },
  upper: {
    display: 'flex',
  },
  lower: {
    display: 'flex',
    paddingTop: theme.spacing(1),
    left: theme.spacing(-1),
    justifyContent: 'space-between',
  },
  lowerExtended: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: theme.spacing(1),
    flexDirection: 'row-reverse',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.only('lg')]: {
      flexShrink: 0,
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%',
    },
    [theme.breakpoints.down('lg')]: {
      width: '75%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  homeCenter: {
    width: 'unset',
  },
}))

interface Props {
  searchFieldSelection: ReactElement
  input: ReactElement
  searchButton: ReactElement
  extendedButton: ReactElement
}

export function Layout(props: Props) {
  const cls = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
  const params: ParsedParams = useParsedParams()
  const { inExtendedView } = useSearchModuleLocation()
  const { input, searchButton, searchFieldSelection, extendedButton } = props
  const { pathname } = useLocation()

  const inHome = pathname === ''

  const backLocation: WebModuleLocation = {
    pathname: '/',
    hash: '',
    search: toSearchParams({
      hspobjectid: undefined,
      isExtended: undefined,
    }),
  }

  const searchBar = () => {
    if (mobile) {
      return (
        <>
          <div className={cls.upper}>
            {input}
            {searchButton}
          </div>
          <div className={cls.lower}>
            {searchFieldSelection}
            {extendedButton}
          </div>
        </>
      )
    }
    return (
      <>
        <div className={clsx(cls.center, 'searchBarCenter')}>
          {searchFieldSelection}
          {input}
          {searchButton}
        </div>
        {extendedButton}
      </>
    )
  }

  const extendedSearchBar = <></>

  const activeExtendedSearchBar = () => {
    if (mobile) {
      return (
        <>
          {input}
          <div className={cls.lowerExtended}>
            {extendedButton}
            <BackButton backLocation={backLocation} btnType="extendedBtn" />
          </div>
        </>
      )
    }
    return (
      <>
        <div
          className={
            inHome
              ? clsx(cls.center, cls.homeCenter, '')
              : clsx(cls.center, 'extSearchBarCenter')
          }
        >
          {input}
          {extendedButton}
        </div>
        <BackButton backLocation={backLocation} btnType="extendedBtn" />
      </>
    )
  }

  const searchBarType = params.isExtended
    ? activeExtendedSearchBar()
    : searchBar()

  return (
    <div id="hsp-search-search-bar" className={cls.root} role="search">
      {inExtendedView ? extendedSearchBar : searchBarType}
    </div>
  )
}
