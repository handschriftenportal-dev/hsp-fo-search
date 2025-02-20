import { useSnackbar } from 'notistack'
import React, { useState } from 'react'

import { Button } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import ShareIcon from '@material-ui/icons/Share'

import { Tooltip } from 'src/components/shared/Tooltip'
import { useTranslation } from 'src/contexts/i18n'

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

  const Toast = React.useCallback(
    (key, message) => <StackedToast id={key} message={message} />,
    [],
  )

  const handleCopyLink = () => {
    navigator.clipboard.writeText(permalink)
    enqueueSnackbar(t('snackMsg', 'copyLink'), {
      content: Toast,
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
