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

import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
} from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import { Tooltip } from 'src/components/shared/Tooltip'
import { DesktopLayout } from './DesktopLayout'
import { MobileLayout } from './MobileLayout'
import { useDispatch } from 'react-redux'
import { actions, defaultState } from 'src/contexts/state'
import * as config from 'src/components/config'
import { useTranslation } from 'src/contexts/i18n'
import { toSearchParams } from 'src/contexts/location'
import { useParsedParams } from 'src/contexts/hooks'
import { useTriggerLink } from 'src/contexts/link'
import { useEvent } from 'src/contexts/events'
import clsx from 'clsx'
import InputAdornment from '@material-ui/core/InputAdornment'
import OutlinedInput from '@material-ui/core/OutlinedInput'

const useStyles = makeStyles((theme) => ({
  hide: {
    visibility: 'hidden',
  },
  inputBase: {
    borderRadius: 2,
    border: '1px solid #ccc',
    background: theme.palette.background.default,
    flexGrow: 1,
    boxShadow: 'inset 4px 5px 4px -4px rgb(0 0 0 / 20%)',
    [theme.breakpoints.only('xs')]: {
      minWidth: '164px',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '322px',
    },
  },
  input: {
    paddingLeft: theme.spacing(1),
  },
  icon: {
    cursor: 'pointer',
  },
  searchButton: {
    marginLeft: theme.spacing(1),
  },
  advancedButton: {
    marginLeft: theme.spacing(2),
    whiteSpace: 'nowrap',
  },
  select: {
    marginRight: 8,
    '&:hover': {
      backgroundColor: theme.palette.platinum.main,
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(1),
      left: theme.spacing(-1),
    },
  },
  selectPadding: {
    padding: theme.spacing(1),
  },
  tooltip: {
    fontSize: '1.2em',
    padding: theme.spacing(2),
  },
  listItemIcon: {
    minWidth: 'auto',
  },
}))

interface Props {
  className?: string
}

export function SearchBar(props: Props) {
  const cls = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'))
  const triggerLink = useTriggerLink()
  const fireSearchButtonClicked = useEvent('searchButtonClicked')
  const dispatch = useDispatch()
  const { q, qf } = useParsedParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('__ALLFIELDS__')
  const { t } = useTranslation()
  const inputRefBar = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSearchTerm(q || '')
    setSearchField(qf || '__ALLFIELDS__')
  }, [q, qf])

  function search() {
    if (fireSearchButtonClicked(searchTerm)) {
      dispatch(actions.setModifiedFilterQuery(undefined))

      const isEmptySearch =
        searchTerm.length === 0 && searchField === '__ALLFIELDS__'

      triggerLink({
        pathname: '/',
        hash: '',
        search: isEmptySearch
          ? defaultState.location.search
          : toSearchParams({
              hl: true,
              q: searchTerm || '',
              qf: searchField !== '__ALLFIELDS__' ? searchField : undefined,
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
  function handleResetKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      inputRefBar.current?.focus()
      setSearchTerm('')
    }
  }

  // className searchSelect is needed to style outside of hsp-fo-search
  const searchFieldSelection = (
    <Select
      className={clsx(cls.select, 'searchSelect')}
      disableUnderline
      classes={{
        select: cls.selectPadding,
      }}
      inputProps={{
        'aria-label': t('searchBar', 'searchFieldSelection'),
      }}
      onChange={handleFieldChange}
      value={searchField}
      id="searchBarSelect"
    >
      {config.searchBarOptions.map((option) => (
        <MenuItem key={option} value={option}>
          {option === '__ALLFIELDS__'
            ? t('searchBar', 'allFields')
            : t('data', option, '__field__')}
        </MenuItem>
      ))}
    </Select>
  )

  const input = (
    <OutlinedInput
      className={clsx(cls.inputBase)}
      endAdornment={
        <InputAdornment
          position="end"
          className={clsx({ [cls.hide]: !searchTerm })}
        >
          <ListItemIcon
            tabIndex={0}
            role="button"
            aria-label="reset"
            onClick={handleResetClick}
            onKeyDown={handleResetKeyDown}
            className={cls.listItemIcon}
          >
            <CloseIcon className={cls.icon} />
          </ListItemIcon>
        </InputAdornment>
      }
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      type="text"
      value={searchTerm}
      inputProps={{
        'aria-label': t('searchBar', 'search'),
        className: cls.input,
      }}
      inputRef={inputRefBar}
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

  // className searchAdvBtn is needed to style outside of hsp-fo-search
  const advancedButton = (
    <Tooltip title={t('searchBar', 'advancedSearchNotAvailable') as string}>
      <Button
        className={clsx(cls.advancedButton, 'searchAdvBtn')}
        variant="contained"
      >
        {t('searchBar', 'advancedButton')}
      </Button>
    </Tooltip>
  )

  if (mobile) {
    return (
      <MobileLayout
        searchFieldSelection={searchFieldSelection}
        input={input}
        searchButton={searchButton}
        advancedButton={advancedButton}
      />
    )
  }

  return (
    <DesktopLayout
      searchFieldSelection={searchFieldSelection}
      input={input}
      searchButton={searchButton}
      advancedButton={advancedButton}
    />
  )
}
