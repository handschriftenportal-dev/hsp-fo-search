import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'

import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CloseIcon from '@material-ui/icons/Close'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

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
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
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
