import clsx from 'clsx'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import MuiButtonBase from '@material-ui/core/ButtonBase'
import MuiLink from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'

import { FabButton } from 'src/components/shared/FabButton'
import { Tooltip } from 'src/components/shared/Tooltip'
import { WorkspaceToast } from 'src/components/shared/WorkspaceToast'
import { HspDigitized } from 'src/contexts/discovery'
import { useEvent } from 'src/contexts/events'
import { useTranslation } from 'src/contexts/i18n'
import { selectors } from 'src/contexts/state'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 120,
    position: 'relative',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  buttonWrapper: {
    borderRadius: 45,
  },
  button: {
    margin: 3,
    padding: 6,
    borderRadius: 45,
    cursor: 'pointer',
    background: theme.palette.liver.main,
  },
  link: {
    padding: 0,
    margin: 0,
  },
  on: {
    background: theme.palette.secondary.main,
  },
  tooltip: {
    maxWidth: 450,
  },
}))

interface Props {
  className?: string
  hspDigitizeds: HspDigitized[]
}

export function Thumbnails(props: Props) {
  const { className, hspDigitizeds } = props
  const [current, setCurrent] = useState(0)
  const cls = useStyles()
  const { t } = useTranslation()
  const fireOpenResourceClicked = useEvent('openResourceClicked')
  const fireSelectResourceClicked = useEvent('selectResourceClicked')
  const fireUnselectResourceClicked = useEvent('unselectResourceClicked')
  const selectedResources = useSelector(selectors.getSelectedResources)

  const [toastMessage, setToastMessage] = useState(null as null | string)

  const handleToastClose = () => {
    setToastMessage(null)
  }

  const digitizedsWithThumbnails = hspDigitizeds.filter(
    (digi) => digi['thumbnail-uri-display'],
  )

  if (digitizedsWithThumbnails.length === 0) {
    return null
  }

  function openResource(id: string) {
    fireOpenResourceClicked({
      type: 'iiif:manifest',
      id,
    })
  }

  function renderImage(digi: HspDigitized) {
    return (
      <img
        alt={t('resource', 'thumbnailImage')}
        src={digi['thumbnail-uri-display'] as string}
        width={120}
      />
    )
  }

  const currentDigi = digitizedsWithThumbnails[current]
  const isManifest = currentDigi['manifest-uri-display']
  const isExternal = !isManifest && currentDigi['external-uri-display']
  const isIncomplete = !(isManifest || isExternal)

  const isAlreadyAdded = selectedResources.some(
    (r) => r.id === currentDigi['manifest-uri-display'],
  )

  function fireResourceEvent(what: 'select' | 'unselect' | 'open') {
    const fire = {
      select: fireSelectResourceClicked,
      unselect: fireUnselectResourceClicked,
      open: fireOpenResourceClicked,
    }[what]

    if (currentDigi['manifest-uri-display']) {
      fire({
        type: 'iiif:manifest',
        id: currentDigi['manifest-uri-display'],
      })
    }

    what === 'select' && setToastMessage('addToWorkspace')
    what === 'unselect' && setToastMessage('removeFromWorkspace')
  }

  return (
    <div className={clsx(cls.root, className)}>
      {isManifest && (
        <>
          <Tooltip
            title={t('resources', 'openManifestInWorkarea') as string}
            className={cls.tooltip}
          >
            <MuiLink
              aria-label={t('resources', 'openManifestInWorkarea')}
              className={clsx(cls.link)}
              component="button"
              variant="body2"
              onClick={() =>
                openResource(currentDigi['manifest-uri-display'] as string)
              }
              tabIndex={0}
            >
              {renderImage(currentDigi)}
            </MuiLink>
          </Tooltip>
          <FabButton
            isAlreadyAdded={isAlreadyAdded}
            isThumbnail={true}
            onClickSelect={() => fireResourceEvent('select')}
            onClickUnselect={() => fireResourceEvent('unselect')}
          />
        </>
      )}
      {isExternal && (
        <Tooltip
          title={t('resources', 'openDigitalImagesExternal') as string}
          className={cls.tooltip}
        >
          <MuiLink
            aria-label={t('resources', 'openDigitalImagesExternal')}
            className={clsx(cls.link)}
            variant="body2"
            href={currentDigi['external-uri-display'] as string}
            target="_blank"
            tabIndex={0}
          >
            {renderImage(currentDigi)}
          </MuiLink>
        </Tooltip>
      )}
      {isIncomplete && renderImage(currentDigi)}
      <div className={cls.navigation} role="tablist">
        {digitizedsWithThumbnails.length > 1 &&
          digitizedsWithThumbnails.map((digi, index) => (
            <MuiButtonBase
              key={digi.id}
              className={cls.buttonWrapper}
              onClick={() => setCurrent(index)}
              role="tab"
            >
              <span
                className={clsx(cls.button, { [cls.on]: current === index })}
              />
            </MuiButtonBase>
          ))}
      </div>
      <WorkspaceToast
        open={toastMessage !== null}
        handleClose={handleToastClose}
        message={t('snackMsg', toastMessage)}
      />
    </div>
  )
}
