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

import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import CloseIcon from '@material-ui/icons/Close'
import { walk } from 'src/utils/walk'

const useStyles = makeStyles((theme) => ({
  dialog: {
    display: 'flex',
    flexDirection: 'row',
    margin: 0,
  },
  left: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  right: {
    padding: theme.spacing(2),
  },
  h1: {
    ...theme.typography.h1,
  },
  h2: {
    ...theme.typography.h2,
  },
  h3: {
    ...theme.typography.subtitle1,
  },
  b: {
    ...theme.typography.body2,
  },
  default: {
    ...theme.typography.body1,
  },
}))

function HelpText(props: { html: string }) {
  const cls = useStyles()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = props.html

      walk(ref.current, (node) => {
        if (node instanceof HTMLElement) {
          switch (node.tagName.toLowerCase()) {
            case 'h1':
              node.classList.add(cls.h1)
              break
            case 'h2':
              node.classList.add(cls.h2)
              break
            case 'h3':
              node.classList.add(cls.h3)
              break
            case 'b':
              node.classList.add(cls.b)
              break
            default:
              node.classList.add(cls.default)
          }
        }
      })
    }
  }, [])

  return <div ref={ref} />
}

interface Props {
  html: string
  'aria-label': string
}

export function Help(props: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))
  const cls = useStyles()

  const [show, setShow] = useState(false)
  const toggle = () => setShow(!show)

  return (
    <>
      <IconButton onClick={toggle} aria-label={props['aria-label']}>
        <HelpOutlineIcon />
      </IconButton>
      <Dialog
        fullScreen={isMobile}
        classes={{
          paper: clsx(cls.dialog),
        }}
        open={show}
        onClose={toggle}
      >
        <div className={cls.left}>
          <HelpText html={props.html} />
        </div>
        <div className={cls.right}>
          <IconButton onClick={toggle}>
            <CloseIcon />
          </IconButton>
        </div>
      </Dialog>
    </>
  )
}
