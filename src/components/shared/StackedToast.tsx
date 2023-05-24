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

import { Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/Info'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { makeStyles } from '@material-ui/core/styles'
import { SnackbarKey, SnackbarMessage, useSnackbar } from 'notistack'
import React, { forwardRef, useCallback } from 'react'

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
