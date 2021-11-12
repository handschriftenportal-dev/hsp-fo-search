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

import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import Select from '@material-ui/core/Select'
import Hidden from '@material-ui/core/Hidden'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'

import { Tooltip } from 'src/components/shared/Tooltip'
import { useDispatch } from 'react-redux'
import { actions } from 'src/contexts/state'
import * as config from 'src/components/config'
import { useTranslation } from 'src/contexts/i18n'
import { useParsedParams, toSearchParams } from 'src/contexts/location'
import { useTriggerLink } from 'src/contexts/routing'
import { useEvent } from 'src/contexts/events'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  input: {
    paddingLeft: theme.spacing(1),
    borderRadius: 2,
    border: '1px solid #ccc',
    background: theme.palette.background.default,
    flexGrow: 1,
  },
  searchButton: {
    marginLeft: theme.spacing(1),
  },
  advancedButton: {
    marginLeft: theme.spacing(2),
    whiteSpace: 'nowrap',
  },
  selectMargin: {
    marginRight: 8,
  },
  selectPadding: {
    padding: 8,
  },
  tooltip: {
    fontSize: '1.2em',
    padding: theme.spacing(2),
  }
}))

interface Props {
  className?: string;
}

export function SearchBar({ className }: Props) {
  const cls = useStyles()
  const triggerLink = useTriggerLink()
  const fireSearchButtonClicked = useEvent('searchButtonClicked')
  const dispatch = useDispatch()
  const { q, qf } = useParsedParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('__ALLFIELDS__')
  const { t } = useTranslation()

  useEffect(() => {
    setSearchTerm(q || '')
    setSearchField(qf || '__ALLFIELDS__')
  }, [q, qf])

  // console.log(searchField)

  function search() {
    if (fireSearchButtonClicked(searchTerm)) {
      dispatch(actions.setModifiedFilterQuery(undefined))
      triggerLink({
        path: '/',
        hash: '',
        params: toSearchParams({
          q: searchTerm || '',
          qf: searchField !== '__ALLFIELDS__' ? searchField : undefined,
          hl: true,
        })
      })
    }
  }

  function handleInputChange(ev: ChangeEvent<HTMLInputElement>): void {
    setSearchTerm(ev.target.value)
  }

  function handleFieldChange(ev: ChangeEvent<{ value: unknown }>): void {
    console.log('handleFieldChange ', ev.target.value)
    setSearchField(ev.target.value as string)
  }

  function handleInputKeyDown(ev: KeyboardEvent<HTMLInputElement>): void {
    if (ev.key === 'Enter') {
      search()
    }
  }

  return (
    <div
      id="hsp-search-search-bar"
      className={clsx(cls.root, className)}
      role="search"
    >
      <Hidden xsDown>
        <Select
          native={true}
          variant="filled"
          className={cls.selectMargin}
          classes={{
            select: cls.selectPadding
          }}
          inputProps={{
            'aria-label': t('searchBar', 'searchFieldSelection')
          }}
          value={searchField}
          onChange={handleFieldChange}
        >
          {
            config.searchBarOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {
                  option === '__ALLFIELDS__'
                    ? t('searchBar', 'allFields')
                    : t('data', option, '__field__')
                }
              </option>)
            )
          }
        </Select>
      </Hidden>
      <InputBase
        className={cls.input}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        type="search"
      />
      <Button
        className={cls.searchButton}
        variant="contained"
        size="small"
        onClick={search}
        color="primary"
      >
        {t('searchBar', 'searchButton')}
      </Button>
      <Hidden smDown>
        <Tooltip title={t('searchBar', 'advancedSearchNotAvailable') as string}>
          <Button className={cls.advancedButton}>
            {t('searchBar', 'advancedButton')}
          </Button>
        </Tooltip>
      </Hidden>
    </div>
  )
}
