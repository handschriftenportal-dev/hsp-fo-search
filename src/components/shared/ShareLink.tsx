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

import React, { useState } from 'react'
import { Tooltip } from 'src/components/shared/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import ShareIcon from '@material-ui/icons/Share'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover'
import { useTranslation } from 'src/contexts/i18n'
import InputBase from '@material-ui/core/InputBase'
import { Button } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import StackedToast from './StackedToast'

const useStyles = makeStyles((theme) => ({
  shareBtn: {
    filter:
      'invert(40%) sepia(0%) saturate(133%) hue-rotate(140deg) brightness(119%) contrast(96%)',
  },
  shareDialog: {
    display: 'flex',
  },
  content: {
    display: 'flex',
    padding: theme.spacing(2),
    paddingRight: theme.spacing(0),
  },
  headline: {
    padding: theme.spacing(2),
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    paddingRight: theme.spacing(0),
  },
  right: {
    padding: theme.spacing(1),
  },
  inputBase: {
    borderRadius: '2px',
    border: '1px solid #ccc',
    background: theme.palette.background.default,
    flexGrow: 1,
    boxShadow: 'inset 4px 5px 4px -4px rgb(0 0 0 / 20%)',
  },
  input: {
    paddingLeft: theme.spacing(1),
  },
  copyButton: {
    marginRight: theme.spacing(2),
  },
  paper: {
    borderRadius: '1px',
  },
}))

interface Props {
  permalink: string
}

export function ShareLink(props: Props) {
  const cls = useStyles()
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const { permalink } = props
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(permalink)
    enqueueSnackbar(t('snackMsg', 'copyLink'), {
      content: (key, message) => <StackedToast id={key} message={message} />,
    })
  }

  return (
    <>
      <Tooltip title={t('permalink', 'tooltip')}>
        <IconButton
          size="small"
          tabIndex={0}
          onClick={(e) => setAnchor(e.currentTarget)}
          aria-label={t('permalink', 'tooltip')}
        >
          <ShareIcon className={cls.shareBtn} aria-hidden="true" />
        </IconButton>
      </Tooltip>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{ className: cls.paper }}
      >
        <div className={cls.shareDialog}>
          <div className={cls.left}>
            <Typography variant="body1" className={cls.headline}>
              {t('permalink', 'text')}
            </Typography>
            <div className={cls.content}>
              <Button
                onClick={handleCopyLink}
                className={cls.copyButton}
                color="primary"
                variant="contained"
                size="small"
                aria-label={t('permalink', 'copy')}
              >
                {t('permalink', 'copy')}
              </Button>
              <InputBase
                className={cls.inputBase}
                value={permalink}
                inputProps={{
                  className: cls.input,
                }}
              />
            </div>
          </div>
          <div className={cls.right}>
            <IconButton onClick={() => setAnchor(null)}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </Popover>
    </>
  )
}
