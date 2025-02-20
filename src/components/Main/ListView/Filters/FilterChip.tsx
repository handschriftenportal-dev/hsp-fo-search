import clsx from 'clsx'
import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    background: theme.palette.platinum.main,
  },
  button: {
    cursor: 'pointer',
    marginLeft: theme.spacing(1),
    fontSize: '1.3rem',
    padding: 0,
  },
}))

interface Props {
  className?: string
  label: string
  onRemove: () => void
}

export function FilterChip(props: Props) {
  const { className, label, onRemove } = props
  const cls = useStyles()

  return (
    <div className={clsx(cls.root, className)}>
      <Typography variant="body2">{label}</Typography>
      <IconButton className={clsx(cls.button)} onClick={onRemove}>
        <CloseIcon />
      </IconButton>
    </div>
  )
}
