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
import MuiTooltip from '@material-ui/core/Tooltip'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: '1.2em',
    padding: theme.spacing(2),
  },
  childrenWrapper: {
    display: 'inherit',
  },
}))

interface Props {
  children: React.ReactElement | React.ReactElement[]
  disable?: boolean
  open?: boolean
  onClose?: () => void
  onOpen?: () => void
  title?: string
  className?: string
}

export function Tooltip(props: Props) {
  const cls = useStyles()
  const { children, disable, open, onClose, onOpen, title } = props

  if (disable || !title) {
    return <>{children}</>
  }

  return (
    <MuiTooltip
      arrow={true}
      classes={{
        tooltip: clsx(cls.tooltip, props.className),
      }}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      title={title}
    >
      <div className={cls.childrenWrapper}>{children}</div>
    </MuiTooltip>
  )
}
