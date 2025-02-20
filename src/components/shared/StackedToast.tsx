import { SnackbarKey, SnackbarMessage, useSnackbar } from 'notistack'
import React, { forwardRef, useCallback } from 'react'

import { Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/Info'

const useStyles = makeStyles((theme) => ({
  snackbar: {
    backgroundColor: 'white',
    color: 'black',
    pointerEvents: 'all',
  },
  content: {
    alignItems: 'center',
    display: 'flex',
  },
  closeIcon: {
    cursor: 'pointer',
    paddingY: '8px',
  },
  infoIcon: {
    color: theme.palette.secondary.main,
    fontSize: theme.spacing(4),
  },
}))

interface Props {
  id: SnackbarKey
  message: SnackbarMessage
}

const StackedToast = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { id, message } = props
  const cls = useStyles()
  const { closeSnackbar } = useSnackbar()

  const handleDismiss = useCallback(() => {
    closeSnackbar(id)
  }, [id, closeSnackbar])

  return (
    <SnackbarContent
      ref={ref}
      className={cls.snackbar}
      message={
        <span className={cls.content}>
          <ListItemIcon>
            <InfoIcon className={cls.infoIcon} />
          </ListItemIcon>
          <Typography variant="body1">{message}</Typography>
        </span>
      }
      action={
        <IconButton onClick={handleDismiss}>
          <CloseIcon className={cls.closeIcon} />
        </IconButton>
      }
    />
  )
})

StackedToast.displayName = 'StackedToast'
export default StackedToast
