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

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  row: {
    borderTop: '1px solid #444',
    display: 'grid',
    gap: theme.spacing(4),
    gridTemplateColumns: 'minmax(100px, 1fr) 3fr',
    hyphens: 'auto',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    wordBreak: 'break-word',
  },
}))

interface Props {
  className?: string
  data: Record<string, string>
}

export function KeyValueTable({ className, data }: Props) {
  const cls = useStyles()

  return (
    <div className={className}>
      {Object.keys(data).map((key) => (
        <div className={cls.row} key={key}>
          <Typography variant="body2">{key}:</Typography>
          <Typography variant="body1">{data[key]}</Typography>
        </div>
      ))}
    </div>
  )
}
