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

import React, { useState, ReactNode } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'


const useStyles = makeStyles(theme => ({
  head: {
    display: 'flex',
    alignItems: 'flex-end',
    padding: theme.spacing(1),
    cursor: 'pointer',
  },
  icon: {
    marginRight: theme.spacing(1),
  }
}))

interface Props {
  className?: string;
  classes?: {
    head?: string;
  }
  children: ReactNode;
  label: string;
  defaultOpen: boolean;
}

export function Accordion(props: Props) {
  const { className, label, children, classes, defaultOpen } = props
  const cls = useStyles()
  const [open, setOpen] = useState(defaultOpen)

  const toggle = () => setOpen(!open)

  return (
    <div className={className}>
      <div
        className={clsx(cls.head, classes?.head)}
        onClick={toggle}
      >
        <span className={clsx('material-icons', cls.icon)}>
          { open ? 'arrow_drop_up' : 'arrow_drop_down' }
        </span>
        {label}
      </div>
      <Collapse in={open}>
        {children}
      </Collapse>
    </div>
  )
}
