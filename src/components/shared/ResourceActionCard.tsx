import clsx from 'clsx'
import React, { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'

import Fab from '@material-ui/core/Fab'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

import { Tooltip } from 'src/components/shared/Tooltip'
import { HspDescription, HspDigitized } from 'src/contexts/discovery'
import { useEvent } from 'src/contexts/events'
import { useTranslation } from 'src/contexts/i18n'
import { selectors } from 'src/contexts/state'

import { FabButton } from './FabButton'
import { WorkspaceToast } from './WorkspaceToast'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  button: {
    lineHeight: 'unset',
  },
  fabButton: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(-3),
    color: 'white',
  },
  digitizedOutline: {
    '&:focus-visible': {
      outline: `${theme.spacing(0.5)}px solid ${
        theme.palette.white.main
      } !important`,
      outlineOffset: theme.spacing(0.25),
    },
  },
  head: {
    cursor: 'pointer',
  },
  off: {
    color: theme.palette.liver.main,
    cursor: 'not-allowed',
  },
  platinum: {
    backgroundColor: theme.palette.platinum.main,
    '&:hover': {
      backgroundColor: theme.palette.platinum.main,
    },
  },
}))

interface Props {
  className?: string
  resource: HspDescription | HspDigitized
  head?: ReactNode
  children?: ReactNode
  off?: boolean
  query?: string
}

export function ResourceActionCard(props: Props) {
  const { children, className, head, resource, off, query } = props
  const cls = useStyles()
  const { t } = useTranslation()
  const fireOpenResourceClicked = useEvent('openResourceClicked')
  const fireSelectResourceClicked = useEvent('selectResourceClicked')
  const fireUnselectResourceClicked = useEvent('unselectResourceClicked')
  const selectedResources = useSelector(selectors.getSelectedResources)
  const isDescription = resource.type !== 'hsp:digitized'
  const [isOpen, setIsOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null as null | string)

  const handleToastClose = () => {
    setToastMessage(null)
  }

  const isAlreadyAdded =
    resource.type === 'hsp:description' ||
    resource.type === 'hsp:description_retro'
      ? selectedResources.some((r) => r.id === resource.id)
      : selectedResources.some(
          (r) => r.id === (resource as HspDigitized)['manifest-uri-display'],
        )

  function fireResourceEvent(what: 'select' | 'unselect' | 'open') {
    const fire = {
      select: fireSelectResourceClicked,
      unselect: fireUnselectResourceClicked,
      open: fireOpenResourceClicked,
    }[what]

    if (
      resource.type === 'hsp:description' ||
      resource.type === 'hsp:description_retro'
    ) {
      fire({
        type: resource.type,
        id: resource.id,
        query,
      })
    } else if (resource.type === 'hsp:digitized') {
      // this is just a precaution.
      // it's recommended to check in the parent component if manifest-uri-display is present
      // and set props.off to true if not exists.
      if (resource['manifest-uri-display']) {
        fire({
          type: 'iiif:manifest',
          id: resource['manifest-uri-display'],
        })
      }
    }

    what === 'select' && setToastMessage('addToWorkspace')
    what === 'unselect' && setToastMessage('removeFromWorkspace')
  }

  return (
    <Paper className={clsx(cls.root, className)} square>
      {head && (
        <Tooltip
          title={
            isDescription
              ? t('resources', 'openDescription')
              : t('resources', 'openManifestInWorkarea')
          }
          disable={off}
        >
          <div
            className={
              isDescription
                ? clsx(!off && clsx(cls.head, 'addFocusableWithOutline'))
                : clsx(!off && clsx(cls.head, cls.digitizedOutline))
            }
            tabIndex={!off ? 0 : -1}
            onClick={off ? undefined : () => fireResourceEvent('open')}
            onKeyDown={
              off
                ? undefined
                : (e) => {
                    if (e.key === 'Enter') {
                      fireResourceEvent('open')
                    }
                  }
            }
          >
            {head}
          </div>
        </Tooltip>
      )}
      {children}
      {!off ? (
        <FabButton
          isAlreadyAdded={isAlreadyAdded}
          isDescription={isDescription}
          onClickSelect={() => fireResourceEvent('select')}
          onClickUnselect={() => fireResourceEvent('unselect')}
        />
      ) : (
        isDescription && (
          <Fab
            size="medium"
            className={clsx(cls.fabButton, cls.platinum, cls.off)}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={t('resources', 'catalogNoDigitalCopy')}
          >
            <Tooltip
              title={t('resources', 'catalogNoDigitalCopy')}
              open={isOpen}
              onClose={() => setIsOpen(false)}
              onOpen={() => setIsOpen(true)}
            >
              <CloseIcon className={cls.button} />
            </Tooltip>
          </Fab>
        )
      )}
      <WorkspaceToast
        open={toastMessage !== null}
        handleClose={handleToastClose}
        message={t('snackMsg', toastMessage)}
      />
    </Paper>
  )
}
