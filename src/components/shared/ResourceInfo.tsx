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

import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DescriptionIcon from '@material-ui/icons/Description'
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto'
import { Tooltip } from 'src/components/shared/Tooltip'
import { WebModuleLink } from 'src/contexts/link'
import { useTranslation } from 'src/contexts/i18n'
import { WebModuleLocation } from 'hsp-web-module'
import { ShareLink } from './ShareLink'
import ListItemIcon from '@material-ui/core/ListItemIcon'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    border: 'none',
  },
  anchor: {
    paddingTop: theme.spacing(1),
  },
  button: {
    paddingRight: theme.spacing(1),
    cursor: 'pointer',
    paddingBottom: theme.spacing(1),
    minWidth: 'auto',
    '&:hover': {
      background: 'inherit',
    },
  },
  color: {
    color: theme.palette.liver.light,
  },
  link: {
    textDecoration: 'none',
    paddingLeft: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
  tooltip: {
    fontSize: '1.2em',
    padding: theme.spacing(2),
  },
  vertical: {
    flexDirection: 'column',
  },
}))

interface Props {
  className?: string
  detailPage?: boolean
  linkToDetailView: WebModuleLocation
  numOfDescriptions: number
  numOfDigitizeds: number
  onClick?: (resourceType: 'hsp-descriptions' | 'hsp-digitizeds') => void
  permalink?: string | null
  vertical: boolean
}

export function ResourceInfo(props: Props) {
  const {
    className,
    vertical,
    numOfDescriptions,
    numOfDigitizeds,
    linkToDetailView,
    onClick,
    detailPage,
    permalink,
  } = props
  const cls = useStyles()
  const { t } = useTranslation()

  return (
    <fieldset
      className={clsx(cls.root, { [cls.vertical]: vertical }, className)}
      aria-label={t('hits', 'resources')}
    >
      {detailPage && permalink && <ShareLink permalink={permalink} />}
      {[
        {
          label: t('overview', 'showManuscriptDescriptions'),
          hash: 'hsp-descriptions',
          icon: 'text_snippet',
          count: numOfDescriptions,
        },
        {
          label: t('overview', 'showDigitalImages'),
          hash: 'hsp-digitizeds',
          icon: 'insert_photo',
          count: numOfDigitizeds,
        },
      ].map((resource) => (
        <WebModuleLink
          key={resource.label}
          className={clsx(cls.link, { [cls.anchor]: !vertical })}
          location={{ ...linkToDetailView, hash: resource.hash }}
          ariaLabel={resource.label}
        >
          <Tooltip title={resource.label}>
            <ListItemIcon
              tabIndex={-1}
              className={clsx(cls.button, cls.color)}
              onClick={() => onClick && onClick(resource.hash as any)}
              aria-label={resource.label}
            >
              {resource.icon === 'text_snippet' && (
                <DescriptionIcon aria-hidden="true" />
              )}
              {resource.icon === 'insert_photo' && (
                <InsertPhotoIcon aria-hidden="true" />
              )}
            </ListItemIcon>
            <Typography className={cls.color} component="span" variant="body2">
              {resource.count}
            </Typography>
          </Tooltip>
        </WebModuleLink>
      ))}
    </fieldset>
  )
}
