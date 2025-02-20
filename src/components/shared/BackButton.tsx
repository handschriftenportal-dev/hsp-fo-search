import clsx from 'clsx'
import { WebModuleLocation } from 'hsp-web-module'
import React from 'react'

import Button from '@material-ui/core/Button'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'

import { useTranslation } from 'src/contexts/i18n'
import { WebModuleLink } from 'src/contexts/link'

const useStyles = makeStyles((theme) => ({
  extendendBtn: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    whiteSpace: 'nowrap',
  },
  multiline: {
    width: 170,
    whiteSpace: 'normal',
    fontSize: '0.675rem',
    textAlign: 'right',
    lineHeight: '0.9rem',
  },
  backButton: {
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    paddingRight: theme.spacing(2),
    textWrap: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      textWrap: 'pretty',
      marginRight: 'unset',
      paddingRight: 'unset',
    },
  },
}))

interface Props {
  className?: string
  backLocation: WebModuleLocation
  btnType: 'cancel' | 'extendedBtn' | 'back'
}

export default function BackButton({
  className,
  backLocation,
  btnType,
}: Props) {
  const cls = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const { t } = useTranslation()
  let text = ''

  if (btnType === 'back') {
    text = mobile
      ? t('overview', 'buttonBackToSearchMobile')
      : t('overview', 'buttonBackToSearchDesktop')
  } else if (btnType === 'cancel') {
    text = t('cancel')
  } else if (btnType === 'extendedBtn') {
    text = t('searchBar', 'backToNormalSearch')
  }

  return (
    <Button
      className={clsx(
        { [cls.extendendBtn]: btnType === 'extendedBtn' },
        { [cls.backButton]: btnType === 'back' },
        { [cls.multiline]: btnType === 'extendedBtn' },
        className,
      )}
      startIcon={btnType === 'back' ? <SearchIcon /> : <CloseIcon />}
      component={WebModuleLink}
      location={backLocation}
    >
      {text}
    </Button>
  )
}
