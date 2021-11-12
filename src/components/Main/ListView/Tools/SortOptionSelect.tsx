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

import React, { ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'src/contexts/i18n'
import * as config from 'src/components/config'
import NativeSelect from '@material-ui/core/NativeSelect'
import FormControl from '@material-ui/core/FormControl'
import { WebModuleLocation } from 'hsp-web-module/src/index'
import { toSearchParams, useParsedParams } from 'src/contexts/location'
import { useTriggerLink } from 'src/contexts/routing'


const useStyles = makeStyles(theme => ({
  select: {
    height: 40,
    width: '90%',
    boxShadow: 'none',
    borderRadius: 0,
    marginRight: 2,
    background: theme.palette.grey[200],
    padding: theme.spacing(1),
  },
  selected: {
    background: 'white',
  },
  tooltip: {
    fontSize: '1.2em',
    padding: theme.spacing(2),
  }
}))

interface Props {
  className?: string;
}

export function SortOptionSelect(props: Props) {
  const { className } = props
  const cls = useStyles()
  const { t } = useTranslation()
  const params = useParsedParams()
  const sortOption = (params.sort && config.sortOptions.indexOf(params.sort) >= 0)
    ? params.sort
    : 'score-desc'
  const triggerLink = useTriggerLink()

  const change = (event: ChangeEvent<{ name?: string, value?: any }>) => {
    const sortOption = event.target.value
    const link: WebModuleLocation = {
      path: '/',
      hash: '',
      params: toSearchParams({
        ...params,
        sort: sortOption,
      })
    }
    triggerLink(link)
  }

  return (
    <FormControl className={className} variant="filled">
      <NativeSelect
        data-testid="discovery-search-bar-sort-select"
        className={cls.select}
        value={sortOption}
        onChange={ change }
        name={t('sortOptionName')}
        inputProps={{ 'aria-label': t('sortOptionName') }}
      >
        {
          config.sortOptions.map((option) => (
            <option
              key={option}
              value={option}
            >
              {t('sortOptions', option.replace(
                /-([a-z])/g,
                function(value: string) { return value[1].toUpperCase() }
              ))}
            </option>)
          )
        }
      </NativeSelect>
    </FormControl>
  )
}

