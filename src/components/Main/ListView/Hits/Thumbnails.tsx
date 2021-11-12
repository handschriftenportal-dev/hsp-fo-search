/*
 * MIT License
 *
 * Copyright (c) 2021 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
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
import { Tooltip } from 'src/components/shared/Tooltip'
import { useEvent } from 'src/contexts/events'
import { useTranslation } from 'src/contexts/i18n'
import { HspDigitized } from 'src/contexts/discovery'


const useStyles = makeStyles(theme => ({
  root: {
    width: 120,
  },
  navigation: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  button: {
    margin: 3,
    padding: 6,
    borderRadius: 45,
    background: theme.palette.grey[200],
    cursor: 'pointer',
  },
  link: {
    padding: 0,
    margin: 0,
  },
  on: {
    background: theme.palette.secondary.main
  },
  tooltip: {
    fontSize: '1.2em',
    padding: theme.spacing(2),
  }
}))

interface Props {
  className?: string;
  hspDigitizeds: HspDigitized[];
}

export function Thumbnails(props: Props) {
  const { className, hspDigitizeds } = props
  const [current, setCurrent] = useState(0)
  const cls = useStyles()
  const { t } = useTranslation()
  const fireOpenResourceClicked = useEvent('openResourceClicked')

  const digitizedsWithThumbnails = hspDigitizeds.filter(digi => digi['thumbnail-uri-display'])

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

  return (
    <div className={clsx(cls.root, className)}>
      { isManifest &&
        <Tooltip title={t('resources', 'openManifestInWorkarea') as string}>
          <MuiLink
            aria-label={t('resources', 'openManifestInWorkarea')}
            className={clsx(cls.link)}
            component="button"
            variant="body2"
            onClick={ () => openResource(currentDigi['manifest-uri-display'] as string) } >
            { renderImage(currentDigi) }
          </MuiLink>
        </Tooltip>
      }
      { isExternal &&
        <Tooltip title={t('resources', 'openDigitalImagesExternal') as string}>
          <MuiLink
            aria-label={t('resources', 'openDigitalImagesExternal')}
            className={clsx(cls.link)}
            variant="body2"
            href={ currentDigi['external-uri-display'] as string }
            target="_blank" >
            { renderImage(currentDigi) }
          </MuiLink>
        </Tooltip>
      }
      { isIncomplete && renderImage(currentDigi) }
      <div className={cls.navigation} role="tablist">
        {
          digitizedsWithThumbnails.length > 1 && digitizedsWithThumbnails.map((digi, index) => (
            <span
              key={digi.id as string}
              role="tab"
              className={clsx(cls.button, {
                [cls.on]: current === index
              })}
              onClick={() => setCurrent(index)}
            />
          ))
        }
      </div>
    </div>
  )
}
