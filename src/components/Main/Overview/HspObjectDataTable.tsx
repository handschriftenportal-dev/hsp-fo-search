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
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Paper from '@material-ui/core/Paper'
import { KeyValueTable } from './KeyValueTable'
import { HspObject } from 'src/contexts/discovery'
import * as config from 'src/components/config'
import { useTranslation } from 'src/contexts/i18n'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    padding: theme.spacing(8),
    justifyContent: 'center'
  },
  subTableLeft: {
    marginRight: theme.spacing(8),
    flexBasis: '50%',
  },
  subTableRight: {
    flexBasis: '50%',
  }
}))


interface Props {
  className?: string;
  hspObject: HspObject;
}

export function HspObjectDataTable({ className, hspObject }: Props) {
  const cls = useStyles()
  const theme = useTheme()
  const { t } = useTranslation()
  const narrow = useMediaQuery(theme.breakpoints.down('md'), {
    // to prevent unwanted layout effects while auto-scrolling to the resource
    // sections of the overview page we render the narrow (heigher) variant by
    // default.
    defaultMatches: true
  })

  function makeKeyValueData(fields: string[]) {
    return fields.reduce((acc, field) => {
      const value = (hspObject as any)[field]
      const translatedField = t('data', field, '__field__')
      const translatedValue = t('data', field, value)
      return { ...acc, [translatedField]: translatedValue }
    }, {})
  }

  const dataLeft = makeKeyValueData(config.dataTableFieldsLeft)
  const dataRight = makeKeyValueData(config.dataTableFieldsRight)

  const renderNarrow = () => (
    <Paper
      className={clsx(cls.root, className)}
      square
    >
      <KeyValueTable data={{ ...dataLeft, ...dataRight }} />
    </Paper>
  )

  const renderWide = () => (
    <Paper
      className={clsx(cls.root, className)}
      square
    >
      <KeyValueTable
        className={cls.subTableLeft}
        data={dataLeft}
      />
      <KeyValueTable
        className={cls.subTableRight}
        data={dataRight}
      />
    </Paper>
  )

  return (narrow ? renderNarrow : renderWide)()
}
