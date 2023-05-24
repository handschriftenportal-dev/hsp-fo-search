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
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    position: 'relative',
    padding: theme.spacing(0.5),
    textTransform: 'uppercase',
    cursor: 'pointer',
    color: 'white',
    textAlign: 'center',
    scrollMarginTop: '200px',
    scrollBehavior: 'smooth',
    [theme.breakpoints.only('xs')]: {
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(3),
      minWidth: '231px',
    },
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.black.main} !important`,
      outlineOffset: theme.spacing(0.25),
    },
  },
  notActive: {
    background: theme.palette.liver.main,
    '&:after': {
      position: 'absolute',
      content: '""',
      width: 0,
      height: 0,
      top: '100%',
      left: '48%',
      borderLeft: '12px solid transparent',
      borderRight: '12px solid transparent',
      borderTop: `12px solid ${theme.palette.liver.main}`,
    },
    // md & sm not streching correctly
    [theme.breakpoints.only('sm')]: {
      position: 'fixed',
      left: '40%',
      width: '55%',
    },
    [theme.breakpoints.only('md')]: {
      position: 'fixed',
      minWidth: '370px',
      left: '34%',
    },
    [theme.breakpoints.up('lg')]: {
      position: 'fixed',
      width: '500px',
      left: '34.3%',
    },
  },
  active: {
    background: theme.palette.primary.main,
    '&:after': {
      position: 'absolute',
      content: '""',
      width: 0,
      height: 0,
      bottom: '100%',
      left: '48%',
      borderLeft: '12px solid transparent',
      borderRight: '12px solid transparent',
      borderBottom: `12px solid ${theme.palette.primary.main}`,
    },
    // md & sm not streching correctly
    [theme.breakpoints.only('sm')]: {
      position: 'sticky',
      width: '475px',
      marginRight: '48px',
      float: 'right',
    },
    [theme.breakpoints.only('md')]: {
      position: 'sticky',
      width: '370px',
      left: '34%',
    },
    [theme.breakpoints.up('lg')]: {
      position: 'sticky',
      width: '500px',
      left: '34.3%',
    },
  },
}))

interface Props {
  className?: string
  active: boolean
  onClick: () => void
  title: string
  toggle: () => void
}

export function FilterButton(props: Props) {
  const cls = useStyles()

  return (
    <div
      className={clsx(
        cls.root,
        props.active ? cls.active : cls.notActive,
        props.className
      )}
      onClick={props.onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          props.toggle()
        }
      }}
      role="button"
      tabIndex={0}
      id="filterOptions"
    >
      {props.title}
    </div>
  )
}
