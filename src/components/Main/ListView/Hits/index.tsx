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
import { makeStyles } from '@material-ui/core/styles'
import { Hit } from './Hit'
import { HspObjectsByQueryOutput } from 'src/contexts/discovery'
import { selectors } from 'src/contexts/state'
import { useSelector } from 'react-redux'
import { useTranslation } from 'src/contexts/i18n'


const useStyles = makeStyles(theme => ({
  root: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  spacing: {
    marginBottom: theme.spacing(3)
  },
}))

interface Props {
  className?: string;
  result: HspObjectsByQueryOutput;
}

export function Hits({ className, result }: Props) {
  const cls = useStyles()
  const variant = useSelector(selectors.getHitListVariant)
  const { t } = useTranslation()

  return (
    <ul
      className={clsx(cls.root, className)}
      aria-label={t('searchResults')}
    >
      {
        result.payload.map(group => (
          <li key={group.hspObject.id}>
            <Hit
              className={cls.spacing}
              variant={variant}
              hspObjectGroup={group}
              highlighting={result.metadata.highlighting || {}}
            />
          </li>
        ))
      }
    </ul>
  )
}
