import clsx from 'clsx'
import { WebModuleLocation } from 'hsp-web-module'
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import LaunchIcon from '@material-ui/icons/Launch'

import { actions } from 'src/contexts/actions'
import { useEvent } from 'src/contexts/events'
import { useParsedParams, useSearchModuleLocation } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { WebModuleLink, useTriggerLink } from 'src/contexts/link'
import { ParsedParams, toSearchParams } from 'src/contexts/location'

import { searchBarOptions } from '../config'
import { SearchFieldSelection, SearchInputField } from '../shared/SearchInput'
import { Layout } from './Layout'

const useStyles = makeStyles((theme) => ({
  searchButton: {
    marginLeft: theme.spacing(1),
  },
  extendedButton: {
    minWidth: 110,
    whiteSpace: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
    },
    [theme.breakpoints.down('md')]: {
      width: 110,
      whiteSpace: 'normal',
      fontSize: '0.675rem',
      lineHeight: '0.9rem',
    },
    [theme.breakpoints.only('lg')]: {
      flexShrink: 0,
    },
  },
}))

interface Props {
  className?: string
}

export function SearchBar(props: Props) {
  const cls = useStyles()
  const triggerLink = useTriggerLink()
  const fireSearchButtonClicked = useEvent('searchButtonClicked')
  const dispatch = useDispatch()
  const { q, qf, fq } = useParsedParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('FIELD-GROUP-ALL')
  const { t } = useTranslation()
  const inputRefBar = useRef<HTMLInputElement>(null)
  const params: ParsedParams = useParsedParams()

  useEffect(() => {
    setSearchTerm(q || '')
    setSearchField(qf || 'FIELD-GROUP-ALL')
  }, [q, qf])

  function search() {
    const defaultFilter = searchTerm ? undefined : {}
    if (fireSearchButtonClicked(searchTerm)) {
      dispatch(actions.setModifiedFilterQuery(defaultFilter))

      triggerLink({
        pathname: '/',
        hash: '',
        search: toSearchParams({
          hl: true,
          q: searchTerm || '',
          qf: searchField !== 'FIELD-GROUP-ALL' ? searchField : undefined,
          fq: fq ?? defaultFilter,
        }),
      })
    }
  }

  function handleInputChange(ev: ChangeEvent<HTMLInputElement>): void {
    setSearchTerm(ev.target.value)
  }

  function handleFieldChange(ev: ChangeEvent<{ value: unknown }>): void {
    setSearchField(ev.target.value as string)
  }

  function handleInputKeyDown(ev: KeyboardEvent<HTMLInputElement>): void {
    if (ev.key === 'Enter') {
      search()
    }
  }

  function handleResetClick() {
    inputRefBar.current?.focus()
    setSearchTerm('')
  }

  const linkToExtendedSearchView: WebModuleLocation = {
    pathname: '/extended',
    hash: '',
    search: toSearchParams({
      ...params,
      hspobjectid: undefined,
      fromWorkspace: undefined,
      isExtended: params.isExtended,
    }),
  }

  const searchFieldSelection = (
    <SearchFieldSelection
      searchField={searchField}
      handleFieldChange={handleFieldChange}
      aria-label={t('searchBar', 'searchFieldSelection')}
    >
      {searchBarOptions.map((option: string) => (
        <MenuItem key={option} value={option}>
          {option === 'FIELD-GROUP-ALL'
            ? t('searchBar', 'allFields')
            : t('data', option, '__field__')}
        </MenuItem>
      ))}
    </SearchFieldSelection>
  )

  const input = (
    <SearchInputField
      searchTerm={searchTerm}
      handleInputKeyDown={handleInputKeyDown}
      handleResetClick={handleResetClick}
      handleInputChange={handleInputChange}
      aria-label={t('searchBar', 'search')}
      inputRefBar={inputRefBar}
    />
  )

  const searchButton = (
    <Button
      className={cls.searchButton}
      color="primary"
      onClick={search}
      variant="contained"
    >
      {t('searchBar', 'searchButton')}
    </Button>
  )

  const { inExtendedView } = useSearchModuleLocation()
  const extendedButton = (
    <Button
      ariaLabel={t('extendedSearch', 'extendedSearch')}
      color={params.isExtended ? 'primary' : undefined}
      startIcon={<LaunchIcon />}
      className={
        inExtendedView
          ? clsx(cls.extendedButton, 'searchExtBtn')
          : cls.extendedButton
      }
      variant="contained"
      component={WebModuleLink}
      location={linkToExtendedSearchView}
    >
      {t('extendedSearch', 'extendedSearch')}
    </Button>
  )

  return (
    <Layout
      searchFieldSelection={searchFieldSelection}
      input={input}
      searchButton={searchButton}
      extendedButton={extendedButton}
    />
  )
}
