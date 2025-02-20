import React from 'react'

import Button from '@material-ui/core/Button'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { useEvent } from 'src/contexts/events'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles((theme) => ({
  backButton: {
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      textWrap: 'nowrap',
    },
    [theme.breakpoints.down('sm')]: { textWrap: 'pretty' },
  },
}))

export default function BackWorkspaceButton() {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const { t } = useTranslation()
  const cls = useStyles()
  const fireOpenWorkspaceClicked = useEvent('backToWorkspace')

  const text = mobile
    ? t('overview', 'buttonBackToWorkspaceMobile')
    : t('overview', 'buttonBackToWorkspaceDesktop')
  return (
    <Button
      className={cls.backButton}
      startIcon={<img src={`/img/workspace.svg`} aria-hidden={true} />}
      onClick={() => fireOpenWorkspaceClicked('backToWorkspace')}
    >
      {text}
    </Button>
  )
}
