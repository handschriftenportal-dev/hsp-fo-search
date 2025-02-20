import clsx from 'clsx'
import React from 'react'

import Fab from '@material-ui/core/Fab'
import makeStyles from '@material-ui/core/styles/makeStyles'
import AddIcon from '@material-ui/icons/Add'
import CheckIcon from '@material-ui/icons/Check'

import { Tooltip } from 'src/components/shared/Tooltip'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles((theme) => ({
  fab: {
    right: theme.spacing(-3),
    position: 'absolute',
    top: theme.spacing(2),
    color: 'white',
  },
  fabIcon: {
    lineHeight: 'unset',
  },
  digitizedOutline: {
    '&:focus-visible': {
      outlineColor: theme.palette.white.main + '!important',
    },
  },
  liver: {
    backgroundColor: theme.palette.liver.main,
    '&:hover': {
      backgroundColor: theme.palette.liver.main,
    },
  },
  turquoise: {
    backgroundColor: theme.palette.turquoise.main,
    '&:hover': {
      backgroundColor: theme.palette.turquoise.main,
    },
  },
}))

interface Props {
  className?: string
  isAlreadyAdded: boolean
  onClickSelect: () => void
  onClickUnselect: () => void
  isDescription?: boolean
  isThumbnail?: boolean
}

export function FabButton(props: Props) {
  const {
    isAlreadyAdded,
    onClickSelect,
    onClickUnselect,
    isDescription,
    isThumbnail,
  } = props

  const cls = useStyles()
  const { t } = useTranslation()

  const alreadyAddedTitle = isDescription
    ? t('resources', 'removeDescription')
    : t('resources', 'removeDigitalImage')

  const notAddedTitle = isDescription
    ? t('resources', 'addDescription')
    : t('resources', 'addDigitalImage')

  const digiOutlineOverview = {
    [cls.digitizedOutline]: !isDescription && !isThumbnail,
  }

  return (
    <>
      {isAlreadyAdded ? (
        <Tooltip title={alreadyAddedTitle}>
          <Fab
            size="medium"
            className={clsx(cls.fab, cls.liver, {
              ...digiOutlineOverview,
            })}
            onClick={onClickUnselect}
            aria-label={alreadyAddedTitle}
          >
            <CheckIcon className={cls.fabIcon} />
          </Fab>
        </Tooltip>
      ) : (
        <Tooltip title={notAddedTitle}>
          <Fab
            size="medium"
            className={clsx(cls.fab, cls.turquoise, {
              ...digiOutlineOverview,
            })}
            onClick={onClickSelect}
            aria-label={notAddedTitle}
          >
            <AddIcon className={cls.fabIcon} />
          </Fab>
        </Tooltip>
      )}
    </>
  )
}
