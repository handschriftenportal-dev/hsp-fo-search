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

import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  more: {
    padding: theme.spacing(2),
    cursor: 'pointer',
  },
  missing: {
    fontStyle: 'italic',
  }
}))

type Options = Record<string, number>;

interface Props {
  className?: string;
  filterName: string;
  isBool?: boolean;
  options: Options;
  selected: string[];
  onChange: (selected: string[]) => void;
  showMax?: number;
  sort?: 'alpha' | 'count'
}

export function ListFilter(props: Props) {
  const { className, filterName, isBool, options, selected, sort, showMax, onChange } = props
  const { '__MISSING__': missing } = options
  const cls = useStyles()
  const [showAll, setShowAll] = useState(false)
  let sortedOptions: Options
  const { t } = useTranslation()

  if (isBool) {
    sortedOptions = { 'true': options.true || 0 }
  } else if (sort === 'alpha') {
    sortedOptions = Object
      .keys(options)
      .filter(el => el !== '__MISSING__')
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: options[key] }), {})
    if (missing) {
      sortedOptions = { __MISSING__: missing, ...sortedOptions }
    }
  } else if (sort === 'count') {
    sortedOptions = Object
      .entries(options)
      .filter(entry => entry[0] !== '__MISSING__')
      .sort((entryA, entryB) => entryB[1] - entryA[1])
      .reduce((acc, entry) => ({ ...acc, [entry[0]]: options[entry[0]] }), {})
    if (missing) {
      sortedOptions = { __MISSING__: missing, ...sortedOptions }
    }
  } else {
    sortedOptions = options
  }

  function toggleValue(ev: React.ChangeEvent<HTMLInputElement>) {
    if (isBool) {
      onChange(ev.target.checked ? [String(ev.target.checked)] : [])
    } else {
      onChange(ev.target.checked
        ? [...selected, ev.target.value]
        : selected.filter(val => val !== ev.target.value)
      )
    }
  }

  const renderOptions = (start: number, end?: number) => Object.keys(sortedOptions).slice(start, end).map(value => (
    <div
      key={value}
      className={cls.option}
    >
      <Checkbox
        className={cls.checkbox}
        color="primary"
        value={value}
        checked={selected.indexOf(value) > -1}
        onChange={toggleValue}
      />
      <Typography
        variant="body2"
        component="span"
        className={value === '__MISSING__' ? cls.missing : undefined}
      >
        {
          value === '__MISSING__'
            ? t('filterPanel', 'missing')
            : t('data', filterName, value)
        } {
          `(${sortedOptions[value]})`
        }
      </Typography>
    </div>
  ))

  return (
    <div className={clsx(cls.root, className)}>
      { renderOptions(0, showMax) }
      {
        showMax && (
          <Collapse in={showAll}>
            { renderOptions(showMax) }
          </Collapse>
        )
      }
      {
        showMax && showMax < Object.keys(options).length && (
          <div
            className={cls.more}
            onClick={() => setShowAll(!showAll)}
          >
            { showAll
              ? t('filterPanel', 'showLessFilterOptions')
              : t('filterPanel', 'showMoreFilterOptions')
            }
          </div>
        )
      }
    </div>
  )
}
