import React from 'react'

import { Portal, Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme) => ({
  containerRoot: {
    top: '80px',
    maxWidth: 300,
    marginLeft: 'auto',
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      bottom: 'unset',
      right: 'unset',
      top: '275px',
      transform: 'translateX(0)',
    },
  },
  snackbar: {
    backgroundColor: theme.palette.electricBlue.main,
    color: 'black',
    pointerEvents: 'all',
    display: 'flex',
    alignItems: 'flex-start',
  },
  content: {
    display: 'flex',
    flexDirection: 'row-reverse',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 200,
      flexDirection: 'row',
    },
  },
  itemIcon: {
    justifyContent: 'flex-end',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start',
    },
  },
  closeIcon: {
    paddingY: theme.spacing(1),
    cursor: 'pointer',
  },
  arrowIcon: {
    fontSize: theme.spacing(4),
    paddingX: theme.spacing(1),
  },
}))

interface Props {
  open: boolean
  message: string
  handleClose: () => void
}

export function WorkspaceToast(props: Readonly<Props>) {
  const cls = useStyles()
  const { open, handleClose, message } = props
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Portal container={document.getElementById('hsp-search-main')}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        key={message}
        className={cls.containerRoot}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <SnackbarContent
          className={cls.snackbar}
          message={
            <div className={cls.content}>
              <ListItemIcon className={cls.itemIcon}>
                {mobile ? (
                  <ArrowUpwardIcon className={cls.arrowIcon} />
                ) : (
                  <ArrowBackIcon className={cls.arrowIcon} />
                )}
              </ListItemIcon>
              <Typography>{message}</Typography>
            </div>
          }
          action={
            <IconButton onClick={handleClose}>
              <CloseIcon className={cls.closeIcon} />
            </IconButton>
          }
        />
      </Snackbar>
    </Portal>
  )
}
