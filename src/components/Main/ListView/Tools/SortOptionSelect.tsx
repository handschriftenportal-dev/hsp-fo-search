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

import React, { ChangeEvent } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { useTranslation } from 'src/contexts/i18n'
import * as config from 'src/components/config'
import NativeSelect from '@material-ui/core/NativeSelect'
import FormControl from '@material-ui/core/FormControl'
import { WebModuleLocation } from 'hsp-web-module'
import { toSearchParams } from 'src/contexts/location'
import { useParsedParams } from 'src/contexts/hooks'
import { useTriggerLink } from 'src/contexts/link'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  itemTypo: theme.typography.caption,
  select: {
    height: 32,
    width: '90%',
    boxShadow: 'none',
    borderRadius: 0,
    marginRight: 2,
    background: theme.palette.platinum.main,
    padding: theme.spacing(1),
    paddingRight: theme.spacing(0),
  },
  selected: {
    background: 'white',
  },
  tooltip: {
    fontSize: '1.2em',
    padding: theme.spacing(2),
  },
}))

interface Props {
  className?: string
}

export function SortOptionSelect(props: Props) {
  const { className } = props
  const cls = useStyles()
  const { t } = useTranslation()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'))
  const params = useParsedParams()
  const sortOption =
    params.sort && config.sortOptions.indexOf(params.sort) >= 0
      ? params.sort
      : 'score-desc'
  const triggerLink = useTriggerLink()

  const change = (event: ChangeEvent<{ name?: string; value?: any }>) => {
    const sortOption = event.target.value
    const location: WebModuleLocation = {
      pathname: '/',
      hash: '',
      search: toSearchParams({
        ...params,
        sort: sortOption,
      }),
    }
    triggerLink(location)
  }

  return (
    <FormControl className={className} variant="filled">
      <NativeSelect
        data-testid="discovery-search-bar-sort-select"
        className={clsx(cls.select, cls.itemTypo)}
        value={sortOption}
        onChange={change}
        name={t('sortOptionName')}
        inputProps={{ 'aria-label': t('sortOptionName') }}
      >
        {config.sortOptions.map((option) => (
          <option key={option} value={option}>
            {(mobile &&
              t(
                'sortOptionsMobile',
                option.replace(/-([a-z])/g, function (value: string) {
                  return value[1].toUpperCase()
                })
              )) ||
              t(
                'sortOptions',
                option.replace(/-([a-z])/g, function (value: string) {
                  return value[1].toUpperCase()
                })
              )}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  )
}
