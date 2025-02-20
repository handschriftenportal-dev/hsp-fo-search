import React from 'react'

import MuiTooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
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
        tooltip: props.className,
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
