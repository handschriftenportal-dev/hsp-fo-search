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
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import MuiLink from '@material-ui/core/Link'
import MuiButtonBase from '@material-ui/core/ButtonBase'
import { Tooltip } from 'src/components/shared/Tooltip'
import { useEvent } from 'src/contexts/events'
import { useTranslation } from 'src/contexts/i18n'
import { HspDigitized } from 'src/contexts/discovery'
import { useSelector } from 'react-redux'
import { selectors } from 'src/contexts/state'

import StackedToast from 'src/components/shared/StackedToast'
import { useSnackbar } from 'notistack'
import { FabButton } from 'src/components/shared/FabButton'

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
  const { enqueueSnackbar } = useSnackbar()

  const digitizedsWithThumbnails = hspDigitizeds.filter(
    (digi) => digi['thumbnail-uri-display']
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

  const selectedResources = useSelector(selectors.getSelectedResources)

  const isAlreadyAdded = selectedResources.some(
    (r) => r.id === (currentDigi as HspDigitized)['manifest-uri-display']
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

    what === 'select' &&
      enqueueSnackbar(t('snackMsg', 'addToWorkspace'), {
        content: (key, message) => <StackedToast id={key} message={message} />,
      })
    what === 'unselect' &&
      enqueueSnackbar(t('snackMsg', 'removeFromWorkspace'), {
        content: (key, message) => <StackedToast id={key} message={message} />,
      })
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
              key={digi.id as string}
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
    </div>
  )
}
