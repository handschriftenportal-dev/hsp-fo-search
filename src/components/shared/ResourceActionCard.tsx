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

import React, { ReactNode, useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab'
import { useSelector } from 'react-redux'
import { selectors } from 'src/contexts/state'
import { HspDescription, HspDigitized } from 'src/contexts/discovery'
import { useEvent } from 'src/contexts/events'
import { Tooltip } from 'src/components/shared/Tooltip'
import { useTranslation } from 'src/contexts/i18n'
import { useSnackbar } from 'notistack'
import StackedToast from './StackedToast'
import CloseIcon from '@material-ui/icons/Close'
import { FabButton } from './FabButton'

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
      outlineColor: theme.palette.white.main + '!important',
    },
  },
  head: {
    cursor: 'pointer',
    '&:focus-visible': {
      outlineOffset: theme.spacing(0.5),
    },
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
  const { enqueueSnackbar } = useSnackbar()
  const fireOpenResourceClicked = useEvent('openResourceClicked')
  const fireSelectResourceClicked = useEvent('selectResourceClicked')
  const fireUnselectResourceClicked = useEvent('unselectResourceClicked')
  const selectedResources = useSelector(selectors.getSelectedResources)
  const isDescription = resource.type !== 'hsp:digitized'
  const [isOpen, setIsOpen] = useState(false)

  const isAlreadyAdded =
    resource.type === 'hsp:description' ||
    resource.type === 'hsp:description_retro'
      ? selectedResources.some((r) => r.id === resource.id)
      : selectedResources.some(
          (r) => r.id === (resource as HspDigitized)['manifest-uri-display']
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
                ? clsx(!off && cls.head)
                : clsx(!off && cls.head && cls.digitizedOutline)
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
    </Paper>
  )
}
